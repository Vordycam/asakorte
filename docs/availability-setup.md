# Live availability: venue-reported "courts free right now"

Venues tell the app how many courts are free, and the app shows it on the card and the detail sheet, with the time it was reported. A report expires on its own, so a number is never older than the venue's own word.

No server is needed. A Google Form collects the reports, Google Sheets stores them, and the app reads the sheet as CSV every few minutes.

## One-time setup (about 10 minutes)

### 1. Create the form

Go to https://forms.google.com and make a form called **AsaKorte court availability** with these questions, in this order:

| # | Question | Type | Required |
| --- | --- | --- | --- |
| 1 | Which court? | Dropdown | yes |
| 2 | Courts free right now | Short answer, number (0 if fully booked) | yes |
| 3 | Free until (time) | Short answer, e.g. `9 PM` or `21:00` | no |
| 4 | Note | Short answer | no |

The question wording can differ, but keep the keywords **court**, **free**, **until** and **note** in them: that is how the app finds the columns.

For the dropdown choices, run this in the project folder and paste the output:

```bash
node tools/form-options.js
```

(Use `--verified` to start with only the verified courts.) When you add courts later, add their names to the dropdown too.

In the form's settings: do **not** limit to one response, and do not require sign-in unless you want venues to use a Google account.

### 2. Link the responses to a sheet and publish it

1. In the form, open **Responses** and click the green Sheets icon. A spreadsheet is created.
2. In that spreadsheet: **File → Share → Publish to web**.
3. Choose the **Form Responses 1** tab, choose **Comma-separated values (.csv)**, click **Publish**, and copy the link. It looks like `https://docs.google.com/spreadsheets/d/e/2PACX-…/pub?gid=…&single=true&output=csv`.

Only that tab becomes public. Keep the rest of the spreadsheet private.

### 3. Get the form link and, optionally, the pre-fill id

1. In the form, click **Send → link** and copy the link (ends in `/viewform`).
2. Optional, for one-tap venue links: click the three dots → **Get pre-filled link**, choose any court in the dropdown, click **Get link**, copy it, and note the part that looks like `entry.123456789`. That is the dropdown's id.

### 4. Paste into the app

At the top of `js/app.js`:

```js
availability: {
  csvUrl: 'https://docs.google.com/spreadsheets/d/e/…/pub?gid=…&single=true&output=csv',
  formUrl: 'https://docs.google.com/forms/d/e/…/viewform',
  formVenueEntry: 'entry.123456789',   // optional
  refreshMinutes: 3,                   // how often the app re-reads the sheet
  maxAgeHours: 6,                      // a report older than this is dropped
  defaultValidHours: 3                 // validity when the venue gives no "until"
}
```

Then bump `CACHE` in `sw.js`, run `npm test`, commit and push. The feature switches itself on when `csvUrl` is set.

## Giving venues the link

- The plain form link works for everyone: the venue picks their court each time.
- With `formVenueEntry` set, the app offers each venue a link with their court already selected. Open the court's sheet in the app, tap **Venue? Update availability**, and share that link with the venue. They can bookmark it on their phone and report in two taps.
- You can also fill the form yourself when a venue messages you.

## What players see

- Card pill: **3 of 8 courts free · 12 min ago** (green) or **Fully booked until 9 PM** (grey).
- Quick filter **Courts free now** and the same toggle in Filters.
- Courts with free courts sort to the top of the smart order.
- Detail sheet: the report with its time, and "reported by the venue".
- Nothing at all for venues without a live report; the app says so honestly.

## Trust and moderation

Anyone with the form link can post for any court, so share it with venues rather than publicly. Every report shows its time, and you can delete bad rows in the sheet at any time. If this becomes a problem, the next step is a per-venue code checked by the app; ask for it when needed.
