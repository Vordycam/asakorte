/* Checks js/data/courts.js for mistakes before you publish.
   node tools/check-data.js
   Exits non-zero when something is wrong, so it can gate a deploy. */
'use strict';
const path = require('path');
const COURTS = require(path.join(__dirname, '..', 'js', 'data', 'courts.js'));
const CITIES = require(path.join(__dirname, '..', 'js', 'data', 'cities.js'));
const Hours = require(path.join(__dirname, '..', 'js', 'core', 'hours.js'));
const Links = require(path.join(__dirname, '..', 'js', 'core', 'links.js'));

const errors = [], warnings = [];
const ids = new Set();
const cityNames = new Set(CITIES.map(c => c.name));
const MINDANAO = { latMin: 4.5, latMax: 10.5, lngMin: 116.5, lngMax: 127.5 };
const AMENITIES = new Set(['parking', 'restroom', 'shower', 'paddle-rental', 'ball-sales', 'water', 'aircon', 'pro-shop', 'coaching', 'cafe', 'wifi', 'lockers', 'seating', 'lights']);
const PAYMENTS = new Set(['gcash', 'maya', 'cash', 'card', 'bank']);
const DAYS = new Set(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'daily', 'weekdays', 'weekends']);

function err(c, msg) { errors.push(`${c.id || c.name || '(no id)'}: ${msg}`); }
function warn(c, msg) { warnings.push(`${c.id || c.name || '(no id)'}: ${msg}`); }

COURTS.forEach((c, i) => {
  if (!c.id) err({ id: `#${i}` }, 'missing id');
  else {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.id)) err(c, `id must be lowercase letters, numbers and dashes (got "${c.id}")`);
    if (ids.has(c.id)) err(c, 'duplicate id');
    ids.add(c.id);
  }
  if (!c.name) err(c, 'missing name');
  if (!c.city) err(c, 'missing city');
  else if (!cityNames.has(c.city)) err(c, `city "${c.city}" is not in js/data/cities.js`);
  if (!isFinite(c.lat) || !isFinite(c.lng)) err(c, 'lat/lng missing or not numbers');
  else if (c.lat < MINDANAO.latMin || c.lat > MINDANAO.latMax || c.lng < MINDANAO.lngMin || c.lng > MINDANAO.lngMax) {
    err(c, `lat/lng (${c.lat}, ${c.lng}) is outside Mindanao; check for swapped numbers`);
  } else {
    const city = CITIES.find(x => x.name === c.city);
    if (city) {
      const dLat = Math.abs(city.lat - c.lat), dLng = Math.abs(city.lng - c.lng);
      if (dLat > 0.45 || dLng > 0.45) warn(c, `pin is ~${Math.round(Math.max(dLat, dLng) * 111)} km from the ${c.city} centre; is the city right?`);
    }
  }
  if (c.hours != null) {
    const n = Hours.normalize(c.hours);
    if (!n.known) err(c, 'hours could not be parsed');
    if (typeof c.hours === 'object') {
      Object.keys(c.hours).forEach(k => {
        if (!DAYS.has(k)) err(c, `unknown hours key "${k}" (use mon..sun, daily, weekdays, weekends)`);
        if (c.hours[k] && typeof c.hours[k] === 'string' && !/closed|24h|-|–|to/i.test(c.hours[k])) err(c, `hours "${c.hours[k]}" needs a range like 06:00-22:00`);
      });
    }
  } else warn(c, 'no hours (the app will say "Hours not listed")');
  if (c.price) {
    ['perHour', 'peakPerHour', 'perHead'].forEach(k => { if (c.price[k] != null && !isFinite(c.price[k])) err(c, `price.${k} must be a number`); });
    if (c.price.peakPerHour != null && c.price.perHour == null) warn(c, 'peakPerHour without perHour');
  }
  (c.openPlay || []).forEach((s, j) => {
    const d = s.day || s.days;
    if (!d) err(c, `openPlay[${j}] missing day`);
    else (Array.isArray(d) ? d : [d]).forEach(x => { if (!DAYS.has(String(x).toLowerCase().slice(0, 3)) && !DAYS.has(String(x))) err(c, `openPlay[${j}] unknown day "${x}"`); });
    if (Hours.parseTime(s.start || '') == null) err(c, `openPlay[${j}] start time "${s.start}" not understood`);
    if (s.end && Hours.parseTime(s.end) == null) err(c, `openPlay[${j}] end time "${s.end}" not understood`);
  });
  const b = c.booking || {};
  const actions = Links.bookingActions(c);
  if (!actions.length) warn(c, 'no way to contact or book (no facebook, phone, viber, or url)');
  if (b.facebook && !Links.facebookUrl(b.facebook)) err(c, `facebook "${b.facebook}" is not a Facebook link or handle`);
  if (b.url && !/^https?:\/\//.test(b.url)) err(c, `booking.url must start with http(s):// (got "${b.url}")`);
  if (b.phone && !Links.normalizePhone(b.phone)) err(c, `phone "${b.phone}" not understood`);
  if (b.preferred && !actions.some(a => a.kind === b.preferred)) warn(c, `preferred "${b.preferred}" has no matching channel`);
  (c.amenities || []).forEach(a => { if (!AMENITIES.has(a)) warn(c, `unknown amenity "${a}"`); });
  (c.payments || []).forEach(p => { if (!PAYMENTS.has(p)) warn(c, `unknown payment "${p}"`); });
  if (!c.verified) warn(c, 'not verified yet (set verified: "YYYY-MM-DD" after you confirm it)');
  if (c.verified && !/^\d{4}-\d{2}-\d{2}$/.test(c.verified)) err(c, `verified must look like 2026-10-14 (got "${c.verified}")`);
});

const unverified = warnings.filter(w => /not verified yet/.test(w)).length;
console.log(`${COURTS.length} courts across ${new Set(COURTS.map(c => c.city)).size} cities`);
if (unverified) console.log(`${unverified} still unverified`);
warnings.filter(w => !/not verified yet/.test(w)).forEach(w => console.log('  warn  ' + w));
errors.forEach(e => console.log('  ERROR ' + e));
if (errors.length) { console.log(`\n${errors.length} error(s). Fix them before publishing.`); process.exit(1); }
console.log('\nData looks good.');
