const RESPONSES_SHEET_NAME = "YOUR_RESPONSES_SHEET_NAME";
const GOOGLE_SHEET_ID = "YOUR_GOOGLE_SHEET_ID";

const BASE_COLUMNS = [
  "timestamp_server",
  "survey_id",
  "survey_version",
  "submission_id",
  "language",
  "submitted_at_client"
];

const HEADER_LABELS = {
  timestamp_server: "Submitted at (server time)",
  survey_id: "Survey ID",
  survey_version: "Survey version",
  submission_id: "Submission ID",
  language: "Language",
  submitted_at_client: "Submitted at (client time)",
  consent_agree: "Consent. Agreed to participate",
  A1_campus: "A1. ENCG campus",
  A2_year: "A2. Year of study",
  A3_pathway: "A3. Pathway",
  A3_1_gestion_specialization: "A3.1 Gestion specialization",
  A3_1_gestion_specialization_other: "A3.1 Gestion specialization (Other text)",
  A3_2_commerce_specialization: "A3.2 Commerce specialization",
  A3_2_commerce_specialization_other: "A3.2 Commerce specialization (Other text)",
  A4_gender: "A4. Gender",
  A5_age: "A5. Age",
  A6_english_level: "A6. Overall English level",
  A7_pfe_status: "A7. Final-year project (PFE) status",
  A8_internship_status: "A8. Internship status",
  A9_internship_english_frequency: "A9. English use during internship",
  B1_1: "B1.1 Understanding lectures and videos in English",
  B1_2: "B1.2 Reading textbooks, case studies, and articles in English",
  B1_3: "B1.3 Participating in class discussions and group work in English",
  B1_4: "B1.4 Giving academic presentations in English",
  B1_5: "B1.5 Writing academic reports and assignments in English",
  B2_1: "B2.1 Understanding spoken English in professional settings",
  B2_2: "B2.2 Reading professional documents in English",
  B2_3: "B2.3 Speaking English in professional interactions",
  B2_4: "B2.4 Giving professional presentations in English",
  B2_5: "B2.5 Writing professional emails and business correspondence in English",
  B2_6: "B2.6 Writing long professional documents in English",
  C1_1: "C1.1 Listening",
  C1_2: "C1.2 Reading",
  C1_3: "C1.3 Spoken interaction",
  C1_4: "C1.4 Spoken production",
  C1_5: "C1.5 Writing",
  C2_1: "C2.1 Confidence: understanding spoken English in professional settings",
  C2_2: "C2.2 Confidence: reading professional documents in English",
  C2_3: "C2.3 Confidence: speaking English in professional interactions",
  C2_4: "C2.4 Confidence: giving professional presentations in English",
  C2_5: "C2.5 Confidence: writing professional emails and correspondence",
  C2_6: "C2.6 Confidence: writing long professional documents in English",
  D1: "D1. Improve listening skills in English",
  D2: "D2. Improve reading skills in English",
  D3: "D3. Improve speaking skills in English",
  D4: "D4. Improve writing skills in English",
  D5: "D5. Improve Business English vocabulary and terminology",
  D6: "D6. Improve grammar and accuracy in English",
  E1_1: "E1.1 Role-plays and simulations",
  E1_2: "E1.2 Group discussions and collaborative activities",
  E1_3: "E1.3 Case studies, business analyses, and project-based work",
  E1_4: "E1.4 Grammar and vocabulary exercises",
  E2_1: "E2.1 Enough speaking practice in English classes",
  E2_2: "E2.2 Class materials/topics are relevant to future career",
  E2_3: "E2.3 English classes focus more on grammar than real communication",
  E2_4: "E2.4 Teaching methods match preferred learning style",
  F1: "F1. Preparation: Listening",
  F2: "F2. Preparation: Reading",
  F3: "F3. Preparation: Speaking",
  F4: "F4. Preparation: Writing",
  F5: "F5. Preparation: Vocabulary and terminology",
  G1: "G1. One thing English courses should focus more on",
  G2: "G2. One thing English courses do well",
  G3: "G3. Other comments",
  honesty_check: "Honesty check. Use responses in analysis"
};

