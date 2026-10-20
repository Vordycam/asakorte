/* Core logic tests. No dependencies: `node --test test/`
   Every time-sensitive check passes an explicit `now` so results do not
   depend on when or where the suite runs. Manila is UTC+8. */
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const Geo = require('../js/core/geo.js');
const Hours = require('../js/core/hours.js');
const Links = require('../js/core/links.js');
const Filters = require('../js/core/filters.js');

/* Manila local time -> Date. manila('2026-10-13', '19:30') is a Tuesday evening. */
function manila(dateStr, timeStr) {
  return new Date(dateStr + 'T' + timeStr + ':00+08:00');
}

/* ── Geo ─────────────────────────────────────────────────────────────── */

test('distance Davao to CDO is roughly 165 km', () => {
  const d = Geo.distanceKm({ lat: 7.1907, lng: 125.4553 }, { lat: 8.4542, lng: 124.6319 });
  assert.ok(d > 160 && d < 175, 'got ' + d);
});

test('distance formatting rounds sensibly', () => {
  assert.equal(Geo.formatDistance(0.12), '100 m');
  assert.equal(Geo.formatDistance(0.5), '500 m');
  assert.equal(Geo.formatDistance(1.26), '1.3 km');
  assert.equal(Geo.formatDistance(3.0), '3 km');
  assert.equal(Geo.formatDistance(14.6), '15 km');
  assert.equal(Geo.formatDistance(NaN), '');
});

test('distance with bad input is NaN', () => {
  assert.ok(Number.isNaN(Geo.distanceKm(null, { lat: 1, lng: 1 })));
  assert.ok(Number.isNaN(Geo.distanceKm({ lat: 'x', lng: 1 }, { lat: 1, lng: 1 })));
});

/* ── Hours ───────────────────────────────────────────────────────────── */

test('parses 24h and 12h time strings', () => {
  assert.equal(Hours.parseTime('06:00'), 360);
  assert.equal(Hours.parseTime('6am'), 360);
  assert.equal(Hours.parseTime('6:30 pm'), 1110);
  assert.equal(Hours.parseTime('12am'), 0);
  assert.equal(Hours.parseTime('12pm'), 720);
  assert.equal(Hours.parseTime('nonsense'), null);
});

test('parses ranges including split shifts and past midnight', () => {
  assert.deepEqual(Hours.parseRanges('06:00-22:00'), [[360, 1320]]);
  assert.deepEqual(Hours.parseRanges('6am - 12pm, 3pm-10pm'), [[360, 720], [900, 1320]]);
  assert.deepEqual(Hours.parseRanges('18:00-02:00'), [[1080, 1560]]);
  assert.deepEqual(Hours.parseRanges('closed'), []);
  assert.deepEqual(Hours.parseRanges('24h'), [[0, 1440]]);
});

test('open now: daily hours, Tuesday 7:30 PM Manila', () => {
  const s = Hours.status({ daily: '06:00-22:00' }, manila('2026-10-13', '19:30'));
  assert.equal(s.open, true);
  assert.equal(s.closingSoon, false);
  assert.equal(s.label, 'Open · closes 10 PM');
});

test('closing soon within the last hour', () => {
  const s = Hours.status({ daily: '06:00-22:00' }, manila('2026-10-13', '21:15'));
  assert.equal(s.open, true);
  assert.equal(s.closingSoon, true);
  assert.equal(s.short, 'Closing soon');
});

test('closed, opens later today / tomorrow / another day', () => {
  let s = Hours.status({ daily: '06:00-22:00' }, manila('2026-10-13', '04:00'));
  assert.equal(s.open, false);
  assert.equal(s.label, 'Closed · opens 6 AM');
  s = Hours.status({ daily: '06:00-22:00' }, manila('2026-10-13', '05:30'));
  assert.equal(s.open, false);
  assert.equal(s.openingSoon, true);
  assert.equal(s.label, 'Opens soon · 6 AM');
  s = Hours.status({ daily: '06:00-22:00' }, manila('2026-10-13', '22:30'));
  assert.equal(s.label, 'Closed · opens tomorrow 6 AM');
  s = Hours.status({ mon: '06:00-22:00', sun: 'closed' }, manila('2026-10-10', '12:00')); /* Saturday */
  assert.equal(s.open, false);
  assert.equal(s.label, 'Closed · opens Mon 6 AM');
});

