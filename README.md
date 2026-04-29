# ENCG Business English Survey

Online multilingual survey for **“A Needs Analysis of Business English ESP at ENCG.”**

**Live website:**

```text
https://dancingpumpkin65.github.io/form-online/
```

---

## Features

- React + Vite frontend
- English / French language switch
- Answers stay saved when switching language
- Previous / Next navigation
- Conditional questions
- Auto-save draft in browser
- Prevents duplicate submissions
- Stores responses directly in Google Sheets

---

# Project Structure

```bash
form-online/
│
├── backend/
│   └── Code.gs
│
├── src/
│   ├── App.jsx
│   └── main.jsx
│
├── questionnaire.js
├── styles.css
├── package.json
├── vite.config.js
└── README.md
```

---

# How It Works

## Frontend

Users complete the survey here:

```text
https://dancingpumpkin65.github.io/form-online/
```

Frontend handles:

- Showing questions
- Validation
- Saving progress locally
- Sending responses to Google Apps Script

---

## Backend

Google Apps Script receives responses and stores them in Google Sheets.

Backend file:

```bash
backend/Code.gs
```

---

# Important Configuration

## Update `questionnaire.js`

Replace this placeholder:

```javascript
endpointUrl: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"
```

With your real deployed Apps Script URL:

```javascript
endpointUrl: "https://script.google.com/macros/s/your-script-id/exec"
```

---

# `Code.gs` Variables Explained

```javascript
const RESPONSES_SHEET_NAME = "YOUR_RESPONSES_SHEET_NAME";
const GOOGLE_SHEET_ID = "YOUR_GOOGLE_SHEET_ID";
```

---

## `RESPONSES_SHEET_NAME`

This is the name of the tab inside your Google Sheet where responses will be stored.

Default:

```javascript
const RESPONSES_SHEET_NAME = "Sheet1";
```

If your tab is named `Responses`, change it to:

```javascript
const RESPONSES_SHEET_NAME = "Responses";
```

---

## `GOOGLE_SHEET_ID`

This tells Google Apps Script which spreadsheet to use.

Example Google Sheet URL:

```text
https://docs.google.com/spreadsheets/d/1abcXYZ123456789/edit#gid=0
```

Copy only this part:

```text
1abcXYZ123456789
```

Then update your code:

```javascript
const GOOGLE_SHEET_ID = "1abcXYZ123456789";
```

---

# Local Development

Install dependencies:

```bash
bun install
```

Run development server:

```bash
bun dev
```

Open the local URL shown in terminal.

---

# Deploy Frontend (GitHub Pages)

Build production version:

```bash
bun run build
```

Deploy the generated `dist/` folder to :contentReference[oaicite:0]{index=0}.

Live site:

```text
https://dancingpumpkin65.github.io/form-online/
```

---

# Deploy Backend (Google Apps Script)

## Step 1: Create Google Sheet

Create a new spreadsheet.

Example name:

```text
Survey Responses
```

---

## Step 2: Open Apps Script

Inside :contentReference[oaicite:1]{index=1}:

```text
Extensions → Apps Script
```

---

## Step 3: Paste Backend Code

Copy:

```bash
backend/Code.gs
```

Paste it into :contentReference[oaicite:2]{index=2} editor.

Save the project.

---

## Step 4: Deploy Script

Go to:

```text
Deploy → New Deployment
```

Choose:

```text
Type: Web App
Execute as: Me
Who has access: Anyone
```

Deploy and copy your generated `/exec` URL.

---

## Step 5: Connect Frontend

Paste your deployed URL inside:

```javascript
questionnaire.js
```

Example:

```javascript
endpointUrl: "https://script.google.com/macros/s/your-script-id/exec"
```

---

# Stored Data

Each submission stores:

- Submission ID
- Language
- Timestamp
- Question responses

Each question becomes a separate column in Google Sheets.

---

# Duplicate Protection

## Frontend

Prevents multiple submissions from the same browser.

## Backend

Checks if `submissionId` already exists before saving.

---

# Testing Reset

Clear saved form data during testing:

```text
?reset=1
```

Example:

```text
http://localhost:5173/?reset=1
```
