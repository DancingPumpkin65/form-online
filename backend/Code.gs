const RESPONSES_SHEET_NAME = "Responses";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ success: false, message: "Missing request body." });
    }

    const payload = JSON.parse(e.postData.contents);

    if (!payload.submissionId) {
      return jsonResponse_({ success: false, message: "Missing submissionId." });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      const sheet = getResponsesSheet_();
      const headers = ensureHeaders_(sheet, payload.columnOrder || []);
      const existingSubmissionIds = getExistingSubmissionIds_(sheet, headers);

      if (existingSubmissionIds.has(payload.submissionId)) {
        return jsonResponse_({
          success: true,
          duplicate: true,
          timestamp: new Date().toISOString(),
          message: "Duplicate submission ignored."
        });
      }

      sheet.appendRow(buildRow_(headers, payload));

      return jsonResponse_({
        success: true,
        duplicate: false,
        timestamp: new Date().toISOString()
      });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    return jsonResponse_({
      success: false,
      message: error && error.message ? error.message : "Unexpected server error."
    });
  }
}

function getResponsesSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(RESPONSES_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(RESPONSES_SHEET_NAME);
  }

  return sheet;
}

function ensureHeaders_(sheet, columnOrder) {
  const baseHeaders = [
    "timestamp_server",
    "survey_id",
    "survey_version",
    "submission_id",
    "language",
    "submitted_at_client"
  ];
  const desiredHeaders = baseHeaders.concat(columnOrder);
  const lastColumn = sheet.getLastColumn();

  if (lastColumn === 0) {
    sheet.getRange(1, 1, 1, desiredHeaders.length).setValues([desiredHeaders]);
    sheet.setFrozenRows(1);
    return desiredHeaders;
  }

  const existingHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  const missingHeaders = desiredHeaders.filter((header) => !existingHeaders.includes(header));

  if (missingHeaders.length > 0) {
    sheet
      .getRange(1, existingHeaders.length + 1, 1, missingHeaders.length)
      .setValues([missingHeaders]);
  }

  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function getExistingSubmissionIds_(sheet, headers) {
  const submissionIdIndex = headers.indexOf("submission_id");
  const lastRow = sheet.getLastRow();

  if (submissionIdIndex === -1 || lastRow < 2) {
    return new Set();
  }

  const values = sheet
    .getRange(2, submissionIdIndex + 1, lastRow - 1, 1)
    .getValues()
    .flat()
    .filter(Boolean);

  return new Set(values);
}

function buildRow_(headers, payload) {
  const responses = payload.responses || {};

  return headers.map((header) => {
    switch (header) {
      case "timestamp_server":
        return new Date();
      case "survey_id":
        return payload.surveyId || "";
      case "survey_version":
        return payload.surveyVersion || "";
      case "submission_id":
        return payload.submissionId || "";
      case "language":
        return payload.language || "";
      case "submitted_at_client":
        return payload.submittedAtClient || "";
      default:
        return Object.prototype.hasOwnProperty.call(responses, header) ? responses[header] : "";
    }
  });
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