test('past-midnight range stays open after 12 AM', () => {
  const h = { fri: '18:00-02:00', sat: 'closed' };
  /* Saturday 12:30 AM is still inside Friday night's range. */
  const s = Hours.status(h, manila('2026-10-17', '00:30'));
  assert.equal(s.open, true);
  assert.equal(s.label, 'Open · closes 2 AM');
  const s1 = Hours.status(h, manila('2026-10-17', '01:15'));
  assert.equal(s1.open, true);
  assert.equal(s1.closingSoon, true);
  const s2 = Hours.status(h, manila('2026-10-17', '02:30'));
  assert.equal(s2.open, false);
});

test('status is evaluated in Manila regardless of host timezone', () => {
  /* 2026-10-13T11:30Z is 19:30 Manila (open) but 07:30 in New York. */
  const s = Hours.status({ daily: '06:00-22:00' }, new Date('2026-10-13T11:30:00Z'));
  assert.equal(s.open, true);
  const late = Hours.status({ daily: '06:00-22:00' }, new Date('2026-10-13T15:30:00Z')); /* 23:30 Manila */
  assert.equal(late.open, false);
});

test('unknown hours never claim open', () => {
  const s = Hours.status(null, manila('2026-10-13', '19:30'));
  assert.equal(s.known, false);
  assert.equal(s.open, false);
});

test('24h venues', () => {
  const s = Hours.status('24h', manila('2026-10-13', '03:00'));
  assert.equal(s.open, true);
  assert.equal(s.label, 'Open 24 hours');
});

test('weekday/weekend shorthand and summary line', () => {
  const h = { weekdays: '6am-10pm', weekends: '7am-9pm' };
  assert.equal(Hours.summary(h), 'Mon–Fri 6 AM – 10 PM · Sat–Sun 7 AM – 9 PM');
  assert.equal(Hours.summary({ daily: '06:00-22:00' }), 'Daily 6 AM – 10 PM');
  const table = Hours.weekTable(h, manila('2026-10-13', '19:30'));
  assert.equal(table.length, 7);
  assert.equal(table[0].day, 'Mon');
  assert.equal(table[1].today, true); /* Tuesday */
  assert.equal(table[5].text, '7 AM – 9 PM');
});

/* ── Links ───────────────────────────────────────────────────────────── */

test('phone normalisation covers common Philippine formats', () => {
  assert.equal(Links.normalizePhone('0917 123 4567'), '+639171234567');
  assert.equal(Links.normalizePhone('09171234567'), '+639171234567');
  assert.equal(Links.normalizePhone('+63 917 123 4567'), '+639171234567');
  assert.equal(Links.normalizePhone('639171234567'), '+639171234567');
  assert.equal(Links.normalizePhone('9171234567'), '+639171234567');
  assert.equal(Links.normalizePhone(''), '');
  assert.equal(Links.prettyPhone('09171234567'), '0917 123 4567');
});

