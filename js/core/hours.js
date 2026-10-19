/* Hours: opening-hours parsing and "open now" status.
   Venue hours are written by hand in the data file in a forgiving format:
     hours: { mon: '06:00-22:00', ..., sun: 'closed' }
     hours: { daily: '06:00-23:00' }                    (same every day)
     hours: { daily: '06:00-22:00', sun: '08:00-20:00' } (override a day)
     hours: '24h'                                         (always open)
     hours: { fri: '18:00-02:00' }                        (past midnight is fine)
     hours: { mon: '06:00-12:00, 15:00-22:00' }           (split shifts)
     hours: { weekdays: '6am-10pm', weekends: '7am-9pm' }
   Everything is evaluated in Asia/Manila regardless of the device timezone. */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.Hours = factory();
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  var DAY_LABEL = { sun: 'Sun', mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat' };
  var TZ = 'Asia/Manila';

  function parseTime(s) {
    var m = /^\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*$/i.exec(s);
    if (!m) return null;
    var h = parseInt(m[1], 10), min = m[2] ? parseInt(m[2], 10) : 0;
    var ap = m[3] ? m[3].toLowerCase() : null;
    if (ap === 'pm' && h < 12) h += 12;
    if (ap === 'am' && h === 12) h = 0;
    if (h > 24 || min > 59) return null;
    return h * 60 + min;
  }

  /* '06:00-22:00, 15:00-02:00' -> [[360,1320],[900,1560]] (minutes, close may exceed 1440). */
  function parseRanges(str) {
    if (str == null) return [];
    if (typeof str !== 'string') return [];
    var t = str.trim().toLowerCase();
    if (!t || t === 'closed' || t === 'x' || t === '-') return [];
    if (t === '24h' || t === '24 hours' || t === 'open 24h' || t === 'always') return [[0, 1440]];
    var out = [];
    t.split(/\s*[,;]\s*/).forEach(function (part) {
      var m = /^(.+?)\s*(?:-|–|to)\s*(.+)$/.exec(part);
      if (!m) return;
      var a = parseTime(m[1]), b = parseTime(m[2]);
      if (a == null || b == null) return;
      if (b <= a) b += 1440; /* past midnight */
      out.push([a, b]);
    });
    return out;
  }

  /* -> { table: { sun:[[a,b]], mon:[...], ... }, known } */
  function normalize(hours) {
    var table = {};
    DAYS.forEach(function (d) { table[d] = []; });
    if (!hours) return { table: table, known: false };
    if (typeof hours === 'string') {
      var r = parseRanges(hours);
      DAYS.forEach(function (d) { table[d] = r.slice(); });
      return { table: table, known: true };
    }
    var known = false;
    if (hours.daily != null) {
      var daily = parseRanges(hours.daily);
      DAYS.forEach(function (d) { table[d] = daily.slice(); });
      known = true;
    }
    if (hours.weekdays != null) {
      var wk = parseRanges(hours.weekdays);
      ['mon', 'tue', 'wed', 'thu', 'fri'].forEach(function (d) { table[d] = wk.slice(); });
      known = true;
    }
    if (hours.weekends != null) {
      var we = parseRanges(hours.weekends);
      ['sat', 'sun'].forEach(function (d) { table[d] = we.slice(); });
      known = true;
    }
    DAYS.forEach(function (d) {
      if (hours[d] != null) { table[d] = parseRanges(hours[d]); known = true; }
    });
    return { table: table, known: known };
  }

  /* Day index (0=Sun) and minutes since midnight for `now` in Manila. */
  function localNow(now) {
    now = now || new Date();
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: TZ, weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
      }).formatToParts(now);
      var w = '', h = 0, m = 0;
      parts.forEach(function (p) {
        if (p.type === 'weekday') w = p.value.toLowerCase().slice(0, 3);
        if (p.type === 'hour') h = parseInt(p.value, 10) % 24;
        if (p.type === 'minute') m = parseInt(p.value, 10);
      });
      var day = DAYS.indexOf(w);
      if (day < 0) day = now.getDay();
      return { day: day, minutes: h * 60 + m };
    } catch (e) {
      return { day: now.getDay(), minutes: now.getHours() * 60 + now.getMinutes() };
    }
  }

  function fmtTime(mins) {
    mins = ((mins % 1440) + 1440) % 1440;
    var h = Math.floor(mins / 60), m = mins % 60;
    var ap = h >= 12 ? 'PM' : 'AM';
    var hh = h % 12; if (hh === 0) hh = 12;
    return hh + (m ? ':' + String(m).padStart(2, '0') : '') + ' ' + ap;
  }

  function fmtRanges(ranges) {
    if (!ranges || !ranges.length) return 'Closed';
    if (ranges.length === 1 && ranges[0][0] === 0 && ranges[0][1] >= 1440) return 'Open 24 hours';
    return ranges.map(function (r) { return fmtTime(r[0]) + ' – ' + fmtTime(r[1]); }).join(', ');
  }

  /* Status for a venue right now.
     { known, open, closingSoon, label, short, closesAt, opensAt, openingSoon } */
  function status(hours, now) {
    var n = normalize(hours);
    if (!n.known) return { known: false, open: false, closingSoon: false, label: 'Hours not listed', short: 'Hours?' };
    var t = localNow(now);
    var today = n.table[DAYS[t.day]];
    var yesterday = n.table[DAYS[(t.day + 6) % 7]];
    var closesAt = null;

    /* Still inside a range that started yesterday and ran past midnight? */
    for (var i = 0; i < yesterday.length; i++) {
      if (yesterday[i][1] > 1440 && t.minutes + 1440 < yesterday[i][1]) { closesAt = yesterday[i][1] - 1440; }
    }
    for (var j = 0; j < today.length && closesAt == null; j++) {
      if (t.minutes >= today[j][0] && t.minutes < today[j][1]) closesAt = today[j][1];
    }
    if (closesAt != null) {
      var left = closesAt - t.minutes;
      var always = today.length === 1 && today[0][0] === 0 && today[0][1] >= 1440;
      var soon = !always && left <= 60;
      return {
        known: true, open: true, closingSoon: soon, closesAt: closesAt,
        label: always ? 'Open 24 hours' : (soon ? 'Closes soon · ' + fmtTime(closesAt) : 'Open · closes ' + fmtTime(closesAt)),
        short: always ? 'Open 24h' : (soon ? 'Closing soon' : 'Open now')
      };
    }

    /* Closed: find the next opening within 7 days. */
    for (var d = 0; d < 7; d++) {
      var di = (t.day + d) % 7;
      var ranges = n.table[DAYS[di]].slice().sort(function (a, b) { return a[0] - b[0]; });
      for (var k = 0; k < ranges.length; k++) {
        if (d === 0 && ranges[k][0] <= t.minutes) continue;
        var opensAt = ranges[k][0];
        var inMins = d * 1440 + opensAt - t.minutes;
        var soonOpen = inMins <= 60;
        var label = d === 0 ? (soonOpen ? 'Opens soon · ' + fmtTime(opensAt) : 'Closed · opens ' + fmtTime(opensAt))
          : d === 1 ? 'Closed · opens tomorrow ' + fmtTime(opensAt)
          : 'Closed · opens ' + DAY_LABEL[DAYS[di]] + ' ' + fmtTime(opensAt);
        return { known: true, open: false, closingSoon: false, openingSoon: soonOpen, opensAt: opensAt, opensDay: di, label: label, short: soonOpen ? 'Opens soon' : 'Closed' };
      }
    }
    return { known: true, open: false, closingSoon: false, label: 'Closed', short: 'Closed' };
  }

  /* Weekly table for the detail sheet: [{day:'Mon', text:'6 AM – 10 PM', today:true}] starting Monday. */
  function weekTable(hours, now) {
    var n = normalize(hours);
    var t = localNow(now);
    var order = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    return order.map(function (d) {
      return { key: d, day: DAY_LABEL[d], text: n.known ? fmtRanges(n.table[d]) : 'Not listed', today: DAYS[t.day] === d, closed: !n.table[d].length };
    });
  }

  /* Compact one-liner for cards, e.g. "Daily 6 AM – 10 PM" or "Mon–Fri 6 AM – 10 PM · Sat–Sun 7 AM – 8 PM". */
  function summary(hours) {
    var n = normalize(hours);
    if (!n.known) return 'Hours not listed';
    var order = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    var groups = [];
    order.forEach(function (d) {
      var text = fmtRanges(n.table[d]);
      var last = groups[groups.length - 1];
      if (last && last.text === text) last.to = d; else groups.push({ from: d, to: d, text: text });
    });
    if (groups.length === 1) return 'Daily ' + groups[0].text;
    return groups.map(function (g) {
      var span = g.from === g.to ? DAY_LABEL[g.from] : DAY_LABEL[g.from] + '–' + DAY_LABEL[g.to];
      return span + ' ' + g.text;
    }).join(' · ');
  }

  return {
    DAYS: DAYS, DAY_LABEL: DAY_LABEL, TZ: TZ,
    parseTime: parseTime, parseRanges: parseRanges, normalize: normalize,
    localNow: localNow, fmtTime: fmtTime, fmtRanges: fmtRanges,
    status: status, weekTable: weekTable, summary: summary
  };
});
