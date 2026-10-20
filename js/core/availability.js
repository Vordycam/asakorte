/* Availability: venue-reported "courts free right now", read from a published
   Google Sheet (CSV) that a Google Form fills in. Pure: no fetch, no DOM.

   Expected columns (matched by keyword, any order, any extra columns ignored):
     Timestamp | Which court? | Courts free right now | Free until | Note
   The venue column may hold the court id ("cdo-dink-district"), the court name
   ("Dink District"), or "Dink District (Cagayan de Oro)".

   A report is "live" only while it is recent and before its "until" time; stale
   reports are dropped so the app never shows a number nobody stands behind. */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory(require('./hours.js'));
  else root.AvailabilityCore = factory(root.Hours);
})(typeof window !== 'undefined' ? window : globalThis, function (Hours) {
  'use strict';

  var DEFAULTS = { maxAgeHours: 6, defaultValidHours: 3, tzOffset: '+08:00' };

  /* RFC 4180-ish CSV: quoted fields, doubled quotes, newlines inside quotes. */
  function parseCsv(text) {
    var rows = [], row = [], field = '', inQ = false, i = 0, c;
    text = String(text || '');
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    for (; i < text.length; i++) {
      c = text[i];
      if (inQ) {
        if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
        else field += c;
      } else if (c === '"') inQ = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(field); rows.push(row); row = []; field = '';
      } else field += c;
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (f) { return String(f).trim() !== ''; }); });
  }

  function norm(s) { return String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, ''); }

  /* Column indices from the header row. */
  function findColumns(header) {
    var h = header.map(function (x) { return String(x).toLowerCase(); });
    var col = { time: -1, venue: -1, free: -1, until: -1, note: -1 };
    h.forEach(function (x, i) {
      if (col.time < 0 && (x === 'timestamp' || (i === 0 && /time|date/.test(x)))) col.time = i;
      else if (col.until < 0 && /until|hangtod|hanggang/.test(x)) col.until = i;
      else if (col.free < 0 && /free|available|avail|open courts|libre|bakante/.test(x)) col.free = i;
      else if (col.venue < 0 && /court|venue|facility|lugar/.test(x)) col.venue = i;
      else if (col.note < 0 && /note|remark|comment|message/.test(x)) col.note = i;
    });
    return col;
  }

  /* Google Sheets timestamp text -> Date, in the sheet's timezone (Manila).
     Handles "10/20/2026 14:32:10", "20/10/2026 14:32", "2026-10-20 14:32:10",
     "10/20/2026 2:32:10 PM". Ambiguous day/month picks the reading closest to
     `now` that is not in the future. */
  function parseTimestamp(str, now, tzOffset) {
    if (!str) return null;
    var s = String(str).trim();
    var m = /^(\d{1,4})[\/\-.](\d{1,2})[\/\-.](\d{1,4})(?:[ T,]+(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*(am|pm)?)?/i.exec(s);
    if (!m) { var d = new Date(s); return isNaN(d) ? null : d; }
    var a = parseInt(m[1], 10), b = parseInt(m[2], 10), c = parseInt(m[3], 10);
    var hh = m[4] ? parseInt(m[4], 10) : 0, mm = m[5] ? parseInt(m[5], 10) : 0, ss = m[6] ? parseInt(m[6], 10) : 0;
    var ap = m[7] ? m[7].toLowerCase() : '';
    if (ap === 'pm' && hh < 12) hh += 12;
    if (ap === 'am' && hh === 12) hh = 0;
    var candidates = [];
    function add(y, mo, da) {
      if (y < 100) y += 2000;
      if (mo < 1 || mo > 12 || da < 1 || da > 31) return;
      var iso = y + '-' + String(mo).padStart(2, '0') + '-' + String(da).padStart(2, '0') + 'T' +
        String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0') + (tzOffset || DEFAULTS.tzOffset);
      var d = new Date(iso);
      if (!isNaN(d)) candidates.push(d);
    }
    if (m[1].length === 4) add(a, b, c);          /* y-m-d */
    else { add(c, a, b); add(c, b, a); }           /* m/d/y then d/m/y */
    if (!candidates.length) return null;
    if (candidates.length === 1) return candidates[0];
    var ref = now ? now.getTime() : Date.now();
    var best = null, bestScore = Infinity;
    candidates.forEach(function (d) {
      var diff = ref - d.getTime();                 /* positive = in the past */
      var score = diff < -86400000 ? Infinity : Math.abs(diff);
      if (score < bestScore) { bestScore = score; best = d; }
    });
    return best || candidates[0];
  }

  function matchCourt(value, courts) {
    var v = String(value || '').trim();
    if (!v) return null;
    var key = norm(v), keyNoCity = norm(v.replace(/\s*\([^)]*\)\s*$/, ''));
    for (var i = 0; i < courts.length; i++) {
      var c = courts[i];
      if (c.id === v || norm(c.id) === key) return c;
      if (norm(c.name) === key || norm(c.name) === keyNoCity) return c;
      if (norm(c.name + ' (' + c.city + ')') === key) return c;
    }
    return null;
  }

  /* "until" text -> Date, relative to the report time (Manila day). */
  function untilDate(text, updatedAt, defaultValidHours) {
    var mins = Hours.parseTime(String(text || '').replace(/\s*(tonight|today)\s*/i, '').trim());
    if (mins == null) return { date: new Date(updatedAt.getTime() + defaultValidHours * 3600000), text: '' };
    var upd = Hours.localNow(updatedAt);
    var diff = mins - upd.minutes;
    if (diff < 0) diff += 1440;
    return { date: new Date(updatedAt.getTime() + diff * 60000), text: Hours.fmtTime(mins) };
  }

  function agoText(ageMin) {
    if (ageMin < 1) return 'just now';
    if (ageMin < 60) return Math.round(ageMin) + ' min ago';
    var h = ageMin / 60;
    if (h < 24) return (h < 10 ? h.toFixed(1).replace(/\.0$/, '') : Math.round(h)) + ' h ago';
    return Math.round(h / 24) + ' d ago';
  }

  /* Main entry: CSV text + the court list -> { byId, all, count, columns } */
  function parseReports(csvText, courts, now, opts) {
    opts = Object.assign({}, DEFAULTS, opts || {});
    now = now || new Date();
    var rows = parseCsv(csvText);
    var out = { byId: {}, all: [], count: 0, columns: null, skipped: 0 };
    if (!rows.length) return out;
    var col = findColumns(rows[0]);
    out.columns = col;
    if (col.venue < 0 || col.free < 0) return out;
    var latest = {};
    rows.slice(1).forEach(function (r) {
      var court = matchCourt(r[col.venue], courts);
      var free = parseInt(String(r[col.free] || '').replace(/[^\d-]/g, ''), 10);
      var updatedAt = col.time >= 0 ? parseTimestamp(r[col.time], now, opts.tzOffset) : now;
      if (!court || isNaN(free) || !updatedAt) { out.skipped++; return; }
      if (free < 0) free = 0;
      var prev = latest[court.id];
      if (prev && prev.updatedAt.getTime() > updatedAt.getTime()) return;
      var until = untilDate(col.until >= 0 ? r[col.until] : '', updatedAt, opts.defaultValidHours);
      latest[court.id] = {
        courtId: court.id, free: free, total: isFinite(court.courts) ? court.courts : null,
        updatedAt: updatedAt, until: until.date, untilText: until.text,
        note: col.note >= 0 ? String(r[col.note] || '').trim() : ''
      };
    });
    Object.keys(latest).forEach(function (id) {
      var e = latest[id];
      e.ageMin = (now.getTime() - e.updatedAt.getTime()) / 60000;
      e.live = e.ageMin >= -5 && e.ageMin <= opts.maxAgeHours * 60 && now.getTime() < e.until.getTime();
      e.ago = agoText(Math.max(0, e.ageMin));
      Object.assign(e, label(e));
      out.all.push(e);
      if (e.live) { out.byId[id] = e; out.count++; }
    });
    return out;
  }

  function label(e) {
    var untilPart = e.untilText ? ' until ' + e.untilText : '';
    if (e.free > 0) {
      var n = e.free + (e.total && e.free < e.total ? ' of ' + e.total : '') + ' court' + (e.free === 1 ? '' : 's') + ' free';
      return { kind: 'free', short: n, label: n + untilPart };
    }
    return { kind: 'full', short: 'Fully booked', label: 'Fully booked' + untilPart };
  }

  return { DEFAULTS: DEFAULTS, parseCsv: parseCsv, findColumns: findColumns, parseTimestamp: parseTimestamp, matchCourt: matchCourt, untilDate: untilDate, agoText: agoText, parseReports: parseReports, label: label };
});