test('facebook handle extraction and messenger links', () => {
  assert.equal(Links.facebookHandle('https://www.facebook.com/PickleDavao/'), 'PickleDavao');
  assert.equal(Links.facebookHandle('https://facebook.com/profile.php?id=1000123'), '1000123');
  assert.equal(Links.facebookHandle('https://m.me/pickledavao'), 'pickledavao');
  assert.equal(Links.facebookHandle('PickleDavao'), 'PickleDavao');
  assert.equal(Links.facebookHandle('https://www.facebook.com/PickleDavao/posts/1234'), 'PickleDavao');
  assert.equal(Links.messengerUrl({ facebook: 'https://www.facebook.com/PickleDavao' }), 'https://m.me/PickleDavao');
  assert.equal(Links.messengerUrl({ messenger: 'https://m.me/abc' }), 'https://m.me/abc');
  assert.equal(Links.facebookUrl('https://facebook.com/profile.php?id=1000123'), 'https://www.facebook.com/profile.php?id=1000123');
  /* the shapes that real Mindanao venue pages use */
  assert.equal(Links.facebookHandle('https://www.facebook.com/p/The-Pink-Paddle-Club-61578669204930/'), '61578669204930');
  assert.equal(Links.facebookHandle('https://www.facebook.com/people/Pickle-Point/61550000000001/'), '61550000000001');
  assert.equal(Links.facebookHandle('https://www.facebook.com/share/17x4sAmLeh/'), '');
  assert.equal(Links.facebookHandle('https://www.facebook.com/groups/ButuanDinks'), '');
  assert.equal(Links.facebookHandle('https://m.facebook.com/epicentercourtsdavao/'), 'epicentercourtsdavao');
  assert.equal(Links.facebookUrl('https://www.facebook.com/share/17x4sAmLeh/'), 'https://www.facebook.com/share/17x4sAmLeh/');
  assert.equal(Links.facebookUrl('facebook.com/groups/ButuanDinks'), 'https://www.facebook.com/groups/ButuanDinks');
  assert.equal(Links.messengerUrl({ facebook: 'https://www.facebook.com/share/17x4sAmLeh/' }), '');
  assert.equal(Links.messengerUrl({ facebook: 'https://www.facebook.com/p/Dink-Lab-61589287402172/' }), 'https://m.me/61589287402172');
  /* a share link still yields a Facebook action but no Messenger action */
  const acts = Links.bookingActions({ booking: { facebook: 'https://www.facebook.com/share/17x4sAmLeh/' } });
  assert.deepEqual(acts.map(a => a.kind), ['facebook']);
});

test('directions and waze links', () => {
  const v = { lat: 7.19, lng: 125.45, name: 'X' };
  assert.equal(Links.directionsUrl(v), 'https://www.google.com/maps/dir/?api=1&destination=7.19,125.45');
  assert.equal(Links.wazeUrl(v), 'https://waze.com/ul?ll=7.19,125.45&navigate=yes');
  assert.equal(Links.directionsUrl({}), '');
});

test('booking actions are ordered best-first and honour preferred channel', () => {
  const v = { booking: { facebook: 'https://facebook.com/Club', phone: '09171234567', viber: '09171234567' } };
  const a = Links.bookingActions(v);
  assert.deepEqual(a.map(x => x.kind), ['messenger', 'viber', 'call', 'facebook']);
  assert.equal(a[0].primary, true);
  const b = Links.bookingActions({ booking: { facebook: 'Club', phone: '09171234567', preferred: 'call' } });
  assert.equal(b[0].kind, 'call');
  assert.equal(b[0].primary, true);
  assert.equal(b[1].primary, undefined);
  assert.deepEqual(Links.bookingActions({}), []);
  const w = Links.bookingActions({ booking: { url: 'https://book.example', facebook: 'Club' } });
  assert.equal(w[0].kind, 'web');
});

test('share url carries the court id', () => {
  assert.equal(Links.shareUrl('davao-abc', 'https://x.app/'), 'https://x.app/?court=davao-abc');
});

/* ── Filters ─────────────────────────────────────────────────────────── */

const COURTS = [
  { id: 'a', name: 'Alpha Courts', city: 'Davao City', area: 'Matina', lat: 7.07, lng: 125.60, indoor: true, lights: true, courts: 4,
    hours: { daily: '06:00-22:00' }, price: { perHour: 400 }, booking: { facebook: 'Alpha' }, amenities: ['parking', 'restroom'], rating: 4.5,
    openPlay: [{ day: 'tue', start: '18:00', end: '21:00', fee: 100 }] },
  { id: 'b', name: 'Bravo Park', city: 'Davao City', area: 'Buhangin', lat: 7.11, lng: 125.62, indoor: false, lights: false, courts: 2,
    hours: { daily: '05:00-18:00' }, price: { free: true }, booking: {}, amenities: ['parking'], tags: ['public'] },
  { id: 'c', name: 'Charlie Club', city: 'Cagayan de Oro', area: 'Lapasan', lat: 8.48, lng: 124.65, indoor: true, lights: true, courts: 6,
    hours: { weekdays: '08:00-23:00', weekends: '06:00-23:00' }, price: { perHead: 150 }, booking: { phone: '09170000000' }, amenities: ['parking', 'restroom', 'shower'], rating: 4.8, featured: true,
    openPlay: [{ days: ['mon', 'wed', 'fri'], start: '19:00', end: '22:00' }] },
  { id: 'd', name: 'Delta Hall', city: 'General Santos', area: 'Lagao', lat: 6.11, lng: 125.17, indoor: true, lights: true, courts: 3,
    hours: null, price: {}, booking: { url: 'https://book.delta' }, amenities: [] }
];
const TUE_EVENING = manila('2026-10-13', '19:30');
const DAVAO = { lat: 7.0731, lng: 125.6128 };

