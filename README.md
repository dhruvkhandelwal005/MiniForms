# MiniForms

A small Google Forms clone. Create a form, get a shareable link, collect responses, and view them in a table. All data lives in a Google Spreadsheet. Google Apps Script is the only backend.

## Tech Stack

- React, JavaScript, Vite
- React Router
- Fetch API
- Google Spreadsheet (storage)
- Google Apps Script Web App (API)

No Node backend, database, or authentication.

## Architecture

```text
React (Vite)
   |  fetch GET / POST
   v
Google Apps Script Web App
   |
   v
Google Spreadsheet (Forms, Questions, Responses)
```

Forms are public to anyone with the link. There is no login.

## Folder Structure

```text
apps-script/
  Code.gs               copy of the Apps Script code
src/
  components/
    Navbar.jsx
    FormBuilder.jsx     form state: title, description, questions
    QuestionEditor.jsx  one question card in the builder
    QuestionRenderer.jsx  input by question type (public form)
  pages/
    Home.jsx            list of forms with links
    CreateForm.jsx      builder and share-link screen
    PublicForm.jsx      fill and submit a form
    Responses.jsx       response count and table
  services/
    api.js              only file that calls Apps Script
  App.jsx               routes
  main.jsx
  index.css
```

## Routes

| Route | Page |
| --- | --- |
| `/` | Home, list of forms |
| `/create` | Form builder |
| `/form/:id` | Public form |
| `/forms/:id/responses` | Response dashboard |

## Google Spreadsheet Setup

1. Create a new spreadsheet.
2. Create three tabs. Names are case-sensitive.
3. Put these headers in row 1 of each tab.

`Forms`

```text
formId | title | description | createdAt
```

`Questions`

```text
formId | questionId | question | type | options | required
```

`Responses`

```text
responseId | formId | submittedAt | answers
```

Notes:

- `type` is `short`, `paragraph`, or `mcq`.
- `options` is a JSON array for `mcq`, for example `["Good","Average","Bad"]`. Empty for other types.
- `answers` is JSON, for example `{"q1":"Rahul","q2":"Good"}`.

## Apps Script Setup

1. In the spreadsheet, open **Extensions > Apps Script**.
2. Delete the default code. Paste the contents of `apps-script/Code.gs`.
3. Save.

## Deploy Apps Script as a Web App

1. Click **Deploy > New deployment**.
2. Select type **Web app**.
3. Set **Execute as** to **Me** and **Who has access** to **Anyone**.
4. Click **Deploy** and authorize access.
5. Copy the Web app URL (ends in `/exec`).

After you edit the script, update the existing deployment: **Deploy > Manage deployments > edit (pencil) > Version: New version > Deploy**. The URL stays the same. Creating a brand new deployment gives a new URL.

## Where to Put the Apps Script URL

Open `src/services/api.js` and set:

```javascript
const API_URL = 'YOUR_WEB_APP_URL'
```

This is the only place the URL is used.

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Data Flow

Create a form:

1. User fills the builder on `/create`.
2. React sends POST `createForm` to Apps Script.
3. Apps Script writes one row to `Forms` and one row per question to `Questions`.
4. Apps Script returns the new form ID.
5. React shows the share link: `<site origin>/form/<formId>`.

Submit a response:

1. User opens `/form/<formId>`.
2. React sends GET `getForm`. Apps Script joins `Forms` and `Questions` and returns the form.
3. React renders the questions and validates required fields.
4. React sends POST `submitResponse`. Apps Script appends a row to `Responses`.

View responses:

1. User opens `/forms/<formId>/responses`.
2. React fetches the form (for column names) and the responses.
3. The table columns come from the form's questions.

## API Reference

GET, with query parameters:

- `?action=getForms`
- `?action=getForm&formId=...`
- `?action=getResponses&formId=...`

POST, with a JSON body:

- `{ "action": "createForm", "form": { ... } }`
- `{ "action": "submitResponse", "formId": "...", "answers": { ... } }`

Every response is `{ "success": true, "data": ... }` or `{ "success": false, "error": "..." }`.

POST requests use `Content-Type: text/plain` so the browser skips the CORS preflight, which Apps Script cannot answer. The body is still JSON.

## Limitations

- No authentication. Anyone with a form ID can open the form and submit.
- Anyone with the Apps Script URL can list all forms and read all responses.
- Built for learning and small projects, not for sensitive data.