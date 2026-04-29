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

const SURVEY_RESPONSE_COLUMNS = [
  "consent_agree",
  "A1_campus",
  "A2_year",
  "A3_pathway",
  "A3_1_gestion_specialization",
  "A3_1_gestion_specialization_other",
  "A3_2_commerce_specialization",
  "A3_2_commerce_specialization_other",
  "A4_gender",
  "A5_age",
  "A6_english_level",
  "A7_pfe_status",
  "A8_internship_status",
  "A9_internship_english_frequency",
  "B1_1",
  "B1_2",
  "B1_3",
  "B1_4",
  "B1_5",
  "B2_1",
  "B2_2",
  "B2_3",
  "B2_4",
  "B2_5",
  "B2_6",
  "C1_1",
  "C1_2",
  "C1_3",
  "C1_4",
  "C1_5",
  "C2_1",
  "C2_2",
  "C2_3",
  "C2_4",
  "C2_5",
  "C2_6",
  "D1",
  "D2",
  "D3",
  "D4",
  "D5",
  "D6",
  "E1_1",
  "E1_2",
  "E1_3",
  "E1_4",
  "E2_1",
  "E2_2",
  "E2_3",
  "E2_4",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "G1",
  "G2",
  "G3",
  "honesty_check"
];

const LIKERT_VALUES = ["1", "2", "3", "4", "5"];

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