test('default state returns everything, smart sorted: featured, open, then name', () => {
  const rows = Filters.apply(COURTS, {}, { now: TUE_EVENING });
  assert.equal(rows.length, 4);
  assert.equal(rows[0].court.id, 'c'); /* featured + open */
  assert.equal(rows[1].court.id, 'a'); /* open */
  /* b closed at 19:30 (closes 6 PM), d unknown hours -> both not open, by rating then name */
  assert.deepEqual(rows.slice(2).map(r => r.court.id), ['b', 'd']);
});

test('city filter and search tokens', () => {
  assert.deepEqual(Filters.apply(COURTS, { city: 'Davao City' }, { now: TUE_EVENING }).map(r => r.court.id), ['a', 'b']);
  assert.deepEqual(Filters.apply(COURTS, { query: 'buhangin' }, { now: TUE_EVENING }).map(r => r.court.id), ['b']);
  assert.deepEqual(Filters.apply(COURTS, { query: 'indoor davao' }, { now: TUE_EVENING }).map(r => r.court.id), ['a']);
  assert.deepEqual(Filters.apply(COURTS, { query: 'public' }, { now: TUE_EVENING }).map(r => r.court.id), ['b']);
  assert.deepEqual(Filters.apply(COURTS, { query: 'zzz' }, { now: TUE_EVENING }), []);
});

test('open now, setting, lights, bookable, free, price, courts filters', () => {
  const ids = (s) => Filters.apply(COURTS, s, { now: TUE_EVENING }).map(r => r.court.id);
  assert.deepEqual(ids({ openNow: true, sort: 'name' }), ['a', 'c']);
  assert.deepEqual(ids({ setting: 'outdoor' }), ['b']);
  assert.deepEqual(ids({ setting: 'indoor', sort: 'name' }), ['a', 'c', 'd']);
  assert.deepEqual(ids({ lights: true, sort: 'name' }), ['a', 'c', 'd']);
  assert.deepEqual(ids({ bookable: true, sort: 'name' }), ['a', 'c', 'd']);
  assert.deepEqual(ids({ free: true }), ['b']);
  assert.deepEqual(ids({ maxPrice: 450, sort: 'name' }), ['a', 'b']); /* c = 150*4 = 600, d unknown */
  assert.deepEqual(ids({ minCourts: 4, sort: 'name' }), ['a', 'c']);
  assert.deepEqual(ids({ amenities: ['shower'] }), ['c']);
  assert.deepEqual(ids({ openPlay: true }), ['a']); /* Tuesday */
});

test('favorites filter uses a Set or an array', () => {
  const rows = Filters.apply(COURTS, { favoritesOnly: true }, { now: TUE_EVENING, favorites: new Set(['b']) });
  assert.deepEqual(rows.map(r => r.court.id), ['b']);
  const rows2 = Filters.apply(COURTS, { favoritesOnly: true }, { now: TUE_EVENING, favorites: ['d'] });
  assert.deepEqual(rows2.map(r => r.court.id), ['d']);
});

test('distance sort and text when a position is known', () => {
  const rows = Filters.apply(COURTS, { sort: 'distance' }, { now: TUE_EVENING, userPos: DAVAO });
  assert.deepEqual(rows.map(r => r.court.id), ['a', 'b', 'd', 'c']);
  assert.ok(rows[0].distanceText.endsWith('km'));
  const smart = Filters.apply(COURTS, {}, { now: TUE_EVENING, userPos: DAVAO });
  assert.equal(smart[0].court.id, 'c'); /* featured still wins */
  assert.equal(smart[1].court.id, 'a');
});

