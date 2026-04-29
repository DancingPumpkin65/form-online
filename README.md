# ENCG Business English Survey App

React multilingual survey app for the academic questionnaire **“A Needs Analysis of Business English ESP at ENCG.”**

## Project structure

```text
form-online/
├─ index.html
├─ package.json
├─ vite.config.js
├─ backend/
│  └─ Code.gs
├─ questionnaire.js
├─ src/
│  ├─ App.jsx
│  └─ main.jsx
├─ styles.css
└─ README.md
```

## What is included

- React frontend powered by Vite
- Bun development workflow with `bun dev`
- English/French language switcher with answer preservation
- One-step survey flow with previous/next navigation
- Conditional logic for pathway and internship questions
- Autosaved local draft until submission
- Duplicate-submission protection in the browser and in Google Apps Script
- Google Apps Script backend that appends responses to Google Sheets

## Where to customize content

Edit `questionnaire.js`.

- Survey text, sections, options, and branching logic are defined there.
- The Google Apps Script endpoint URL is also set there:

```js
endpointUrl: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"
```

Replace that placeholder with your deployed Apps Script `/exec` URL.

## Local development with Bun

1. Install dependencies:

```bash
bun install
```

2. Start the dev server:

```bash
bun dev
```

3. Open the local URL shown by Vite.

To clear the saved draft/submitted state during testing, open the dev URL with `?reset=1`.

## Frontend deployment on GitHub Pages

1. Run a production build:

```bash
bun run build
```

2. Deploy the generated `dist/` folder to GitHub Pages.
3. If you use GitHub Actions for Pages, publish the `dist/` output artifact.

## Backend deployment on Google Apps Script

### 1. Create the spreadsheet

1. Create a new Google Sheet.
2. Rename the first sheet to `Responses`, or leave it as-is; the script will create `Responses` automatically if needed.

### 2. Add the Apps Script code

1. In the Google Sheet, open `Extensions` -> `Apps Script`.
2. Delete any starter code in the editor.
3. Paste the contents of `backend/Code.gs`.
4. Save the project.

### 3. Deploy as a web app

1. Click `Deploy` -> `New deployment`.
2. Choose type: `Web app`.
3. Description: `Survey receiver`.
4. `Execute as`: `Me`.
5. `Who has access`: `Anyone`.
6. Click `Deploy`.
7. Authorize the script when Google prompts you.
8. Copy the generated Web app URL ending in `/exec`.

### 4. Connect the frontend

1. Open `questionnaire.js`.
2. Replace:

```js
endpointUrl: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"
```

with your actual Apps Script URL.

3. Commit and push the updated file to GitHub.

## How data is stored

Each submission sends:

- Server timestamp
- Survey id
- Survey version
- Submission id
- Language
- Client submission timestamp
- One column per question

The Apps Script creates headers automatically on first submission and appends one row per response.

## Duplicate-submission protection

1. Frontend:
   - After a successful submission, the browser stores a local submitted flag and blocks another send from the same device/browser.
2. Backend:
   - Each submission includes a generated `submissionId`.
   - Apps Script checks whether that `submissionId` already exists in the sheet before appending a new row.

## Error handling behavior

- The form shows a loading state while submitting.
- Required fields are validated before the user can continue.
- If submission fails, the answers remain in local storage so the respondent can retry.
- If the endpoint URL is still a placeholder, the app shows a configuration error in production.
- For local preview only, an empty endpoint uses a mock success response so you can test the UI flow without deploying Apps Script yet.

## Local preview

Because the app now uses Vite + React, use `bun dev` for local work instead of a plain static file server.

## Notes

- The production frontend output is still static and can be hosted on GitHub Pages after `bun run build`.
- The backend requires a Google account because it uses Google Sheets and Apps Script.
- If you edit question ids after collecting data, new columns may be created in the sheet. Keep ids stable once the survey is live.