const VALUE_LABELS = {
  consent_agree: {
    yes: "Yes"
  },
  language: {
    en: "English",
    fr: "French"
  },
  A1_campus: {
    agadir: "Agadir",
    casablanca: "Casablanca",
    dakhla: "Dakhla",
    el_jadida: "El Jadida",
    fes: "Fes",
    kenitra: "Kenitra",
    marrakech: "Marrakech",
    oujda: "Oujda",
    settat: "Settat",
    tangier: "Tangier",
    tetouan: "Tetouan"
  },
  A2_year: {
    "4th_year": "4th year",
    "5th_year": "5th year"
  },
  A3_pathway: {
    gestion: "Gestion",
    commerce: "Commerce",
    not_declared: "Not yet declared"
  },
  A3_1_gestion_specialization: {
    gestion_financiere_comptable: "Gestion Financiere et Comptable",
    audit_controle_gestion: "Audit et Controle de Gestion",
    grh: "Gestion des Ressources Humaines (GRH)",
    logistique: "Logistique",
    not_declared: "Not yet declared",
    other: "Other"
  },
  A3_2_commerce_specialization: {
    marketing_action_commerciale: "Marketing et Action Commerciale",
    commerce_international: "Commerce International",
    publicite_communication: "Publicite et Communication",
    crm: "Customer Relationship Management (CRM)",
    not_declared: "Not yet declared",
    other: "Other"
  },
  A4_gender: {
    female: "Female",
    male: "Male"
  },
  A5_age: {
    under_20: "Under 20",
    "20_22": "20-22",
    "23_25": "23-25",
    over_25: "Over 25"
  },
  A6_english_level: {
    a1_a2: "A1-A2 Beginner / Elementary",
    b1: "B1 Intermediate",
    b2: "B2 Upper-intermediate",
    c1_c2: "C1-C2 Advanced / Mastery"
  },
  A7_pfe_status: {
    not_started: "Not yet started",
    in_progress: "Currently doing it",
    completed: "Completed"
  },
  A8_internship_status: {
    not_started: "Not yet started",
    in_progress: "In progress",
    completed: "Completed"
  },
  A9_internship_english_frequency: {
    never: "Never",
    rarely: "Rarely",
    sometimes: "Sometimes",
    often: "Often",
    always: "Always"
  },
  honesty_check: {
    yes_use: "Yes, please use my responses",
    no_do_not_use: "No, please do not use my responses"
  }
};

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
      const columnKeys = ensureHeaders_(sheet, payload.columnOrder || []);
      const existingSubmissionIds = getExistingSubmissionIds_(sheet, columnKeys);

      if (existingSubmissionIds.has(payload.submissionId)) {
        return jsonResponse_({
          success: true,
          duplicate: true,
          timestamp: new Date().toISOString(),
          message: "Duplicate submission ignored."
        });
      }

      sheet.appendRow(buildRow_(columnKeys, payload));

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
  const spreadsheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID);
  let sheet = spreadsheet.getSheetByName(RESPONSES_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(RESPONSES_SHEET_NAME);
  }

  return sheet;
}

function ensureHeaders_(sheet, columnOrder) {
  const columnKeys = BASE_COLUMNS.concat(columnOrder);
  const displayHeaders = columnKeys.map(getDisplayHeader_);
  const lastColumn = sheet.getLastColumn();

  if (lastColumn < columnKeys.length) {
    sheet.insertColumnsAfter(Math.max(lastColumn, 1), columnKeys.length - lastColumn);
  }

  sheet.getRange(1, 1, 1, columnKeys.length).setValues([displayHeaders]);
  formatHeaderRow_(sheet, columnKeys.length);

  return columnKeys;
}

function formatHeaderRow_(sheet, columnCount) {
  const headerRange = sheet.getRange(1, 1, 1, columnCount);

  headerRange
    .setFontWeight("bold")
    .setBackground("#e8f0fe")
    .setWrap(true)
    .setVerticalAlignment("middle");

  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 48);

  for (let column = 1; column <= columnCount; column += 1) {
    if (column <= BASE_COLUMNS.length) {
      sheet.setColumnWidth(column, 160);
    } else {
      sheet.setColumnWidth(column, 240);
    }
  }
}

function getExistingSubmissionIds_(sheet, columnKeys) {
  const submissionIdIndex = columnKeys.indexOf("submission_id");
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

function buildRow_(columnKeys, payload) {
  const responses = payload.responses || {};

  return columnKeys.map((key) => buildCellValue_(key, payload, responses));
}

function buildCellValue_(key, payload, responses) {
  switch (key) {
    case "timestamp_server":
      return new Date();
    case "survey_id":
      return payload.surveyId || "";
    case "survey_version":
      return payload.surveyVersion || "";
    case "submission_id":
      return payload.submissionId || "";
    case "language":
      return getReadableValue_(key, payload.language || "", responses);
    case "submitted_at_client":
      return payload.submittedAtClient || "";
    default:
      return getReadableValue_(key, responses[key] || "", responses);
  }
}

function getReadableValue_(key, rawValue, responses) {
  if (rawValue === "" || rawValue === null || rawValue === undefined) {
    return "";
  }

  if (key.endsWith("_other")) {
    return rawValue;
  }

  if (rawValue === "other") {
    const otherKey = key + "_other";
    const otherValue = responses[otherKey];

    if (otherValue) {
      return "Other: " + otherValue;
    }
  }

  const fieldMap = VALUE_LABELS[key];

  if (fieldMap && Object.prototype.hasOwnProperty.call(fieldMap, rawValue)) {
    return fieldMap[rawValue];
  }

  return rawValue;
}

function getDisplayHeader_(key) {
  if (Object.prototype.hasOwnProperty.call(HEADER_LABELS, key)) {
    return HEADER_LABELS[key];
  }

  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, function(character) {
      return character.toUpperCase();
    });
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