const ANALYSIS_SECTIONS = {
  overview: {
    sheetName: "Analysis - Overview"
  },
  A: {
    sheetName: "Analysis - A Background",
    categoricalQuestions: [
      { key: "consent_agree", title: "Consent. Agreed to participate", options: ["Yes"] },
      { key: "A1_campus", title: "A1. ENCG campus", options: ["Agadir", "Casablanca", "Dakhla", "El Jadida", "Fes", "Kenitra", "Marrakech", "Oujda", "Settat", "Tangier", "Tetouan"] },
      { key: "A2_year", title: "A2. Year of study", options: ["4th year", "5th year"] },
      { key: "A3_pathway", title: "A3. Pathway", options: ["Gestion", "Commerce", "Not yet declared"] },
      { key: "A3_1_gestion_specialization", title: "A3.1 Gestion specialization", options: ["Gestion Financiere et Comptable", "Audit et Controle de Gestion", "Gestion des Ressources Humaines (GRH)", "Logistique", "Not yet declared", "Other"] },
      { key: "A3_2_commerce_specialization", title: "A3.2 Commerce specialization", options: ["Marketing et Action Commerciale", "Commerce International", "Publicite et Communication", "Customer Relationship Management (CRM)", "Not yet declared", "Other"] },
      { key: "A4_gender", title: "A4. Gender", options: ["Female", "Male"] },
      { key: "A5_age", title: "A5. Age", options: ["Under 20", "20-22", "23-25", "Over 25"] },
      { key: "A6_english_level", title: "A6. Overall English level", options: ["A1-A2 Beginner / Elementary", "B1 Intermediate", "B2 Upper-intermediate", "C1-C2 Advanced / Mastery"] },
      { key: "A7_pfe_status", title: "A7. Final-year project (PFE) status", options: ["Not yet started", "Currently doing it", "Completed"] },
      { key: "A8_internship_status", title: "A8. Internship status", options: ["Not yet started", "In progress", "Completed"] },
      { key: "A9_internship_english_frequency", title: "A9. English use during internship", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
      { key: "honesty_check", title: "Honesty check. Use responses in analysis", options: ["Yes, please use my responses", "No, please do not use my responses"] }
    ]
  },
  B: {
    sheetName: "Analysis - B Needs",
    likertQuestions: [
      { key: "B1_1", title: "B1.1 Understanding lectures and videos in English" },
      { key: "B1_2", title: "B1.2 Reading textbooks, case studies, and articles in English" },
      { key: "B1_3", title: "B1.3 Participating in class discussions and group work in English" },
      { key: "B1_4", title: "B1.4 Giving academic presentations in English" },
      { key: "B1_5", title: "B1.5 Writing academic reports and assignments in English" },
      { key: "B2_1", title: "B2.1 Understanding spoken English in professional settings" },
      { key: "B2_2", title: "B2.2 Reading professional documents in English" },
      { key: "B2_3", title: "B2.3 Speaking English in professional interactions" },
      { key: "B2_4", title: "B2.4 Giving professional presentations in English" },
      { key: "B2_5", title: "B2.5 Writing professional emails and business correspondence in English" },
      { key: "B2_6", title: "B2.6 Writing long professional documents in English" }
    ]
  },
  C: {
    sheetName: "Analysis - C Proficiency",
    likertQuestions: [
      { key: "C1_1", title: "C1.1 Listening" },
      { key: "C1_2", title: "C1.2 Reading" },
      { key: "C1_3", title: "C1.3 Spoken interaction" },
      { key: "C1_4", title: "C1.4 Spoken production" },
      { key: "C1_5", title: "C1.5 Writing" },
      { key: "C2_1", title: "C2.1 Confidence: understanding spoken English in professional settings" },
      { key: "C2_2", title: "C2.2 Confidence: reading professional documents in English" },
      { key: "C2_3", title: "C2.3 Confidence: speaking English in professional interactions" },
      { key: "C2_4", title: "C2.4 Confidence: giving professional presentations in English" },
      { key: "C2_5", title: "C2.5 Confidence: writing professional emails and correspondence" },
      { key: "C2_6", title: "C2.6 Confidence: writing long professional documents in English" }
    ]
  },
  D: {
    sheetName: "Analysis - D Focus",
    likertQuestions: [
      { key: "D1", title: "D1. Improve listening skills in English" },
      { key: "D2", title: "D2. Improve reading skills in English" },
      { key: "D3", title: "D3. Improve speaking skills in English" },
      { key: "D4", title: "D4. Improve writing skills in English" },
      { key: "D5", title: "D5. Improve Business English vocabulary and terminology" },
      { key: "D6", title: "D6. Improve grammar and accuracy in English" }
    ]
  },
  E: {
    sheetName: "Analysis - E Learning",
    likertQuestions: [
      { key: "E1_1", title: "E1.1 Role-plays and simulations" },
      { key: "E1_2", title: "E1.2 Group discussions and collaborative activities" },
      { key: "E1_3", title: "E1.3 Case studies, business analyses, and project-based work" },
      { key: "E1_4", title: "E1.4 Grammar and vocabulary exercises" },
      { key: "E2_1", title: "E2.1 Enough speaking practice in English classes" },
      { key: "E2_2", title: "E2.2 Class materials/topics are relevant to future career" },
      { key: "E2_3", title: "E2.3 English classes focus more on grammar than real communication" },
      { key: "E2_4", title: "E2.4 Teaching methods match preferred learning style" }
    ]
  },
  F: {
    sheetName: "Analysis - F Preparation",
    likertQuestions: [
      { key: "F1", title: "F1. Preparation: Listening" },
      { key: "F2", title: "F2. Preparation: Reading" },
      { key: "F3", title: "F3. Preparation: Speaking" },
      { key: "F4", title: "F4. Preparation: Writing" },
      { key: "F5", title: "F5. Preparation: Vocabulary and terminology" }
    ]
  },
  G: {
    sheetName: "Analysis - G Comments",
    commentQuestions: [
      { key: "G1", title: "G1. One thing English courses should focus more on" },
      { key: "G2", title: "G2. One thing English courses do well" },
      { key: "G3", title: "G3. Other comments" }
    ]
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
  const maxColumns = sheet.getMaxColumns();

  if (maxColumns < columnKeys.length) {
    sheet.insertColumnsAfter(maxColumns, columnKeys.length - maxColumns);
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

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Survey Tools")
    .addItem("Setup analysis workbook", "setupAnalysisWorkbook")
    .addToUi();
}

function setupAnalysisWorkbook() {
  const spreadsheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID);
  const rawSheet = getResponsesSheet_();
  const columnKeys = ensureHeaders_(rawSheet, SURVEY_RESPONSE_COLUMNS);
  const columnMap = getColumnMap_(columnKeys);
  const rawSheetName = rawSheet.getName();

  buildOverviewSheet_(spreadsheet, rawSheetName, columnMap);
  buildCategoricalSectionSheet_(spreadsheet, ANALYSIS_SECTIONS.A, rawSheetName, columnMap);
  buildLikertSectionSheet_(spreadsheet, ANALYSIS_SECTIONS.B, rawSheetName, columnMap);
  buildLikertSectionSheet_(spreadsheet, ANALYSIS_SECTIONS.C, rawSheetName, columnMap);
  buildLikertSectionSheet_(spreadsheet, ANALYSIS_SECTIONS.D, rawSheetName, columnMap);
  buildLikertSectionSheet_(spreadsheet, ANALYSIS_SECTIONS.E, rawSheetName, columnMap);
  buildLikertSectionSheet_(spreadsheet, ANALYSIS_SECTIONS.F, rawSheetName, columnMap);
  buildCommentSheet_(spreadsheet, ANALYSIS_SECTIONS.G, rawSheetName, columnMap);
}

function buildOverviewSheet_(spreadsheet, rawSheetName, columnMap) {
  const sheet = getOrCreateSheet_(spreadsheet, ANALYSIS_SECTIONS.overview.sheetName);
  const usableRange = getDataRangeA1_(rawSheetName, columnMap.honesty_check);

  clearSheet_(sheet);
  writeSheetTitle_(sheet, "Overview", "Automatic summary of the questionnaire workbook.");

  sheet.getRange("A4:B8").setValues([
    ["Metric", "Value"],
    ["Total submitted responses", "=COUNTA(" + getDataRangeA1_(rawSheetName, columnMap.timestamp_server) + ")"],
    ["Responses marked usable for analysis", '=COUNTIF(' + usableRange + ',"Yes, please use my responses")'],
    ["Responses marked do not use", '=COUNTIF(' + usableRange + ',"No, please do not use my responses")'],
    ["Distinct submission IDs", "=COUNTA(UNIQUE(FILTER(" + getDataRangeA1_(rawSheetName, columnMap.submission_id) + "," + getDataRangeA1_(rawSheetName, columnMap.submission_id) + '<>"")))']
  ]);

  formatTableHeader_(sheet.getRange("A4:B4"));
  sheet.getRange("A5:A8").setFontWeight("bold");
  sheet.getRange("B5:B8").setNumberFormat("0");

  let row = 11;
  row = writeCategoricalBlock_(sheet, row, rawSheetName, columnMap, {
    key: "language",
    title: "Language",
    options: ["English", "French"]
  });
  row += 2;
  row = writeCategoricalBlock_(sheet, row, rawSheetName, columnMap, {
    key: "consent_agree",
    title: "Consent. Agreed to participate",
    options: ["Yes"]
  });
  row += 2;
  writeCategoricalBlock_(sheet, row, rawSheetName, columnMap, {
    key: "honesty_check",
    title: "Honesty check. Use responses in analysis",
    options: ["Yes, please use my responses", "No, please do not use my responses"]
  });

  sheet.setColumnWidth(1, 300);
  sheet.setColumnWidth(2, 140);
  sheet.setColumnWidth(3, 140);
}

function buildCategoricalSectionSheet_(spreadsheet, sectionConfig, rawSheetName, columnMap) {
  const sheet = getOrCreateSheet_(spreadsheet, sectionConfig.sheetName);

  clearSheet_(sheet);
  writeSheetTitle_(sheet, sectionConfig.sheetName.replace("Analysis - ", ""), "Frequency tables update automatically when new responses arrive.");

  let row = 4;

  sectionConfig.categoricalQuestions.forEach(function(question) {
    row = writeCategoricalBlock_(sheet, row, rawSheetName, columnMap, question) + 2;
  });

  sheet.setColumnWidth(1, 360);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 120);
}

function buildLikertSectionSheet_(spreadsheet, sectionConfig, rawSheetName, columnMap) {
  const sheet = getOrCreateSheet_(spreadsheet, sectionConfig.sheetName);
  const tableStartRow = 4;
  const tableHeaderRow = tableStartRow;
  const firstDataRow = tableStartRow + 1;
  const lastDataRow = tableStartRow + sectionConfig.likertQuestions.length;

  clearSheet_(sheet);
  writeSheetTitle_(sheet, sectionConfig.sheetName.replace("Analysis - ", ""), "Use the chart on the right for quick reading. Scores update automatically.");

  sheet.getRange(tableHeaderRow, 1, 1, 8).setValues([["Item", "Mean", "N", "1", "2", "3", "4", "5"]]);
  formatTableHeader_(sheet.getRange(tableHeaderRow, 1, 1, 8));

  sectionConfig.likertQuestions.forEach(function(question, index) {
    const row = firstDataRow + index;
    const rawRange = getDataRangeA1_(rawSheetName, columnMap[question.key]);

    sheet.getRange(row, 1).setValue(question.title);
    sheet.getRange(row, 2).setFormula('=IFERROR(AVERAGE(ARRAYFORMULA(VALUE(FILTER(' + rawRange + ',' + rawRange + '<>"")))),"")');
    sheet.getRange(row, 3).setFormula("=COUNTA(" + rawRange + ")");

    LIKERT_VALUES.forEach(function(value, valueIndex) {
      sheet.getRange(row, 4 + valueIndex).setFormula('=COUNTIF(' + rawRange + ',"' + value + '")');
    });
  });

  sheet.getRange(firstDataRow, 2, sectionConfig.likertQuestions.length, 1).setNumberFormat("0.00");
  sheet.getRange(firstDataRow, 3, sectionConfig.likertQuestions.length, 6).setNumberFormat("0");
  sheet.getRange(firstDataRow, 1, sectionConfig.likertQuestions.length, 8).setVerticalAlignment("middle");
  sheet.getRange(firstDataRow, 1, sectionConfig.likertQuestions.length, 8).setWrap(true);

  sheet.setFrozenRows(tableHeaderRow);
  sheet.setColumnWidth(1, 420);
  sheet.setColumnWidth(2, 90);
  sheet.setColumnWidth(3, 70);
  sheet.setColumnWidths(4, 5, 60);

  createLikertChart_(sheet, tableHeaderRow, lastDataRow, sectionConfig.sheetName.replace("Analysis - ", "") + " Mean Scores");
}

function buildCommentSheet_(spreadsheet, sectionConfig, rawSheetName, columnMap) {
  const sheet = getOrCreateSheet_(spreadsheet, sectionConfig.sheetName);

  clearSheet_(sheet);
  writeSheetTitle_(sheet, sectionConfig.sheetName.replace("Analysis - ", ""), "Open-ended responses appear below automatically.");

  let row = 4;

  sectionConfig.commentQuestions.forEach(function(question) {
    const rawRange = getDataRangeA1_(rawSheetName, columnMap[question.key]);

    sheet.getRange(row, 1).setValue(question.title).setFontWeight("bold");
    sheet.getRange(row + 1, 1).setValue("Responses").setFontWeight("bold").setBackground("#e8f0fe");
    sheet.getRange(row + 2, 1).setFormula('=IFERROR(FILTER(' + rawRange + ',' + rawRange + '<>""),"")');
    row += 14;
  });

  sheet.setColumnWidth(1, 720);
  sheet.getRange("A:A").setWrap(true);
}

function writeCategoricalBlock_(sheet, startRow, rawSheetName, columnMap, question) {
  const rawRange = getDataRangeA1_(rawSheetName, columnMap[question.key]);
  const headerRow = startRow + 1;
  const firstOptionRow = startRow + 2;

  sheet.getRange(startRow, 1).setValue(question.title).setFontWeight("bold");
  sheet.getRange(headerRow, 1, 1, 3).setValues([["Option", "Count", "Percent"]]);
  formatTableHeader_(sheet.getRange(headerRow, 1, 1, 3));

  question.options.forEach(function(option, index) {
    const row = firstOptionRow + index;

    sheet.getRange(row, 1).setValue(option);
    sheet.getRange(row, 2).setFormula('=COUNTIF(' + rawRange + ',"' + escapeFormulaText_(option) + '")');
    sheet.getRange(row, 3).setFormula("=IFERROR(B" + row + "/COUNTA(" + rawRange + "),0)");
  });

  sheet.getRange(firstOptionRow, 3, question.options.length, 1).setNumberFormat("0.0%");
  return firstOptionRow + question.options.length - 1;
}

function createLikertChart_(sheet, headerRow, lastRow, title) {
  const existingCharts = sheet.getCharts();

  existingCharts.forEach(function(chart) {
    sheet.removeChart(chart);
  });

  const chart = sheet
    .newChart()
    .asBarChart()
    .addRange(sheet.getRange(headerRow, 1, lastRow - headerRow + 1, 2))
    .setNumHeaders(1)
    .setPosition(2, 10, 0, 0)
    .setOption("title", title)
    .setOption("legend", { position: "none" })
    .setOption("hAxis", { minValue: 1, maxValue: 5 })
    .build();

  sheet.insertChart(chart);
}

function writeSheetTitle_(sheet, title, subtitle) {
  sheet.getRange("A1").setValue(title).setFontSize(16).setFontWeight("bold");
  sheet.getRange("A2").setValue(subtitle).setFontSize(10).setFontColor("#5f6368");
}

function formatTableHeader_(range) {
  range
    .setFontWeight("bold")
    .setBackground("#e8f0fe")
    .setVerticalAlignment("middle");
}

function getOrCreateSheet_(spreadsheet, sheetName) {
  return spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
}

function clearSheet_(sheet) {
  const charts = sheet.getCharts();

  charts.forEach(function(chart) {
    sheet.removeChart(chart);
  });

  sheet.clear();
  sheet.clearFormats();
}

function getColumnMap_(columnKeys) {
  const map = {};

  columnKeys.forEach(function(key, index) {
    map[key] = index + 1;
  });

  return map;
}

function getDataRangeA1_(sheetName, columnIndex) {
  const letter = toColumnLetter_(columnIndex);
  return quoteSheetName_(sheetName) + "!" + letter + "2:" + letter;
}

function toColumnLetter_(columnIndex) {
  let index = columnIndex;
  let letters = "";

  while (index > 0) {
    const remainder = (index - 1) % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    index = Math.floor((index - remainder - 1) / 26);
  }

  return letters;
}

function quoteSheetName_(sheetName) {
  return "'" + sheetName.replace(/'/g, "''") + "'";
}

function escapeFormulaText_(text) {
  return String(text).replace(/"/g, '""');
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