test('price and rating and courts sorts', () => {
  const ids = (s) => Filters.apply(COURTS, s, { now: TUE_EVENING }).map(r => r.court.id);
  assert.deepEqual(ids({ sort: 'price' }), ['b', 'a', 'c', 'd']);
  assert.deepEqual(ids({ sort: 'rating' }), ['c', 'a', 'b', 'd']);
  assert.deepEqual(ids({ sort: 'courts' }), ['c', 'a', 'd', 'b']);
});

test('price labels', () => {
  assert.equal(Filters.priceLabel(COURTS[0]), '₱400/hr');
  assert.equal(Filters.priceLabel(COURTS[1]), 'Free');
  assert.equal(Filters.priceLabel(COURTS[2]), '₱150/head');
  assert.equal(Filters.priceLabel(COURTS[3]), 'Ask for rates');
});

test('upcoming open play is soonest first and flags live sessions', () => {
  const rows = Filters.upcomingOpenPlay(COURTS, TUE_EVENING, 7);
  assert.equal(rows[0].court.id, 'a');
  assert.equal(rows[0].live, true);
  assert.equal(rows[0].label, 'Today 6 PM – 9 PM');
  assert.equal(rows[1].court.id, 'c');
  assert.equal(rows[1].label, 'Tomorrow 7 PM – 10 PM');
  assert.equal(rows[1].live, false);
  /* Friday and Monday sessions follow; Tuesday's own session next week is beyond 7 days? day offset 7 excluded */
  assert.deepEqual(rows.map(r => r.dayKey), ['tue', 'wed', 'fri', 'mon']);
});

test('finished sessions today are dropped', () => {
  const late = manila('2026-10-13', '21:30');
  const rows = Filters.upcomingOpenPlay(COURTS, late, 7);
  assert.equal(rows[0].court.id, 'c');
  assert.equal(rows[0].label, 'Tomorrow 7 PM – 10 PM');
});

test('active filter count and city counts', () => {
  assert.equal(Filters.activeCount(Filters.defaultState()), 0);
  assert.equal(Filters.activeCount({ openNow: true, setting: 'indoor', amenities: ['a', 'b'], maxPrice: 300 }), 5);
  assert.deepEqual(Filters.cityCounts(COURTS), [
    { city: 'Davao City', count: 2 }, { city: 'Cagayan de Oro', count: 1 }, { city: 'General Santos', count: 1 }
  ]);
});

test('venue-reported availability filters and boosts, and is inert without data', () => {
  const avail = { b: { free: 1, kind: 'free' }, d: { free: 0, kind: 'full' } };
  const rows = Filters.apply(COURTS, {}, { now: TUE_EVENING, availability: avail });
  assert.equal(rows[0].court.id, 'c', 'featured still first');
  assert.equal(rows[1].court.id, 'b', 'free courts beat merely open');
  assert.equal(rows[1].avail.free, 1);
  assert.equal(rows[3].avail.kind, 'full');
  assert.deepEqual(Filters.apply(COURTS, { freeNow: true }, { now: TUE_EVENING, availability: avail }).map(r => r.court.id), ['b']);
  assert.deepEqual(Filters.apply(COURTS, { freeNow: true }, { now: TUE_EVENING }), [], 'no data, no matches');
  const plain = Filters.apply(COURTS, {}, { now: TUE_EVENING });
  assert.deepEqual(plain.map(r => r.court.id), ['c', 'a', 'b', 'd'], 'without data the order is unchanged');
  assert.equal(plain[0].avail, null);
  assert.equal(Filters.activeCount({ freeNow: true }), 1);
});

test('nearest city respects a max radius', () => {
  const cities = [{ name: 'Davao City', lat: 7.19, lng: 125.45 }, { name: 'Cagayan de Oro', lat: 8.45, lng: 124.63 }];
  assert.equal(Filters.nearestCity(cities, DAVAO, 60).name, 'Davao City');
  assert.equal(Filters.nearestCity(cities, { lat: 14.6, lng: 121.0 }, 60), null); /* Manila */
  assert.equal(Filters.nearestCity(cities, null), null);
});
