# AsaKorte — Pickleball Court Locator for Mindanao

*Asa ang korte?* ("Where is the court?") is a mobile-first web app that helps pickleball players in Mindanao find a court near them, see whether it is open right now, check rates and open-play schedules, and book through the venue's own channel: Messenger, Viber, a phone call, or their booking site.

**Live:** https://vordycam.github.io/asakorte/ (open it on your phone, then *Install* or *Add to Home Screen*).

No accounts, no app store, no server. It is a Progressive Web App: open the link, tap *Install*, and it lives on the home screen and works offline.

## What is in the box

| Tab | What it does |
| --- | --- |
| Explore | Search, city chips, quick filters (Open now, Indoor, Outdoor, Lights, Free, Open play today), full filter sheet, smart/nearest/cheapest sorting, court cards with one-tap **Book** and **Go** |
| Map | Leaflet + OpenStreetMap, loaded only when opened. Markers coloured by open/closed/featured. Tap a marker for a preview, then details |
| Open play | Every drop-in session in the next 7 days, grouped by day, with a LIVE NOW badge |
| Saved | Favourites and recently viewed, available offline |
| More | Add a court, claim a court, get featured, install, theme, share, report a problem |

Every court detail sheet has: status pill ("Open · closes 10 PM"), booking buttons in the venue's preferred order, a **booking-message writer** (date, time, hours, players → copy → paste in Messenger), off-peak and peak rates, hours table with today highlighted, open play, amenities, payments accepted, directions (Google Maps and Waze), share link, and a "last verified" line with *Suggest an edit*.

## Run it

It is plain HTML, CSS and JavaScript. Any static file server works:

```bash
cd "Pickleball Court Locator"
npx serve .            # or: python -m http.server 8080
```

Open `http://localhost:3000` on your phone (same Wi-Fi) or desktop. Opening `index.html` directly from the file system also works, minus the service worker.

## Add or fix a court

Edit **`js/data/courts.js`**. The file starts with a template and a comment on every field. Paste a Facebook page link into `booking.facebook` and the app derives the Messenger button automatically. Paste a booking site into `booking.url`. Then run:

```bash
node tools/check-data.js
```

It catches duplicate IDs, cities that do not exist, pins outside Mindanao, hours it cannot parse, and courts with no way to contact them. Warnings about missing hours or unverified listings are your to-do list.

Set `verified: '2026-10-14'` once you have confirmed a listing with the venue. Verified courts get the green badge.

Add a new city to **`js/data/cities.js`** (name, short label, region, map centre) and it appears in the chips as soon as a court lists it.

## Seed data

The 47 courts shipped here were compiled on 2026-10-14 from public directories (Pickleheads, picklehub.ph, courtogo.com and venue Facebook pages). None is marked verified. Before launch, confirm each one with the venue: phone, page link, hours, rates. A commented list of further candidates sits at the bottom of `courts.js`.

## Owner settings

At the top of **`js/app.js`**:

```js
ownerEmail: '',        // where "Add a court" and "Report a problem" emails go
ownerMessenger: '',    // your Facebook page's m.me link
```

Until these are set, those buttons copy the message to the clipboard and tell the user to send it to you.

## Tests

```bash
node --test
```

Covers distance maths, opening hours (including past-midnight and Manila-time evaluation), link building (Philippine phone formats, every Facebook URL shape, Messenger/Viber/Waze links), filtering, sorting and open-play scheduling.

## Deploy

The app is published with GitHub Pages from the `main` branch root of https://github.com/Vordycam/asakorte. Every push to `main` goes live at https://vordycam.github.io/asakorte/ within a minute or two.

Release checklist:

1. `npm test && npm run check`
2. Bump `CACHE` in `sw.js` so installed phones pick up the update.
3. Commit and push to `main`.

## Maps and tiles

The map uses the public OpenStreetMap tile server, which is fine for a community app. If traffic grows (thousands of daily users), switch `TILE_URL` in `js/map.js` to a keyed provider with a free tier such as MapTiler or Stadia Maps, and keep the attribution.

## Design

Palette "Court & Ball": ink navy `#0B1B3A`, court blue `#1D4ED8`, optic lime `#D4F43B` as the single loud accent (always with dark text), green/grey status pills. Fonts: Bricolage Grotesque for display, Plus Jakarta Sans for UI. Dark mode follows the phone and can be forced from More → Theme. Designed at 360 px wide first with 44 px tap targets.

## Roadmap ideas

- Venue check-ins to show "busy now" (needs a tiny backend)
- Owner self-service edits via a form that opens a pull request
- City landing pages for search (`/davao`, `/cdo`) for discovery on Google
- GCash deposit links once venues standardise on QR Ph
