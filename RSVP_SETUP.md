# Connect RSVP responses to Google Sheets

The wedding page is ready. Complete these steps once, then paste the Web App URL into `app.js`.

## 1. Create the private spreadsheet

1. Go to [Google Sheets](https://sheets.new) and create a blank sheet named `Ancy & Mathew — RSVP`.
2. Copy its ID from the address bar. It is the text between `/d/` and `/edit` in the sheet URL.
3. Keep the sheet private. Guests must **not** receive its URL.

## 2. Add the Apps Script

1. In that spreadsheet, select **Extensions → Apps Script**.
2. Delete the default code and paste the code below.
3. Replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with the sheet ID copied above.
4. Click **Save**.

```javascript
const SHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'RSVP';

function doGet() {
  return ContentService.createTextOutput('Ancy & Mathew RSVP endpoint is ready.');
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents || '{}');

  // Quietly ignore basic bot submissions.
  if (data.website) return response_({ ok: true });

  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME)
    || SpreadsheetApp.openById(SHEET_ID).insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Received at', 'Guest name', 'Attendance', 'Guest count', 'Food preference', 'Message']);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    new Date(),
    safe_(data.guestName),
    safe_(data.attendance),
    safe_(data.guestCount),
    safe_(data.meal),
    safe_(data.message)
  ]);

  return response_({ ok: true });
}

function safe_(value) {
  const text = String(value || '').trim();
  // Stops visitor text such as =IMPORTXML(...) becoming a spreadsheet formula.
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function response_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Publish the script

1. Select **Deploy → New deployment**.
2. Click the gear beside **Select type**, then choose **Web app**.
3. Choose **Execute as: Me** and give access to **Anyone** (including people who are not signed in, if Google shows that option).
4. Click **Deploy**, approve the Google permission prompt, and copy the URL ending in `/exec`.

Use the `/exec` URL, not the `/dev` test URL. The test URL only works for script editors.

## 4. Connect it to the invitation

In `app.js`, find this line near the top:

```javascript
rsvpEndpoint: ''
```

Paste in your copied URL:

```javascript
rsvpEndpoint: 'https://script.google.com/macros/s/EXAMPLE/exec'
```

Commit the updated `index.html` and `app.js` files to GitHub. Vercel will then deploy the RSVP section.

## 5. Test

Open the live site, complete a test RSVP, and check that the new row appears in the `RSVP` tab of your private Google Sheet. Delete the test row afterwards if desired.

Google Apps Script web apps accept `doPost` requests and can run as the deploying account; `appendRow` writes each reply to the sheet. See [Google's web-app guide](https://developers.google.com/apps-script/guides/web) and [Spreadsheet service reference](https://developers.google.com/apps-script/reference/spreadsheet/sheet#appendrowrowcontents).
