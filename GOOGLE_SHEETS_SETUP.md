# Save registrations to Google Sheets (GitHub Pages-friendly)

This site can be deployed on GitHub Pages (static hosting). Registrations are saved to Google Sheets using a Google Apps Script Web App.

Google Sheet:
`https://docs.google.com/spreadsheets/d/1FJC3lg9cmXnmAsamdi1Tj8DGHIXLwXGsujp-eUdfRdo/edit`

## Step 1 — Create tabs (worksheets)
Create two tabs with **exact names**:
- `Participants`
- `Sponsors`

Recommended headers (Row 1):

**Participants**
Timestamp | Full name | Email | Affiliation | Category | Primary interest | Experience level | Notes

**Sponsors**
Timestamp | Organization | Contact person | Email | Phone | Interest | Message

## Step 2 — Apps Script
Open the sheet → **Extensions → Apps Script** and paste:

```javascript
const SHEET_ID = "1FJC3lg9cmXnmAsamdi1Tj8DGHIXLwXGsujp-eUdfRdo";

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);

    const raw = (e && e.postData && e.postData.contents) ? e.postData.contents : "";
    const data = raw ? JSON.parse(raw) : {};
    const kind = (data.kind || "").toString().toLowerCase();
    const ts = new Date();

    if (kind === "participant") {
      const sh = getOrCreate_(ss, "Participants");
      sh.appendRow([ts, data.name||"", data.email||"", data.affiliation||"", data.category||"", data.interest||"", data.level||"", data.notes||""]);
    } else if (kind === "sponsor") {
      const sh = getOrCreate_(ss, "Sponsors");
      sh.appendRow([ts, data.org||"", data.contact||"", data.sponsorEmail||"", data.phone||"", data.interestLevel||"", data.message||""]);
    } else {
      return out_({ok:false, error:"Unknown kind"}); 
    }

    return out_({ok:true});
  } catch (err) {
    return out_({ok:false, error:String(err)});
  }
}

function getOrCreate_(ss, name) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  return sh;
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Step 3 — Deploy as Web App
Apps Script → **Deploy → New deployment → Web app**
- Execute as: **Me**
- Who has access: **Anyone**
- Deploy → copy the URL ending with `/exec`

## Step 4 — Paste Web App URL into the site
Edit: `assets/app.js` and replace:

```js
const GOOGLE_SHEETS_ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
```

with your actual Web App URL, for example:
```js
const GOOGLE_SHEETS_ENDPOINT = "https://script.google.com/macros/s/XXXX/exec";
```

## Important note (CORS)
The site uses `mode: "no-cors"` so it works from GitHub Pages. Submissions are saved to the sheet even though the browser cannot read the response.
