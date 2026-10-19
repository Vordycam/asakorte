/* Filters: search, filter, sort, and open-play scheduling over the venue list.
   Pure: takes the list, the filter state, and a context {now, userPos, favorites}
   and returns enriched rows. No DOM, no storage. */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(require('./geo.js'), require('./hours.js'));
  } else {
    root.Filters = factory(root.Geo, root.Hours);
  }
})(typeof window !== 'undefined' ? window : globalThis, function (Geo, Hours) {
  'use strict';

  var DAYS = Hours.DAYS;

  function defaultState() {
    return {
      query: '',
      city: 'all',          /* 'all' or a city name */
      openNow: false,
      setting: 'any',       /* any | indoor | outdoor */
      lights: false,
      bookable: false,      /* has at least one booking channel */
      free: false,
      openPlay: false,      /* has an open-play session today */
      maxPrice: null,       /* PHP per hour */
      minCourts: 0,
      amenities: [],
      favoritesOnly: false,
      sort: 'smart'         /* smart | distance | name | price | rating | courts */
    };
  }

  /* Effective hourly price used for sorting and the "max price" filter. */
  function effectivePrice(court) {
    var p = court.price || {};
    if (p.free) return 0;
    if (isFinite(p.perHour)) return p.perHour;
    if (isFinite(p.perHead)) return p.perHead * 4;
    return Infinity;
  }

  function priceLabel(court) {
    var p = court.price || {};
    if (p.free) return 'Free';
    var parts = [];
    if (isFinite(p.perHour)) parts.push('₱' + p.perHour + '/hr');
    if (isFinite(p.perHead)) parts.push('₱' + p.perHead + '/head');
    if (!parts.length) return p.note ? p.note : 'Ask for rates';
    return parts.join(' · ');
  }

  function isBookable(court) {
    var b = court.booking || {};
    return !!(b.url || b.messenger || b.facebook || b.viber || b.phone || b.whatsapp);
  }

  function daysOf(session) {
    var d = session.day || session.days;
    if (!d) return [];
    if (d === 'daily') return DAYS.slice();
    if (d === 'weekdays') return ['mon', 'tue', 'wed', 'thu', 'fri'];
    if (d === 'weekends') return ['sat', 'sun'];
    return (Array.isArray(d) ? d : [d]).map(function (x) { return String(x).toLowerCase().slice(0, 3); });
  }

  /* Sessions on a given day key ('tue'). */
  function openPlayOn(court, dayKey) {
    return (court.openPlay || []).filter(function (s) { return daysOf(s).indexOf(dayKey) >= 0; });
  }

  function openPlayToday(court, now) {
    var t = Hours.localNow(now);
    return openPlayOn(court, DAYS[t.day]);
  }

  /* Upcoming open-play sessions across venues in the next `days` days, soonest first.
     Each row: { court, session, dayKey, dayOffset, startsInMin, startMin, endMin, label } */
  function upcomingOpenPlay(courts, now, days) {
    days = days || 7;
    var t = Hours.localNow(now);
    var rows = [];
    courts.forEach(function (court) {
      (court.openPlay || []).forEach(function (s) {
        var startMin = Hours.parseTime(s.start || '');
        var endMin = Hours.parseTime(s.end || '');
        if (startMin == null) return;
        if (endMin == null) endMin = startMin + 120;
        if (endMin <= startMin) endMin += 1440;
        var on = daysOf(s);
        for (var d = 0; d < days; d++) {
          var di = (t.day + d) % 7;
          if (on.indexOf(DAYS[di]) < 0) continue;
          var startsIn = d * 1440 + startMin - t.minutes;
          var endsIn = d * 1440 + endMin - t.minutes;
          if (endsIn <= 0) continue; /* already finished today */
          var live = startsIn <= 0 && endsIn > 0;
          rows.push({
            court: court, session: s, dayKey: DAYS[di], dayOffset: d, live: live,
            startsInMin: startsIn, startMin: startMin, endMin: endMin,
            label: (d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : Hours.DAY_LABEL[DAYS[di]]) + ' ' +
              Hours.fmtTime(startMin) + ' – ' + Hours.fmtTime(endMin)
          });
        }
      });
    });
    rows.sort(function (a, b) { return a.startsInMin - b.startsInMin || a.court.name.localeCompare(b.court.name); });
    return rows;
  }

  function haystack(court) {
    return [
      court.name, court.city, court.area, court.address, court.surface,
      (court.tags || []).join(' '), (court.amenities || []).join(' '),
      court.indoor ? 'indoor covered' : 'outdoor', court.lights ? 'lights night' : ''
    ].join(' ').toLowerCase();
  }

  function matchesQuery(court, query) {
    if (!query) return true;
    var hay = haystack(court);
    var tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    for (var i = 0; i < tokens.length; i++) if (hay.indexOf(tokens[i]) < 0) return false;
    return true;
  }

  /* Enrich one court with status/distance for the current context. */
  function enrich(court, ctx) {
    ctx = ctx || {};
    var dist = ctx.userPos ? Geo.distanceKm(ctx.userPos, court) : NaN;
    return {
      court: court,
      status: Hours.status(court.hours, ctx.now),
      distanceKm: dist,
      distanceText: Geo.formatDistance(dist),
      openPlayToday: openPlayToday(court, ctx.now),
      price: effectivePrice(court),
      priceText: priceLabel(court),
      bookable: isBookable(court),
      favorite: !!(ctx.favorites && (ctx.favorites.has ? ctx.favorites.has(court.id) : ctx.favorites.indexOf(court.id) >= 0))
    };
  }

  function passes(row, state) {
    var c = row.court;
    if (state.city && state.city !== 'all' && c.city !== state.city) return false;
    if (!matchesQuery(c, state.query)) return false;
    if (state.openNow && !row.status.open) return false;
    if (state.setting === 'indoor' && !c.indoor) return false;
    if (state.setting === 'outdoor' && c.indoor) return false;
    if (state.lights && !c.lights) return false;
    if (state.bookable && !row.bookable) return false;
    if (state.free && row.price !== 0) return false;
    if (state.openPlay && !row.openPlayToday.length) return false;
    if (isFinite(state.maxPrice) && state.maxPrice != null && row.price > state.maxPrice) return false;
    if (state.minCourts && (c.courts || 0) < state.minCourts) return false;
    if (state.favoritesOnly && !row.favorite) return false;
    if (state.amenities && state.amenities.length) {
      var have = c.amenities || [];
      for (var i = 0; i < state.amenities.length; i++) if (have.indexOf(state.amenities[i]) < 0) return false;
    }
    return true;
  }

  function cmpName(a, b) { return a.court.name.localeCompare(b.court.name); }

  function comparator(sort, hasPos) {
    switch (sort) {
      case 'distance':
        return function (a, b) {
          var da = isFinite(a.distanceKm) ? a.distanceKm : Infinity;
          var db = isFinite(b.distanceKm) ? b.distanceKm : Infinity;
          return da - db || cmpName(a, b);
        };
      case 'name': return cmpName;
      case 'price': return function (a, b) { return a.price - b.price || cmpName(a, b); };
      case 'rating': return function (a, b) { return (b.court.rating || 0) - (a.court.rating || 0) || cmpName(a, b); };
      case 'courts': return function (a, b) { return (b.court.courts || 0) - (a.court.courts || 0) || cmpName(a, b); };
      default: /* smart */
        return function (a, b) {
          var fa = a.court.featured ? 1 : 0, fb = b.court.featured ? 1 : 0;
          if (fa !== fb) return fb - fa;
          var oa = a.status.open ? 1 : 0, ob = b.status.open ? 1 : 0;
          if (oa !== ob) return ob - oa;
          if (hasPos) {
            var da = isFinite(a.distanceKm) ? a.distanceKm : Infinity;
            var db = isFinite(b.distanceKm) ? b.distanceKm : Infinity;
            if (da !== db) return da - db;
          }
          var ra = a.court.rating || 0, rb = b.court.rating || 0;
          if (ra !== rb) return rb - ra;
          return cmpName(a, b);
        };
    }
  }

  /* Main entry point. Returns enriched, filtered, sorted rows. */
  function apply(courts, state, ctx) {
    state = Object.assign(defaultState(), state || {});
    ctx = ctx || {};
    var rows = courts.map(function (c) { return enrich(c, ctx); }).filter(function (r) { return passes(r, state); });
    rows.sort(comparator(state.sort, !!ctx.userPos));
    return rows;
  }

  /* Count of active (non-default) filters, for the badge on the Filters button. */
  function activeCount(state) {
    var d = defaultState(), n = 0;
    state = Object.assign(defaultState(), state || {});
    ['openNow', 'lights', 'bookable', 'free', 'openPlay', 'favoritesOnly'].forEach(function (k) { if (state[k] !== d[k]) n++; });
    if (state.setting !== 'any') n++;
    if (state.maxPrice != null && isFinite(state.maxPrice)) n++;
    if (state.minCourts) n++;
    if (state.amenities && state.amenities.length) n += state.amenities.length;
    return n;
  }

  /* Distinct cities present in the data with venue counts, most venues first. */
  function cityCounts(courts) {
    var map = {};
    courts.forEach(function (c) { map[c.city] = (map[c.city] || 0) + 1; });
    return Object.keys(map).map(function (k) { return { city: k, count: map[k] }; })
      .sort(function (a, b) { return b.count - a.count || a.city.localeCompare(b.city); });
  }

  /* Nearest city centre to a position, or null. */
  function nearestCity(cities, pos, maxKm) {
    if (!pos) return null;
    var best = null, bestD = Infinity;
    cities.forEach(function (c) {
      var d = Geo.distanceKm(pos, c);
      if (d < bestD) { bestD = d; best = c; }
    });
    if (maxKm && bestD > maxKm) return null;
    return best;
  }

  return {
    defaultState: defaultState, apply: apply, enrich: enrich, passes: passes,
    effectivePrice: effectivePrice, priceLabel: priceLabel, isBookable: isBookable,
    openPlayToday: openPlayToday, openPlayOn: openPlayOn, upcomingOpenPlay: upcomingOpenPlay, daysOf: daysOf,
    matchesQuery: matchesQuery, activeCount: activeCount, cityCounts: cityCounts, nearestCity: nearestCity
  };
});
