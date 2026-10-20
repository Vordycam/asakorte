/* Availability core tests. `node --test` */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const A = require('../js/core/availability.js');

const COURTS = [
  { id: 'cdo-dink-district', name: 'Dink District', city: 'Cagayan de Oro', courts: 8 },
  { id: 'cdo-002-pickle-courts', name: '0-0-2 Pickle Courts', city: 'Cagayan de Oro' },
  { id: 'davao-dink-lab', name: 'Dink Lab', city: 'Davao City', courts: 12 }
];
const manila = (d, t) => new Date(d + 'T' + t + ':00+08:00');
const NOW = manila('2026-10-20', '19:30');

test('csv parsing handles quotes, commas and CRLF', () => {
  const rows = A.parseCsv('a,b,c\r\n"x, y","say ""hi""",3\r\n\r\n');
  assert.deepEqual(rows, [['a', 'b', 'c'], ['x, y', 'say "hi"', '3']]);
});

test('columns are found by keyword in any order', () => {
  const col = A.findColumns(['Timestamp', 'Which court are you reporting for?', 'Courts free right now', 'Free until (time)', 'Note (optional)']);
  assert.deepEqual(col, { time: 0, venue: 1, free: 2, until: 3, note: 4 });
  const col2 = A.findColumns(['Timestamp', 'Note', 'Free until', 'Available courts', 'Venue']);
  assert.deepEqual(col2, { time: 0, venue: 4, free: 3, until: 2, note: 1 });
});

test('timestamps in US, UK and ISO shapes, ambiguous day/month resolved toward now', () => {
  assert.equal(A.parseTimestamp('10/20/2026 19:05:00', NOW).toISOString(), '2026-10-20T11:05:00.000Z');
  assert.equal(A.parseTimestamp('20/10/2026 19:05', NOW).toISOString(), '2026-10-20T11:05:00.000Z');
  assert.equal(A.parseTimestamp('2026-10-20 7:05:00 PM', NOW).toISOString(), '2026-10-20T11:05:00.000Z');
  /* 10/11/2026 could be Oct 11 or Nov 10; Nov 10 is in the future, so Oct 11 wins */
  assert.equal(A.parseTimestamp('10/11/2026 10:00:00', NOW).toISOString(), '2026-10-11T02:00:00.000Z');
  /* 9/10/2026 could be Sep 10 or Oct 9; Oct 9 is closer to Oct 20 */
  assert.equal(A.parseTimestamp('9/10/2026 10:00:00', NOW).toISOString(), '2026-10-09T02:00:00.000Z');
  assert.equal(A.parseTimestamp('', NOW), null);
  assert.equal(A.parseTimestamp('nonsense', NOW), null);
});

test('court matching by id, name, or name (city)', () => {
  assert.equal(A.matchCourt('cdo-dink-district', COURTS).id, 'cdo-dink-district');
  assert.equal(A.matchCourt('dink district', COURTS).id, 'cdo-dink-district');
  assert.equal(A.matchCourt('Dink District (Cagayan de Oro)', COURTS).id, 'cdo-dink-district');
  assert.equal(A.matchCourt('0-0-2 Pickle Courts', COURTS).id, 'cdo-002-pickle-courts');
  assert.equal(A.matchCourt('Nowhere Courts', COURTS), null);
});

test('latest report per court wins and is live within its window', () => {
  const csv = [
    'Timestamp,Which court?,Courts free right now,Free until,Note',
    '10/20/2026 17:00:00,Dink District,5,9 PM,',
    '10/20/2026 19:10:00,Dink District,3,9 PM,Court 1 has a league',
    '10/20/2026 18:45:00,Dink Lab,0,10 PM,',
    '10/20/2026 09:00:00,0-0-2 Pickle Courts,1,11 AM,',
    '10/20/2026 19:00:00,Unknown Venue,4,,'
  ].join('\n');
  const r = A.parseReports(csv, COURTS, NOW);
  assert.equal(r.count, 2, 'two live reports');
  assert.equal(r.skipped, 1, 'unknown venue skipped');
  const dd = r.byId['cdo-dink-district'];
  assert.equal(dd.free, 3);
  assert.equal(dd.total, 8);
  assert.equal(dd.kind, 'free');
  assert.equal(dd.label, '3 of 8 courts free until 9 PM');
  assert.equal(dd.ago, '20 min ago');
  assert.equal(dd.note, 'Court 1 has a league');
  const dl = r.byId['davao-dink-lab'];
  assert.equal(dl.kind, 'full');
  assert.equal(dl.label, 'Fully booked until 10 PM');
  assert.ok(!r.byId['cdo-002-pickle-courts'], 'a morning report is expired by evening');
  const expired = r.all.find(e => e.courtId === 'cdo-002-pickle-courts');
  assert.equal(expired.live, false);
});

test('reports expire by age even without an until time, and never show from the future', () => {
  const csv = 'Timestamp,Court,Free\n10/20/2026 10:00:00,Dink District,4\n10/20/2026 23:00:00,Dink Lab,2';
  const r = A.parseReports(csv, COURTS, NOW, { maxAgeHours: 6, defaultValidHours: 3 });
  assert.equal(r.count, 0);
  const soon = A.parseReports('Timestamp,Court,Free\n10/20/2026 18:00:00,Dink District,4', COURTS, NOW);
  assert.equal(soon.byId['cdo-dink-district'].label, '4 of 8 courts free', 'no until text when none given');
  const past = A.parseReports('Timestamp,Court,Free\n10/20/2026 16:00:00,Dink District,4', COURTS, NOW);
  assert.equal(past.count, 0, 'default validity of 3 h has passed');
});

test('until earlier than the report time means tomorrow (past midnight)', () => {
  const late = manila('2026-10-21', '00:30');
  const csv = 'Timestamp,Court,Free,Until\n10/20/2026 23:40:00,Dink District,2,2 AM';
  const r = A.parseReports(csv, COURTS, late);
  assert.equal(r.count, 1);
  assert.equal(r.byId['cdo-dink-district'].label, '2 of 8 courts free until 2 AM');
});

test('free count equal to total reads without "of"', () => {
  const csv = 'Timestamp,Court,Free\n10/20/2026 19:00:00,Dink District,8';
  assert.equal(A.parseReports(csv, COURTS, NOW).byId['cdo-dink-district'].label, '8 courts free');
});

test('empty or header-only csv yields nothing', () => {
  assert.equal(A.parseReports('', COURTS, NOW).count, 0);
  assert.equal(A.parseReports('Timestamp,Court,Free', COURTS, NOW).count, 0);
  assert.equal(A.parseReports('a,b,c\n1,2,3', COURTS, NOW).count, 0, 'no recognisable columns');
});

test('ago text', () => {
  assert.equal(A.agoText(0.4), 'just now');
  assert.equal(A.agoText(12), '12 min ago');
  assert.equal(A.agoText(95), '1.6 h ago');
  assert.equal(A.agoText(60 * 30), '1 d ago');
});
