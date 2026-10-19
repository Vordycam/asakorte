/* App: the UI. Everything the player sees is rendered from COURTS through
   Filters.apply(); nothing here touches a server. Booking happens on the
   venue's own channel (Messenger, Viber, phone, their booking site). */
(function () {
  'use strict';

  /* ── Owner settings: where "Add a court" and "Suggest an edit" messages go ── */
  var APP = {
    name: 'AsaKorte',
    version: '1.0.0',
    ownerEmail: '',                 /* e.g. 'hello@asakorte.ph' */
    ownerMessenger: '',             /* e.g. 'https://m.me/asakorte' (your Facebook page) */
    ownerFacebook: '',              /* e.g. 'https://www.facebook.com/asakorte' */
    nearCityKm: 60
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  function h(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ── Icons (inline SVG, stroke = currentColor) ── */
  var I = {};
  function svg(body, extra) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || '') + '>' + body + '</svg>'; }
  I.close = svg('<path d="M6 6l12 12M18 6 6 18"/>');
  I.heart = svg('<path d="M12 20.5s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 7.5 2.5c0 5.4-7.5 10-7.5 10z"/>');
  I.chat = svg('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"/><path d="m8 12 3 2 2-3 3 2" stroke-width="2.2"/>');
  I.viber = svg('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"/><path d="M9.5 9.5c.3 2.4 2.6 4.7 5 5l1.2-1.2 2 1.2-.8 1.6c-4.3.4-8.6-3.9-8.2-8.2l1.6-.8 1.2 2z"/>');
  I.phone = svg('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>');
  I.globe = svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>');
  I.facebook = svg('<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M15 8h-1.5A1.5 1.5 0 0 0 12 9.5V21M9.5 13H15"/>');
  I.instagram = svg('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>');
  I.whatsapp = svg('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1a4 4 0 0 1-2-2l1-1-1-2z"/>');
  I.pin = svg('<path d="M12 21s-6-5.3-6-11a6 6 0 0 1 12 0c0 5.7-6 11-6 11z"/><circle cx="12" cy="10" r="2.3"/>');
  I.nav = svg('<path d="m3 11 18-8-8 18-2-8z"/>');
  I.share = svg('<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6"/>');
  I.clock = svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>');
  I.bolt = svg('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>');
  I.roof = svg('<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>');
  I.sun = svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>');
  I.moon = svg('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>');
  I.auto = svg('<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>');
  I.grid = svg('<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>');
  I.peso = svg('<path d="M7 20V4h5a4 4 0 0 1 0 8H7M5 8h12M5 11h12"/>');
  I.calendar = svg('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>');
  I.filter = svg('<path d="M4 6h16M7 12h10M10 18h4"/>');
  I.star = svg('<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>');
  I.check = svg('<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>');
  I.chev = svg('<path d="m9 6 6 6-6 6"/>');
  I.plus = svg('<path d="M12 5v14M5 12h14"/>');
  I.info = svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>');
  I.download = svg('<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>');
  I.copy = svg('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>');
  I.edit = svg('<path d="M4 20h4l10.5-10.5a2 2 0 0 0-4-4L4 16z"/><path d="m13 7 4 4"/>');
  I.flag = svg('<path d="M5 21V4h11l-1 4 1 4H5"/>');
  I.ext = svg('<path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>');
  I.arrow = svg('<path d="M5 12h14M13 6l6 6-6 6"/>');
  I.users = svg('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.5A5 5 0 0 1 21.5 20"/>');
  I.locate = svg('<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>');
  I.ball = svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="7.5" r="1.2" fill="currentColor"/><circle cx="12" cy="16.5" r="1.2" fill="currentColor"/><circle cx="8" cy="9.8" r="1.2" fill="currentColor"/><circle cx="16" cy="9.8" r="1.2" fill="currentColor"/><circle cx="8" cy="14.2" r="1.2" fill="currentColor"/><circle cx="16" cy="14.2" r="1.2" fill="currentColor"/>');
  I.gift = svg('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8c-2-3-6-3-6-1s4 1 6 1zm0 0c2-3 6-3 6-1s-4 1-6 1z"/>');
  I.wallet = svg('<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 14h2"/>');
  I.shield = svg('<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>');
  I.mail = svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>');
  I.trash = svg('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>');

  var AMENITY_LABEL = {
    parking: 'Parking', restroom: 'Restroom', shower: 'Showers', 'paddle-rental': 'Paddle rental', 'ball-sales': 'Balls for sale',
    water: 'Drinking water', aircon: 'Air-conditioned', 'pro-shop': 'Pro shop', coaching: 'Coaching', cafe: 'Food & drinks',
    wifi: 'Wi-Fi', lockers: 'Lockers', seating: 'Seating', lights: 'Lights'
  };
  var PAY_LABEL = { gcash: 'GCash', maya: 'Maya', cash: 'Cash', card: 'Card', bank: 'Bank transfer' };
  var RESERVATION_LABEL = { required: 'Reservation required', recommended: 'Booking recommended', 'walk-in': 'Walk-in, first come first served' };

  /* ── State ── */
  var state = {
    tab: 'explore',
    filters: Filters.defaultState(),
    userPos: null,
    rows: [],
    sheet: null,          /* { kind: 'court'|'filters', id } */
    deferredInstall: null,
    mapInit: false,
    mapSelected: null
  };
  var COURT_BY_ID = {};
  COURTS.forEach(function (c) { COURT_BY_ID[c.id] = c; });
  var CITY_BY_NAME = {};
  CITIES.forEach(function (c) { CITY_BY_NAME[c.name] = c; });

  function ctx() { return { now: new Date(), userPos: state.userPos, favorites: Store.get('favorites') }; }
  function compute() { state.rows = Filters.apply(COURTS, state.filters, ctx()); return state.rows; }

  /* ── Toast ── */
  var toastTimer = null;
  function toast(msg, ms) {
    var el = $('#toast');
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, ms || 2200);
  }

  /* ── Theme ── */
  function applyTheme(pref) {
    var root = document.documentElement;
    if (pref === 'light' || pref === 'dark') root.setAttribute('data-theme', pref); else root.removeAttribute('data-theme');
    var btn = $('#btn-theme');
    if (btn) btn.innerHTML = pref === 'light' ? I.sun : pref === 'dark' ? I.moon : I.auto;
  }
  function cycleTheme() {
    var order = ['auto', 'light', 'dark'];
    var next = order[(order.indexOf(Store.get('theme')) + 1) % order.length];
    Store.set('theme', next); applyTheme(next);
    toast('Theme: ' + (next === 'auto' ? 'follows your phone' : next));
  }

  /* ── Cover art: a gradient per region and a glyph per venue type ── */
  var REGION_GRADIENT = {
    Davao: ['#1E3A8A', '#1D4ED8'], Northern: ['#0F766E', '#14B8A6'], SOCCSKSARGEN: ['#7C2D12', '#F97316'],
    BARMM: ['#4C1D95', '#8B5CF6'], Zamboanga: ['#9F1239', '#F43F5E'], Caraga: ['#065F46', '#10B981']
  };
  function coverStyle(court) {
    var city = CITY_BY_NAME[court.city];
    var g = (city && REGION_GRADIENT[city.region]) || ['#1E3A8A', '#1D4ED8'];
    return '--c1:' + g[0] + ';--c2:' + g[1];
  }
  function coverGlyph(court) {
    if (court.price && court.price.free) return '🌳';          /* tree: public court */
    if (court.indoor) return '🏓';                               /* paddle */
    return '🌤️';                                           /* sun behind cloud: outdoor */
  }

  /* ── Pills ── */
  function statusPill(st) {
    if (!st.known) return '<span class="pill unknown">' + I.clock + ' Hours not listed</span>';
    if (st.open && st.closingSoon) return '<span class="pill soon"><span class="dot"></span>' + h(st.label) + '</span>';
    if (st.open) return '<span class="pill open"><span class="dot"></span>' + h(st.label) + '</span>';
    if (st.openingSoon) return '<span class="pill soon">' + h(st.label) + '</span>';
    return '<span class="pill closed">' + h(st.label) + '</span>';
  }
  function attrPills(c) {
    var out = [];
    out.push('<span class="pill">' + (c.indoor ? I.roof + ' ' + (c.aircon ? 'Indoor · AC' : 'Indoor') : I.sun + ' Outdoor') + '</span>');
    if (c.courts) out.push('<span class="pill">' + I.grid + ' ' + c.courts + ' court' + (c.courts > 1 ? 's' : '') + '</span>');
    if (c.lights) out.push('<span class="pill">' + I.bolt + ' Lights</span>');
    return out.join('');
  }
  function priceText(row) {
    var c = row.court, p = c.price || {};
    if (p.free) return 'Free';
    var t = Filters.priceLabel(c);
    if (isFinite(p.peakPerHour) && isFinite(p.perHour)) t = '₱' + p.perHour + '–' + p.peakPerHour + '/hr';
    return t;
  }
  function bookRail(c) {
    var acts = Links.bookingActions(c);
    if (!acts.length) return '';
    var a = acts[0];
    var icon = { web: I.globe, messenger: I.chat, viber: I.viber, whatsapp: I.whatsapp, call: I.phone, facebook: I.facebook, instagram: I.instagram }[a.kind] || I.ext;
    var label = { web: 'Book online', messenger: 'Messenger', viber: 'Viber', whatsapp: 'WhatsApp', call: 'Call', facebook: 'Facebook', instagram: 'Instagram' }[a.kind];
    return '<span class="pill" title="Books via ' + h(label) + '">' + icon + ' ' + h(label) + '</span>';
  }

  /* ── Card ── */
  function cardHTML(row) {
    var c = row.court;
    var op = row.openPlayToday.length ? row.openPlayToday[0] : null;
    var acts = Links.bookingActions(c);
    var primary = acts[0];
    var cover = c.photo ? '<img src="' + h(c.photo) + '" alt="" loading="lazy">' : '<div class="court-lines"></div><div class="cover-emoji">' + coverGlyph(c) + '</div>';
    return '<article class="card' + (c.featured ? ' featured' : '') + '" data-id="' + h(c.id) + '">' +
      '<div class="card-cover" style="' + coverStyle(c) + '">' + cover +
        (c.featured ? '<span class="tag-featured">Featured</span>' : '') +
        (c.verified ? '<span class="tag-verified">' + I.check + ' Verified</span>' : '') +
        '<button class="fav-btn' + (row.favorite ? ' on' : '') + '" data-fav="' + h(c.id) + '" aria-label="Save" type="button">' + I.heart + '</button>' +
      '</div>' +
      '<div class="card-body">' +
        '<div class="card-top"><div><div class="card-name">' + h(c.name) + '</div><div class="card-place">' + h([c.area, c.city].filter(Boolean).join(' · ')) + '</div></div>' +
          (row.distanceText ? '<span class="card-dist">' + h(row.distanceText) + '</span>' : '') + '</div>' +
        '<div class="pill-row">' + statusPill(row.status) + attrPills(c) + '</div>' +
        '<div class="card-meta"><span class="price">' + h(priceText(row)) + '</span>' + (acts.length ? '<span class="sep">•</span>' + bookRail(c) : '') + '</div>' +
        (op ? '<div class="card-openplay">' + I.calendar + ' Open play today ' + h(Hours.fmtTime(Hours.parseTime(op.start))) + (op.end ? ' – ' + h(Hours.fmtTime(Hours.parseTime(op.end))) : '') + (op.fee ? ' · ₱' + h(op.fee) + '/head' : '') + '</div>' : '') +
        '<div class="card-actions">' +
          (primary ? '<a class="btn book grow" href="' + h(primary.href) + '" ' + (primary.external ? 'target="_blank" rel="noopener"' : '') + ' data-tap="' + h(c.id) + '">' + I.ball + ' Book</a>' : '<button class="btn grow" data-open="' + h(c.id) + '" type="button">' + I.info + ' Details</button>') +
          '<a class="btn" href="' + h(Links.directionsUrl(c)) + '" target="_blank" rel="noopener" aria-label="Directions">' + I.nav + ' Go</a>' +
          '<button class="btn sq" data-open="' + h(c.id) + '" type="button" aria-label="Details">' + I.chev + '</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  /* ── Explore ── */
  function renderCityChips() {
    var counts = Filters.cityCounts(COURTS);
    var countBy = {}; counts.forEach(function (c) { countBy[c.city] = c.count; });
    var cur = state.filters.city;
    var html = '<button class="chip' + (cur === 'all' ? ' on' : '') + '" data-city="all" type="button">All Mindanao <span class="n">' + COURTS.length + '</span></button>';
    counts.forEach(function (c) {
      var city = CITY_BY_NAME[c.city];
      html += '<button class="chip' + (cur === c.city ? ' on' : '') + '" data-city="' + h(c.city) + '" type="button">' + h(city ? city.short : c.city) + ' <span class="n">' + c.count + '</span></button>';
    });
    $('#city-chips').innerHTML = html;
    $('#map-city-chips').innerHTML = html;
  }

  function renderQuickChips() {
    var f = state.filters;
    var n = Filters.activeCount(f);
    var html = '';
    html += '<button class="chip lime' + (f.openNow ? ' on' : '') + '" data-q="openNow" type="button"><span class="dot" style="width:8px;height:8px;border-radius:50%;background:currentColor"></span> Open now</button>';
    html += '<button class="chip' + (f.openPlay ? ' on' : '') + '" data-q="openPlay" type="button">' + I.calendar + ' Open play today</button>';
    html += '<button class="chip' + (f.setting === 'indoor' ? ' on' : '') + '" data-setting="indoor" type="button">' + I.roof + ' Indoor</button>';
    html += '<button class="chip' + (f.setting === 'outdoor' ? ' on' : '') + '" data-setting="outdoor" type="button">' + I.sun + ' Outdoor</button>';
    html += '<button class="chip' + (f.lights ? ' on' : '') + '" data-q="lights" type="button">' + I.bolt + ' Lights</button>';
    html += '<button class="chip' + (f.free ? ' on' : '') + '" data-q="free" type="button">' + I.gift + ' Free</button>';
    html += '<span class="chip-divider"></span>';
    html += '<button class="chip" data-filters="1" type="button">' + I.filter + ' Filters' + (n ? ' <span class="badge">' + n + '</span>' : '') + '</button>';
    $('#quick-chips').innerHTML = html;
  }

  function renderList() {
    var rows = compute();
    var f = state.filters;
    var title = rows.length + ' court' + (rows.length === 1 ? '' : 's');
    var where = f.city === 'all' ? 'across Mindanao' : 'in ' + f.city;
    var sub = state.userPos && f.sort === 'distance' ? 'nearest first' : f.openNow ? 'open right now' : '';
    $('#results-title').innerHTML = h(title) + ' <span class="sub">' + h(where) + (sub ? ' · ' + h(sub) : '') + '</span>';
    $('#sort').value = f.sort;
    var list = $('#court-list');
    if (!rows.length) {
      list.innerHTML = '<div class="empty"><div class="big-emoji">🏓</div><h3>No courts match</h3><p>Try another city, clear a filter, or search by barangay.</p>' +
        '<button class="btn primary" data-reset="1" type="button">Clear filters</button></div>';
      return;
    }
    list.innerHTML = rows.map(cardHTML).join('');
  }

  function renderExplore() { renderCityChips(); renderQuickChips(); renderList(); updateTabCounts(); }

  /* ── Map tab ── */
  function showMap() {
    var loading = $('#map-loading');
    if (state.mapInit) { AppMap.invalidate(); syncMap(); return; }
    loading.hidden = false;
    loading.innerHTML = '<div class="spinner"></div><div>Loading map…</div>';
    AppMap.load().then(function () {
      AppMap.init($('#map'), function (row) { selectOnMap(row); }, {
        onTilesBlocked: function () {
          var n = $('#map-notice'); if (!n) return;
          n.textContent = navigator.onLine === false
            ? 'You are offline. Markers still work; map tiles need a connection.'
            : 'Map tiles cannot load in this preview. Markers still work; tiles show on the live site.';
          n.hidden = false;
        }
      });
      state.mapInit = true;
      loading.hidden = true;
      syncMap(!state.userPos || state.filters.city !== 'all');
      if (state.userPos) {
        AppMap.setMe(state.userPos);
        if (state.filters.city === 'all') AppMap.setView(state.userPos.lat, state.userPos.lng, 12);
      }
    }).catch(function (err) {
      loading.innerHTML = '<div style="font-size:40px">🗺️</div><div><b>' + h(err.message) + '</b><br><span class="small">The list still works offline. Tap Explore.</span></div>';
    });
  }
  function syncMap(fit) {
    if (!state.mapInit) return;
    var rows = state.rows.length || !Filters.activeCount(state.filters) ? state.rows : state.rows;
    AppMap.setMarkers(rows);
    if (fit) {
      var city = CITY_BY_NAME[state.filters.city];
      if (city) AppMap.setView(city.lat, city.lng, city.zoom); else AppMap.fitRows(rows);
    }
  }
  function selectOnMap(row) {
    state.mapSelected = row;
    var c = row.court;
    var pv = $('#map-preview');
    pv.innerHTML = '<div class="info"><div class="name">' + h(c.name) + '</div><div class="sub">' + h(row.status.label) + ' · ' + h(priceText(row)) + (row.distanceText ? ' · ' + h(row.distanceText) : '') + '</div></div>' +
      '<button class="btn book small" data-open="' + h(c.id) + '" type="button">Details ' + I.chev + '</button>';
    pv.classList.add('show');
  }

  /* ── Open play tab ── */
  function renderPlay() {
    var view = $('#view-play');
    var pool = state.filters.city === 'all' ? COURTS : COURTS.filter(function (c) { return c.city === state.filters.city; });
    var rows = Filters.upcomingOpenPlay(pool, new Date(), 7);
    var cityChips = $('#city-chips').innerHTML;
    var html = '<div class="section"><h2 class="section-title">Open play this week <span class="count">' + rows.length + ' session' + (rows.length === 1 ? '' : 's') + '</span></h2>' +
      '<p class="muted small" style="margin:0 0 4px">Drop-in sessions with rotation. Pay per head, bring a paddle or rent one.</p></div>' +
      '<div class="chip-row" id="play-city-chips">' + cityChips + '</div>';
    if (!rows.length) {
      html += '<div class="empty"><div class="big-emoji">📅</div><h3>No open play listed yet</h3><p>Venues add sessions as we verify them. Know one? Tell us in More → Add a court.</p></div>';
      view.innerHTML = html; return;
    }
    var groups = [], byKey = {};
    rows.forEach(function (r) {
      var key = r.dayOffset === 0 ? 'Today' : r.dayOffset === 1 ? 'Tomorrow' : Hours.DAY_LABEL[r.dayKey];
      if (!byKey[key]) { byKey[key] = []; groups.push(key); }
      byKey[key].push(r);
    });
    groups.forEach(function (g) {
      var live = byKey[g].some(function (r) { return r.live; });
      html += '<div class="day-group"><h3>' + h(g) + (live ? ' <span class="live">LIVE NOW</span>' : '') + '</h3>';
      byKey[g].forEach(function (r) {
        var s = r.session, c = r.court;
        var fee = s.fee ? '₱' + s.fee : (s.fee === 0 ? 'Free' : '');
        html += '<button class="session' + (r.live ? ' live' : '') + '" data-open="' + h(c.id) + '" type="button">' +
          '<div class="time"><div class="t">' + h(Hours.fmtTime(r.startMin)) + '</div><div class="d">to ' + h(Hours.fmtTime(r.endMin)) + '</div></div>' +
          '<div class="info"><div class="name">' + h(c.name) + '</div><div class="sub">' + h([s.level, c.area || c.city, s.note].filter(Boolean).join(' · ')) + '</div></div>' +
          (fee ? '<div class="fee' + (s.fee === 0 ? ' free' : '') + '">' + h(fee) + (s.fee ? '<br><span class="small muted">/head</span>' : '') + '</div>' : '') +
        '</button>';
      });
      html += '</div>';
    });
    view.innerHTML = html;
  }

  /* ── Saved tab ── */
  function renderSaved() {
    var view = $('#view-saved');
    var favs = Store.get('favorites');
    var recent = Store.get('recent').filter(function (id) { return favs.indexOf(id) < 0; });
    var c = ctx();
    var html = '<div class="section"><h2 class="section-title">Saved courts <span class="count">' + favs.length + '</span></h2></div>';
    if (!favs.length) {
      html += '<div class="empty"><div class="big-emoji">❤️</div><h3>Nothing saved yet</h3><p>Tap the heart on any court to keep it here, even offline.</p><button class="btn primary" data-tab-go="explore" type="button">Find courts</button></div>';
    } else {
      html += '<div class="court-list">' + favs.map(function (id) { return COURT_BY_ID[id]; }).filter(Boolean).map(function (court) { return cardHTML(Filters.enrich(court, c)); }).join('') + '</div>';
    }
    if (recent.length) {
      html += '<div class="section"><h2 class="section-title">Recently viewed</h2></div><div class="court-list">' +
        recent.map(function (id) { return COURT_BY_ID[id]; }).filter(Boolean).slice(0, 6).map(function (court) { return cardHTML(Filters.enrich(court, c)); }).join('') + '</div>';
    }
    view.innerHTML = html;
  }

  /* ── More tab ── */
  function renderMore() {
    var view = $('#view-more');
    var cities = Filters.cityCounts(COURTS).length;
    var verified = COURTS.filter(function (c) { return c.verified; }).length;
    var theme = Store.get('theme');
    var canInstall = !!state.deferredInstall;
    var standalone = isStandalone();
    view.innerHTML =
      '<div class="section"><div class="about-card">' +
        '<h3>' + I.ball.replace('<svg', '<svg style="width:20px;height:20px;vertical-align:-4px;color:var(--blue)"') + ' AsaKorte</h3>' +
        '<p><b>Asa ang korte?</b> is Bisaya for "where is the court?". This app answers it for every pickleball player in Mindanao: find a court, see if it is open, and book on the venue’s own Messenger, Viber, phone or booking page. No account, no fees, works offline.</p>' +
        '<div class="stat-row"><div class="stat"><b>' + COURTS.length + '</b><span>Courts</span></div><div class="stat"><b>' + cities + '</b><span>Cities</span></div><div class="stat"><b>' + verified + '</b><span>Verified</span></div></div>' +
      '</div></div>' +
      '<div class="section"><h2 class="section-title">For court owners</h2><div class="menu">' +
        '<button class="menu-item" data-more="add" type="button"><span class="ic lime">' + I.plus + '</span><span class="tx"><b>Add a court</b><span>Missing a venue? Send us the details and the Facebook or booking link.</span></span><span class="chev">' + I.chev + '</span></button>' +
        '<button class="menu-item" data-more="claim" type="button"><span class="ic">' + I.shield + '</span><span class="tx"><b>Claim your court</b><span>Get the Verified badge, control your hours, rates and open play.</span></span><span class="chev">' + I.chev + '</span></button>' +
        '<button class="menu-item" data-more="featured" type="button"><span class="ic">' + I.star + '</span><span class="tx"><b>Get featured</b><span>Show first in your city with a highlighted card.</span></span><span class="chev">' + I.chev + '</span></button>' +
      '</div></div>' +
      '<div class="section"><h2 class="section-title">App</h2><div class="menu">' +
        (standalone ? '' : '<button class="menu-item" data-more="install" type="button"><span class="ic">' + I.download + '</span><span class="tx"><b>Install on your phone</b><span>' + (canInstall ? 'One tap. Opens like an app, works offline.' : 'Add to your home screen for one-tap access.') + '</span></span><span class="chev">' + I.chev + '</span></button>') +
        '<div class="menu-item" style="cursor:default"><span class="ic">' + I.moon + '</span><span class="tx"><b>Theme</b><div class="seg theme-seg" id="theme-seg">' +
          ['auto', 'light', 'dark'].map(function (t) { return '<button type="button" data-theme="' + t + '" class="' + (theme === t ? 'on' : '') + '">' + (t === 'auto' ? 'Auto' : t === 'light' ? 'Light' : 'Dark') + '</button>'; }).join('') +
        '</div></span></div>' +
        '<button class="menu-item" data-more="share" type="button"><span class="ic">' + I.share + '</span><span class="tx"><b>Share AsaKorte</b><span>Send it to your dink group.</span></span><span class="chev">' + I.chev + '</span></button>' +
        '<button class="menu-item" data-more="feedback" type="button"><span class="ic">' + I.mail + '</span><span class="tx"><b>Report a problem</b><span>Wrong hours, closed venue, bad pin? Tell us.</span></span><span class="chev">' + I.chev + '</span></button>' +
        '<button class="menu-item" data-more="reset" type="button"><span class="ic" style="background:var(--coral-soft);color:var(--coral)">' + I.trash + '</span><span class="tx"><b>Clear saved data</b><span>Removes favorites and settings on this phone.</span></span><span class="chev">' + I.chev + '</span></button>' +
      '</div></div>' +
      '<div class="section" id="more-panel"></div>' +
      '<div class="section"><p class="hint" style="text-align:center">AsaKorte v' + APP.version + ' · Court data from venues and public listings. Hours and rates can change; the venue has the final say. Map © OpenStreetMap contributors.</p></div>';
  }

  function morePanel(kind) {
    var panel = $('#more-panel');
    if (!panel) return;
    var html = '';
    if (kind === 'add') {
      html = '<div class="form-card"><h3 style="margin-bottom:4px">Add a court</h3><p class="hint" style="margin:0 0 12px">Fill what you know. We verify every listing before it goes live.</p>' +
        '<div class="draft-grid">' +
          '<label class="field full">Court name<input id="ac-name" placeholder="e.g. Dink Spot Davao"></label>' +
          '<label class="field">City<select id="ac-city">' + CITIES.map(function (c) { return '<option>' + h(c.name) + '</option>'; }).join('') + '</select></label>' +
          '<label class="field">Barangay / area<input id="ac-area" placeholder="e.g. Buhangin"></label>' +
          '<label class="field full">Address or landmark<input id="ac-address" placeholder="Street, beside…"></label>' +
          '<label class="field full">Facebook page or booking link<input id="ac-link" placeholder="https://www.facebook.com/…"></label>' +
          '<label class="field">Phone / Viber<input id="ac-phone" placeholder="0917 123 4567"></label>' +
          '<label class="field">Courts<input id="ac-courts" type="number" min="1" placeholder="4"></label>' +
          '<label class="field">Indoor or outdoor<select id="ac-indoor"><option value="">Not sure</option><option value="indoor">Indoor / covered</option><option value="outdoor">Outdoor</option></select></label>' +
          '<label class="field">Rate per hour (₱)<input id="ac-price" type="number" min="0" placeholder="300 (0 = free)"></label>' +
          '<label class="field full">Hours<input id="ac-hours" placeholder="e.g. Daily 6 AM – 10 PM"></label>' +
          '<label class="field full">Open play, notes, Google Maps link<textarea id="ac-notes" placeholder="Tue & Thu 6–9 PM, ₱100/head…"></textarea></label>' +
        '</div>' +
        '<div class="draft-actions"><button class="btn primary grow" id="ac-build" type="button">' + I.arrow + ' Prepare message</button></div>' +
        '<div id="ac-out"></div></div>';
    } else if (kind === 'claim') {
      html = '<div class="form-card"><h3>Claim your court</h3><p>Own or manage a venue listed here? Claiming is free and gives you:</p>' +
        '<ul style="margin:0 0 10px 18px;padding:0"><li>The <b>Verified</b> badge on your card</li><li>Control of hours, rates, open play and the booking button</li><li>A direct line to fix anything in minutes</li></ul>' +
        '<p class="hint">Send a message from your venue’s Facebook page so we know it is really you.</p>' +
        '<div class="draft-actions">' + ownerContactButtons('Hi AsaKorte! I manage [venue name] in [city] and want to claim our listing. Our page is [Facebook link].') + '</div></div>';
    } else if (kind === 'featured') {
      html = '<div class="form-card"><h3>Get featured</h3><p>A featured court shows first in its city with a highlighted card and a lime marker on the map. It is the cheapest way to fill off-peak hours: one featured week costs less than two boosted posts.</p>' +
        '<ul style="margin:0 0 10px 18px;padding:0"><li>Top of the list in your city</li><li>Highlighted card and map marker</li><li>Your open play pinned on the Open play tab</li></ul>' +
        '<div class="draft-actions">' + ownerContactButtons('Hi AsaKorte! I would like to feature [venue name] in [city]. Please send me the rates.') + '</div></div>';
    } else if (kind === 'install') {
      if (state.deferredInstall) { promptInstall(); return; }
      html = '<div class="form-card"><h3>Install AsaKorte</h3>' + installInstructions() + '</div>';
    } else if (kind === 'feedback') {
      html = '<div class="form-card"><h3>Report a problem</h3><p class="hint" style="margin:0 0 10px">Tell us the court and what is wrong. We fix listings fast.</p>' +
        '<label class="field full">What happened?<textarea id="fb-text" placeholder="e.g. Court 88 now closes at 11 PM, not 12."></textarea></label>' +
        '<div class="draft-actions" id="fb-actions" style="margin-top:10px">' + ownerContactButtons('', 'fb-text') + '</div></div>';
    }
    panel.innerHTML = html;
    if (html) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function ownerContactButtons(text, fromId) {
    var hasMessenger = !!APP.ownerMessenger, hasEmail = !!APP.ownerEmail;
    var html = '';
    if (hasMessenger) html += '<a class="btn messenger grow" data-owner-msg="' + h(text) + '" data-from="' + h(fromId || '') + '" href="' + h(APP.ownerMessenger) + '" target="_blank" rel="noopener">' + I.chat + ' Messenger</a>';
    if (hasEmail) html += '<a class="btn primary grow" data-owner-mail="' + h(text) + '" data-from="' + h(fromId || '') + '" href="mailto:' + h(APP.ownerEmail) + '">' + I.mail + ' Email</a>';
    html += '<button class="btn grow" data-owner-copy="' + h(text) + '" data-from="' + h(fromId || '') + '" type="button">' + I.copy + ' Copy message</button>';
    if (!hasMessenger && !hasEmail) html += '<p class="hint full" style="width:100%">Owner: set ownerMessenger or ownerEmail at the top of js/app.js so this button opens your inbox.</p>';
    return html;
  }

  function buildAddCourtMessage() {
    var g = function (id) { return ($('#' + id) || {}).value || ''; };
    var name = g('ac-name').trim();
    if (!name) { toast('Give the court a name first'); $('#ac-name').focus(); return; }
    var indoor = g('ac-indoor');
    var price = g('ac-price');
    var lines = [
      'New court for AsaKorte:',
      'Name: ' + name,
      'City: ' + g('ac-city'),
      g('ac-area') && 'Area: ' + g('ac-area'),
      g('ac-address') && 'Address: ' + g('ac-address'),
      g('ac-link') && 'Link: ' + g('ac-link'),
      g('ac-phone') && 'Phone: ' + g('ac-phone'),
      g('ac-courts') && 'Courts: ' + g('ac-courts'),
      indoor && 'Type: ' + indoor,
      price !== '' && 'Rate: ' + (price === '0' ? 'Free' : '₱' + price + '/hr'),
      g('ac-hours') && 'Hours: ' + g('ac-hours'),
      g('ac-notes') && 'Notes: ' + g('ac-notes')
    ].filter(Boolean);
    var text = lines.join('\n');
    var slug = (g('ac-city').split(' ')[0] + '-' + name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    var entry = {
      id: slug, name: name, city: g('ac-city'), area: g('ac-area') || undefined, address: g('ac-address') || undefined,
      lat: 0, lng: 0, indoor: indoor ? indoor === 'indoor' : undefined, courts: g('ac-courts') ? Number(g('ac-courts')) : undefined,
      price: price === '' ? undefined : (price === '0' ? { free: true } : { perHour: Number(price) }),
      booking: { facebook: /facebook\.com|fb\.com/.test(g('ac-link')) ? g('ac-link') : undefined, url: /^https?:/.test(g('ac-link')) && !/facebook\.com|fb\.com/.test(g('ac-link')) ? g('ac-link') : undefined, phone: g('ac-phone') || undefined },
      notes: [g('ac-hours') && 'Hours: ' + g('ac-hours'), g('ac-notes')].filter(Boolean).join(' | ') || undefined
    };
    var json = JSON.stringify(entry, function (k, v) { return v === undefined ? undefined : v; }, 2);
    $('#ac-out').innerHTML = '<div class="draft-preview" id="ac-text">' + h(text) + '</div>' +
      '<div class="draft-actions">' + ownerContactButtons(text) + '</div>' +
      '<details style="margin-top:10px"><summary class="small muted" style="cursor:pointer">For the app owner: paste-ready entry for courts.js</summary><div class="code-box">' + h(json) + '</div></details>';
    $('#ac-out').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ── Install ── */
  function isStandalone() { return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true; }
  function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream; }
  function installInstructions() {
    if (isIOS()) return '<p>On iPhone: tap the <b>Share</b> button in Safari (the square with an arrow), then <b>Add to Home Screen</b>.</p>';
    return '<p>In Chrome: tap the <b>⋮</b> menu at the top right, then <b>Add to Home screen</b> or <b>Install app</b>.</p>';
  }
  function promptInstall() {
    var ev = state.deferredInstall;
    if (!ev) { morePanel('install'); return; }
    ev.prompt();
    ev.userChoice.then(function (r) {
      if (r && r.outcome === 'accepted') toast('Installed. Dula ta! 🏓');
      state.deferredInstall = null; $('#btn-install').hidden = true; hideBanner();
    });
  }
  function maybeShowInstallBanner() {
    if (isStandalone()) return;
    var visits = Store.get('visits');
    var dismissed = Store.get('installDismissed');
    if (dismissed && Date.now() - dismissed < 7 * 86400000) return;
    if (state.deferredInstall && visits >= 2) {
      showBanner('<b>Install AsaKorte</b>Opens like an app, works offline, no store needed.', '<button class="btn book" data-install="1" type="button">' + I.download + ' Install</button>');
    } else if (isIOS() && visits >= 2 && !Store.get('iosHintDismissed')) {
      showBanner('<b>Add to your Home Screen</b>Tap Share, then "Add to Home Screen" for one-tap access.', '');
    }
  }
  function showBanner(text, action) {
    $('#banner-root').innerHTML = '<div class="banner"><span class="tx">' + text + '</span>' + action + '<button class="x" data-banner-x="1" type="button" aria-label="Dismiss">' + I.close + '</button></div>';
  }
  function hideBanner() { $('#banner-root').innerHTML = ''; }

  /* ── Sheets ── */
  function openSheet(html, opts) {
    opts = opts || {};
    closeSheet({ silent: true });
    var root = $('#sheet-root');
    root.innerHTML = '<div class="sheet-backdrop" data-close="1"></div><div class="sheet" role="dialog" aria-modal="true"><div class="sheet-handle"><span></span></div><button class="sheet-close" data-close="1" type="button" aria-label="Close">' + I.close + '</button><div class="sheet-body">' + html + '</div></div>';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { requestAnimationFrame(function () { $('.sheet-backdrop', root).classList.add('show'); $('.sheet', root).classList.add('show'); }); });
    state.sheet = { kind: opts.kind, id: opts.id };
    if (!opts.fromPop) {
      var url = opts.kind === 'court' ? withParams({ court: opts.id }) : location.pathname + location.search;
      history.pushState({ sheet: opts.kind, id: opts.id }, '', url);
    }
    /* swipe down on the handle to close */
    var sheet = $('.sheet', root), startY = null;
    sheet.addEventListener('touchstart', function (e) { if (e.target.closest('.sheet-handle') || $('.sheet-body', root).scrollTop === 0) startY = e.touches[0].clientY; }, { passive: true });
    sheet.addEventListener('touchmove', function (e) {
      if (startY == null) return;
      var dy = e.touches[0].clientY - startY;
      if (dy > 0 && $('.sheet-body', root).scrollTop === 0) sheet.style.transform = 'translateY(' + dy + 'px)';
    }, { passive: true });
    sheet.addEventListener('touchend', function (e) {
      if (startY == null) return;
      var dy = e.changedTouches[0].clientY - startY; startY = null;
      if (dy > 90) closeSheet(); else sheet.style.transform = '';
    });
  }
  function closeSheet(opts) {
    opts = opts || {};
    var root = $('#sheet-root');
    var had = !!state.sheet;
    state.sheet = null;
    root.innerHTML = '';
    document.body.style.overflow = '';
    if (had && !opts.silent && !opts.fromPop && history.state && history.state.sheet) history.back();
    else if (had && !opts.fromPop && !opts.silent) replaceUrl(withParams({ court: null }));
  }
  function withParams(changes) {
    var p = new URLSearchParams(location.search);
    Object.keys(changes).forEach(function (k) { if (changes[k] == null) p.delete(k); else p.set(k, changes[k]); });
    p.delete('source');
    var q = p.toString();
    return location.pathname + (q ? '?' + q : '');
  }
  function replaceUrl(url) { history.replaceState(history.state && history.state.sheet ? null : history.state, '', url); }

  /* ── Court detail sheet ── */
  function courtSheet(id, opts) {
    var c = COURT_BY_ID[id];
    if (!c) { toast('That court is not in the list'); return; }
    var row = Filters.enrich(c, ctx());
    Store.touchRecent(id);
    var acts = Links.bookingActions(c);
    var primary = acts[0];
    var b = c.booking || {};
    var week = Hours.weekTable(c.hours);
    var p = c.price || {};
    var cover = c.photo ? '<img src="' + h(c.photo) + '" alt="">' : '<div class="court-lines" style="position:absolute;inset:0;opacity:.2;background-image:linear-gradient(90deg,#fff 2px,transparent 2px),linear-gradient(#fff 2px,transparent 2px);background-size:50% 100%,100% 42%;background-position:0 0,0 29%"></div><div class="cover-emoji">' + coverGlyph(c) + '</div>';

    var priceTiles = '';
    if (p.free) priceTiles += '<div class="info-tile"><div class="k">Rate</div><div class="v">Free' + (p.note ? ' <small>' + h(p.note) + '</small>' : '') + '</div></div>';
    else if (isFinite(p.perHour)) priceTiles += '<div class="info-tile"><div class="k">Per hour</div><div class="v">₱' + h(p.perHour) + (isFinite(p.peakPerHour) ? ' <small>off-peak</small></div><div class="v">₱' + h(p.peakPerHour) + ' <small>' + h(p.peakNote || 'peak') + '</small>' : '') + '</div></div>';
    else if (isFinite(p.perHead)) priceTiles += '<div class="info-tile"><div class="k">Per head</div><div class="v">₱' + h(p.perHead) + '</div></div>';
    else priceTiles += '<div class="info-tile"><div class="k">Rate</div><div class="v">' + h(p.note || 'Ask the venue') + '</div></div>';
    if (!p.free && p.note && isFinite(p.perHour)) priceTiles += '<div class="info-tile"><div class="k">Note</div><div class="v"><small>' + h(p.note) + '</small></div></div>';

    var tiles = priceTiles +
      '<div class="info-tile"><div class="k">Courts</div><div class="v">' + (c.courts ? h(c.courts) : '?') + ' <small>' + (c.indoor ? (c.aircon ? 'indoor, air-con' : 'indoor / covered') : 'outdoor') + '</small></div></div>' +
      (c.surface || c.nets || c.lines ? '<div class="info-tile"><div class="k">Surface</div><div class="v"><small>' + h([c.surface, c.nets && c.nets + ' nets', c.lines && c.lines + ' lines'].filter(Boolean).join(' · ')) + '</small></div></div>' : '') +
      '<div class="info-tile"><div class="k">Booking</div><div class="v"><small>' + h(RESERVATION_LABEL[b.reservation] || 'Ask the venue') + '</small></div></div>' +
      (c.payments && c.payments.length ? '<div class="info-tile"><div class="k">Pays with</div><div class="v"><small>' + h(c.payments.map(function (x) { return PAY_LABEL[x] || x; }).join(', ')) + '</small></div></div>' : '') +
      (c.busy ? '<div class="info-tile"><div class="k">Usually busy</div><div class="v"><small>' + h(c.busy) + '</small></div></div>' : '');

    var bookStack = acts.map(function (a) {
      var cls = { messenger: 'messenger', viber: 'viber', whatsapp: 'whatsapp', web: 'primary', call: 'ink', facebook: '', instagram: '' }[a.kind] || '';
      var icon = { web: I.globe, messenger: I.chat, viber: I.viber, whatsapp: I.whatsapp, call: I.phone, facebook: I.facebook, instagram: I.instagram }[a.kind] || I.ext;
      return '<a class="btn ' + cls + (a.primary ? ' big' : '') + '" href="' + h(a.href) + '" ' + (a.external ? 'target="_blank" rel="noopener"' : '') + ' data-tap="' + h(c.id) + '">' + icon + ' ' + h(a.label) + '<span class="arrow">' + I.arrow + '</span></a>';
    }).join('');
    if (!acts.length) bookStack = '<p class="muted small" style="margin:0">No contact listed yet. ' + (b.notes ? h(b.notes) + ' ' : '') + 'Know it? <a href="#" data-more-go="feedback">Tell us</a>.</p>';

    var draft = Store.get('bookingDraft') || {};
    var today = new Date(); var tomorrow = new Date(today.getTime() + 86400000);
    var defDate = draft.date || fmtDateInput(tomorrow);
    var draftHTML = acts.length ? '<details class="draft" ' + (opts && opts.openDraft ? 'open' : '') + '><summary>' + I.edit + ' Write the booking message for me</summary>' +
      '<div class="draft-grid">' +
        '<label class="field">Date<input type="date" id="d-date" value="' + h(defDate) + '" min="' + fmtDateInput(today) + '"></label>' +
        '<label class="field">Time<input type="time" id="d-time" value="' + h(draft.time || '18:00') + '"></label>' +
        '<label class="field">Hours<select id="d-hours">' + [1, 2, 3, 4].map(function (n) { return '<option value="' + n + '"' + ((draft.hours || 2) == n ? ' selected' : '') + '>' + n + ' hour' + (n > 1 ? 's' : '') + '</option>'; }).join('') + '</select></label>' +
        '<label class="field">Players<select id="d-players">' + [2, 4, 6, 8, 12, 16].map(function (n) { return '<option value="' + n + '"' + ((draft.players || 4) == n ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></label>' +
        '<label class="field full">Your name<input id="d-name" value="' + h(draft.name || '') + '" placeholder="So they know who to reply to"></label>' +
      '</div>' +
      '<div class="draft-preview" id="d-preview"></div>' +
      '<div class="draft-actions"><button class="btn primary grow" data-copy-draft="1" type="button">' + I.copy + ' Copy message</button>' +
        (primary ? '<a class="btn book grow" href="' + h(primary.href) + '" ' + (primary.external ? 'target="_blank" rel="noopener"' : '') + ' data-tap="' + h(c.id) + '">Then send ' + I.arrow + '</a>' : '') + '</div>' +
      '<p class="hint">Copy, open the chat, paste. Most venues reply within minutes.</p>' +
    '</details>' : '';

    var openPlayHTML = (c.openPlay || []).length ? '<h3 class="h">' + I.calendar + ' Open play</h3><div class="openplay-list">' + c.openPlay.map(function (s) {
      var days = Filters.daysOf(s);
      var dayText = s.day === 'daily' || s.days === 'daily' ? 'Daily' : s.day === 'weekdays' ? 'Mon–Fri' : s.day === 'weekends' ? 'Sat–Sun' : days.map(function (d) { return Hours.DAY_LABEL[d] || d; }).join(', ');
      return '<div class="op-row"><div class="d">' + h(dayText) + '</div><div class="t">' + h(Hours.fmtTime(Hours.parseTime(s.start))) + (s.end ? ' – ' + h(Hours.fmtTime(Hours.parseTime(s.end))) : '') + '<small>' + h([s.level, s.note].filter(Boolean).join(' · ')) + '</small></div><div class="f">' + (s.fee ? '₱' + h(s.fee) : s.fee === 0 ? 'Free' : '') + '</div></div>';
    }).join('') + '</div>' : '';

    var amen = (c.amenities || []).filter(function (a) { return a !== 'lights'; });
    var amenHTML = amen.length ? '<h3 class="h">' + I.check + ' Amenities</h3><div class="amenities">' + amen.map(function (a) { return '<span class="pill">' + h(AMENITY_LABEL[a] || a) + '</span>'; }).join('') + '</div>' : '';

    var html =
      '<div class="sheet-cover" style="' + coverStyle(c) + '">' + cover + '</div>' +
      '<div class="sheet-title"><div><h2>' + h(c.name) + '</h2><div class="place">' + h([c.area, c.city].filter(Boolean).join(' · ')) + (row.distanceText ? ' · ' + h(row.distanceText) + ' away' : '') + '</div></div>' +
        (c.rating ? '<span class="pill" style="flex:none">' + I.star + ' ' + h(c.rating) + (c.reviews ? ' <span class="muted">(' + h(c.reviews) + ')</span>' : '') + '</span>' : '') + '</div>' +
      '<div class="pill-row">' + statusPill(row.status) + attrPills(c) + (c.featured ? '<span class="pill" style="background:var(--lime);color:var(--lime-ink)">' + I.star + ' Featured</span>' : '') + '</div>' +
      '<div class="sheet-actions">' +
        '<a class="act" href="' + h(Links.directionsUrl(c)) + '" target="_blank" rel="noopener">' + I.nav + 'Directions</a>' +
        '<a class="act" href="' + h(Links.wazeUrl(c)) + '" target="_blank" rel="noopener">' + I.pin + 'Waze</a>' +
        '<button class="act" data-share="' + h(c.id) + '" type="button">' + I.share + 'Share</button>' +
        '<button class="act' + (row.favorite ? ' on' : '') + '" data-fav="' + h(c.id) + '" data-fav-act="1" type="button">' + I.heart + (row.favorite ? 'Saved' : 'Save') + '</button>' +
      '</div>' +
      '<div class="book-block"><h3>' + (acts.length ? 'Book this court' : 'Contact') + '</h3>' +
        (b.notes && acts.length ? '<div class="note">' + h(b.notes) + '</div>' : '') +
        '<div class="book-stack">' + bookStack + '</div>' + draftHTML + '</div>' +
      '<div class="info-grid">' + tiles + '</div>' +
      '<h3 class="h">' + I.clock + ' Hours</h3>' +
      (row.status.known ? '<table class="hours-table">' + week.map(function (d) { return '<tr class="' + (d.today ? 'today' : '') + '"><td>' + h(d.day) + '</td><td class="' + (d.closed ? 'closed' : '') + '">' + h(d.text) + '</td></tr>'; }).join('') + '</table>'
        : '<p class="muted small" style="margin:0">Hours not listed yet. Message the venue to ask, or <a href="#" data-more-go="feedback">tell us</a> if you know them.</p>') +
      openPlayHTML + amenHTML +
      '<h3 class="h">' + I.pin + ' Where</h3><div class="address-block">' + I.pin + '<div>' + h(c.address || c.area || c.city) + (c.address ? '<br><span class="muted small">' + h(c.city) + '</span>' : '') + (c.pinApprox ? '<br><span class="small" style="color:var(--amber)">Map pin is approximate</span>' : '') + '</div></div>' +
      '<div class="nav-row"><a class="btn grow" href="' + h(Links.mapsSearchUrl(c)) + '" target="_blank" rel="noopener">' + I.globe + ' Google Maps</a><button class="btn grow" data-map-go="' + h(c.id) + '" type="button">' + I.pin + ' Show on map</button></div>' +
      (c.notes ? '<div class="note-box">' + h(c.notes) + '</div>' : '') +
      '<div class="verify-line"><span>' + (c.verified ? I.check.replace('<svg', '<svg style="width:14px;height:14px;vertical-align:-2px;color:var(--open)"') + ' Verified ' + h(c.verified) : 'Not yet verified' + (c.source ? ' · from ' + h(c.source) : '')) + '</span>' +
        '<a href="#" data-suggest="' + h(c.id) + '">' + I.flag.replace('<svg', '<svg style="width:14px;height:14px;vertical-align:-2px"') + ' Suggest an edit</a></div>';

    openSheet(html, { kind: 'court', id: id, fromPop: opts && opts.fromPop });
    updateDraftPreview();
  }

  function fmtDateInput(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function draftText() {
    var c = state.sheet && COURT_BY_ID[state.sheet.id];
    if (!c || !$('#d-date')) return '';
    var date = $('#d-date').value, time = $('#d-time').value, hours = $('#d-hours').value, players = $('#d-players').value, name = $('#d-name').value.trim();
    var d = date ? new Date(date + 'T00:00:00') : null;
    var dateText = d && !isNaN(d) ? d.toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' }) : date;
    var t = time ? Hours.fmtTime(Hours.parseTime(time)) : '';
    Store.set('bookingDraft', { date: date, time: time, hours: hours, players: players, name: name });
    return 'Hi ' + c.name + '! 👋 I’d like to book a court on ' + dateText + ' at ' + t + ' for ' + hours + ' hour' + (hours > 1 ? 's' : '') + ', ' + players + ' players. Is that available? How much, and how do I pay? Thank you!' + (name ? '\n— ' + name : '');
  }
  function updateDraftPreview() { var el = $('#d-preview'); if (el) el.textContent = draftText(); }

  /* ── Filters sheet ── */
  function filtersSheet() {
    var f = state.filters;
    var count = Filters.apply(COURTS, f, ctx()).length;
    var amen = ['parking', 'restroom', 'shower', 'paddle-rental', 'aircon', 'cafe', 'coaching', 'pro-shop'];
    var html = '<h2 style="font-size:1.25rem;margin-top:8px">Filters</h2>' +
      '<div class="filter-group"><h4>Setting</h4><div class="seg" id="f-setting">' + ['any', 'indoor', 'outdoor'].map(function (s) { return '<button type="button" data-v="' + s + '" class="' + (f.setting === s ? 'on' : '') + '">' + (s === 'any' ? 'Any' : s === 'indoor' ? 'Indoor' : 'Outdoor') + '</button>'; }).join('') + '</div></div>' +
      '<div class="filter-group"><h4>Show only</h4><div class="toggle-list">' +
        toggle('openNow', 'Open right now', 'Based on listed hours, Manila time') +
        toggle('openPlay', 'Open play today', 'Drop-in sessions today') +
        toggle('lights', 'Night play (lights)', '') +
        toggle('bookable', 'Can book or message', 'Has Messenger, Viber, phone or a booking site') +
        toggle('free', 'Free courts', 'Public and community courts') +
        toggle('favoritesOnly', 'Saved only', '') +
      '</div></div>' +
      '<div class="filter-group"><h4>Max rate per hour</h4><div class="range-row"><input type="range" id="f-price" min="100" max="500" step="25" value="' + (f.maxPrice == null ? 500 : f.maxPrice) + '"><span class="val" id="f-price-val">' + (f.maxPrice == null ? 'Any' : '₱' + f.maxPrice) + '</span></div><p class="hint">Courts with no listed rate are hidden when a max is set.</p></div>' +
      '<div class="filter-group"><h4>Minimum courts</h4><div class="seg" id="f-courts">' + [0, 2, 4, 8].map(function (n) { return '<button type="button" data-v="' + n + '" class="' + (f.minCourts === n ? 'on' : '') + '">' + (n ? n + '+' : 'Any') + '</button>'; }).join('') + '</div></div>' +
      '<div class="filter-group"><h4>Amenities</h4><div class="amenities" id="f-amen">' + amen.map(function (a) { return '<button type="button" class="chip' + (f.amenities.indexOf(a) >= 0 ? ' on' : '') + '" data-a="' + a + '">' + h(AMENITY_LABEL[a]) + '</button>'; }).join('') + '</div></div>' +
      '<div class="sheet-footer"><button class="btn grow" data-reset="1" type="button">Reset</button><button class="btn primary grow" data-close="1" type="button" id="f-apply">Show ' + count + ' court' + (count === 1 ? '' : 's') + '</button></div>';
    openSheet(html, { kind: 'filters' });
  }
  function toggle(key, label, sub) {
    return '<label class="toggle"><span>' + h(label) + (sub ? '<span class="sub">' + h(sub) + '</span>' : '') + '</span><span class="switch"><input type="checkbox" data-t="' + key + '"' + (state.filters[key] ? ' checked' : '') + '><span></span></span></label>';
  }
  function refreshFilterCount() {
    var btn = $('#f-apply'); if (!btn) return;
    var n = Filters.apply(COURTS, state.filters, ctx()).length;
    btn.textContent = 'Show ' + n + ' court' + (n === 1 ? '' : 's');
  }

  /* ── Geolocation ── */
  function locate(fromMap) {
    var btn = $('#btn-locate'), fab = $('#map-locate'), note = $('#locate-note');
    btn.classList.add('busy'); fab.classList.add('busy');
    note.textContent = 'Finding you…';
    Geo.locate().then(function (pos) {
      state.userPos = pos;
      Store.set('lastPos', { lat: pos.lat, lng: pos.lng, t: Date.now() });
      btn.classList.remove('busy'); btn.classList.add('on'); fab.classList.remove('busy');
      var near = Filters.nearestCity(CITIES, pos, APP.nearCityKm);
      state.filters.sort = 'distance';
      if (near) { state.filters.city = 'all'; note.textContent = 'You are near ' + near.name + '. Sorted by distance.'; }
      else note.textContent = 'Sorted by distance from you.';
      Store.set('city', state.filters.city);
      renderExplore();
      if (state.mapInit) { AppMap.setMe(pos); if (fromMap) AppMap.setView(pos.lat, pos.lng, 13); syncMap(); }
      toast(near ? 'Courts near ' + near.short + ', nearest first' : 'Sorted by distance');
    }).catch(function (err) {
      btn.classList.remove('busy'); fab.classList.remove('busy');
      note.textContent = err.message;
      toast(err.message, 3200);
    });
  }

  /* ── Share ── */
  /* When the app is hosted somewhere that cannot read query strings from its public link
     (a preview page), window.ASAKORTE_SHARE_BASE holds the public URL and courts are
     shared as "<base>#<court-id>". The real deployment leaves it unset. */
  function appShareBase() {
    return window.ASAKORTE_SHARE_BASE ? String(window.ASAKORTE_SHARE_BASE).replace(/#.*$/, '') : '';
  }
  function courtShareUrl(id) {
    var base = appShareBase();
    return base ? base + '#' + encodeURIComponent(id) : Links.shareUrl(id);
  }
  /* Share sheet when the device offers one; otherwise, or when it refuses, copy the link. */
  function shareOrCopy(data, copiedMsg) {
    var fallback = function () { copy(data.text + '\n' + data.url).then(function () { toast(copiedMsg); }); };
    if (navigator.share) {
      navigator.share(data).catch(function (err) { if (!err || err.name !== 'AbortError') fallback(); });
    } else fallback();
  }
  function shareCourt(id) {
    var c = COURT_BY_ID[id]; if (!c) return;
    var st = Hours.status(c.hours);
    var text = c.name + ' – ' + [c.area, c.city].filter(Boolean).join(', ') + (st.known ? ' · ' + st.label : '') + ' · ' + Filters.priceLabel(c);
    shareOrCopy({ title: c.name + ' on AsaKorte', text: text, url: courtShareUrl(id) }, 'Link copied. Paste it in your group chat.');
  }
  function shareApp() {
    var url = appShareBase() || (location.origin + location.pathname);
    var text = 'AsaKorte: find pickleball courts in Mindanao, see who is open now, and book in one tap. 🏓';
    shareOrCopy({ title: 'AsaKorte', text: text, url: url }, 'Link copied');
  }
  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).catch(function () { return fallbackCopy(text); });
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ── Tabs ── */
  function showTab(name, opts) {
    state.tab = name;
    $$('.tab').forEach(function (t) { var on = t.dataset.tab === name; t.classList.toggle('active', on); t.setAttribute('aria-selected', on ? 'true' : 'false'); });
    $$('.view').forEach(function (v) { v.classList.toggle('active', v.id === 'view-' + name); });
    if (name === 'explore') renderExplore();
    if (name === 'map') showMap();
    if (name === 'play') renderPlay();
    if (name === 'saved') renderSaved();
    if (name === 'more') renderMore();
    if (!(opts && opts.keepScroll)) window.scrollTo(0, 0);
  }
  function updateTabCounts() {
    var favs = Store.get('favorites').length;
    var tab = $('.tab[data-tab="saved"]');
    var old = $('.cnt', tab); if (old) old.remove();
    if (favs) tab.insertAdjacentHTML('beforeend', '<span class="cnt">' + favs + '</span>');
  }

  /* ── Events ── */
  function setFilter(patch) {
    Object.assign(state.filters, patch);
    renderExplore();
    if (state.mapInit) syncMap(!!patch.city);
    refreshFilterCount();
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-tab]');
    if (t && t.classList.contains('tab')) { showTab(t.dataset.tab); return; }
    var go = e.target.closest('[data-tab-go]'); if (go) { showTab(go.dataset.tabGo); return; }

    var city = e.target.closest('[data-city]');
    if (city) {
      var name = city.dataset.city;
      state.filters.city = name; Store.set('city', name);
      if (name !== 'all' && state.filters.sort === 'distance' && !state.userPos) state.filters.sort = 'smart';
      setFilter({ city: name });
      if (state.tab === 'play') renderPlay();
      if (state.tab === 'map') { var cc = CITY_BY_NAME[name]; if (cc) AppMap.setView(cc.lat, cc.lng, cc.zoom); else AppMap.fitRows(state.rows); }
      return;
    }
    var q = e.target.closest('[data-q]'); if (q) { var k = q.dataset.q; var p = {}; p[k] = !state.filters[k]; setFilter(p); return; }
    var st = e.target.closest('[data-setting]'); if (st) { setFilter({ setting: state.filters.setting === st.dataset.setting ? 'any' : st.dataset.setting }); return; }
    if (e.target.closest('[data-filters]')) { filtersSheet(); return; }
    if (e.target.closest('[data-reset]')) {
      var keepCity = state.filters.city, keepSort = state.userPos ? state.filters.sort : 'smart';
      state.filters = Filters.defaultState(); state.filters.city = keepCity; state.filters.sort = keepSort;
      $('#q').value = ''; $('#q-clear').classList.remove('show');
      renderExplore(); if (state.mapInit) syncMap();
      if (state.sheet && state.sheet.kind === 'filters') { closeSheet(); filtersSheet(); }
      return;
    }

    var fav = e.target.closest('[data-fav]');
    if (fav) {
      e.preventDefault();
      var on = Store.toggleFavorite(fav.dataset.fav);
      fav.classList.toggle('on', on);
      if (fav.dataset.favAct) fav.innerHTML = I.heart + (on ? 'Saved' : 'Save');
      $$('[data-fav="' + fav.dataset.fav + '"]').forEach(function (b) { b.classList.toggle('on', on); });
      toast(on ? 'Saved ❤️' : 'Removed from saved');
      updateTabCounts();
      if (state.tab === 'saved') renderSaved();
      return;
    }
    var open = e.target.closest('[data-open]'); if (open) { courtSheet(open.dataset.open); return; }
    var card = e.target.closest('.card');
    if (card && !e.target.closest('a, button')) { courtSheet(card.dataset.id); return; }

    var tap = e.target.closest('[data-tap]'); if (tap) { Store.countTap(tap.dataset.tap); /* let the link proceed */ }
    var sh = e.target.closest('[data-share]'); if (sh) { shareCourt(sh.dataset.share); return; }
    if (e.target.closest('[data-copy-draft]')) { copy(draftText()).then(function () { toast('Message copied. Now open the chat and paste.'); }); return; }
    var mg = e.target.closest('[data-map-go]'); if (mg) { var cm = COURT_BY_ID[mg.dataset.mapGo]; closeSheet(); showTab('map'); var tries = 0; (function wait() { if (state.mapInit) { AppMap.setView(cm.lat, cm.lng, 15); selectOnMap(Filters.enrich(cm, ctx())); } else if (tries++ < 100) setTimeout(wait, 100); })(); return; }
    var sug = e.target.closest('[data-suggest]');
    if (sug) {
      e.preventDefault(); var cs = COURT_BY_ID[sug.dataset.suggest]; closeSheet(); showTab('more'); morePanel('feedback');
      var ta = $('#fb-text'); if (ta) { ta.value = 'Edit for ' + cs.name + ' (' + cs.city + '): '; ta.focus(); }
      return;
    }
    var mgo = e.target.closest('[data-more-go]'); if (mgo) { e.preventDefault(); closeSheet(); showTab('more'); morePanel(mgo.dataset.moreGo); return; }
    if (e.target.closest('[data-close]')) { closeSheet(); return; }

    var more = e.target.closest('[data-more]');
    if (more) {
      var kind = more.dataset.more;
      if (kind === 'share') { shareApp(); return; }
      if (kind === 'reset') {
        /* Two taps instead of a dialog: dialogs are blocked on some hosts and easy to mis-tap. */
        var label = more.querySelector('.tx b');
        if (more.dataset.armed) {
          Store.reset(); applyTheme('auto'); state.filters = Filters.defaultState();
          toast('Cleared'); renderMore(); updateTabCounts();
        } else {
          more.dataset.armed = '1';
          if (label) label.textContent = 'Tap again to clear everything';
          setTimeout(function () { if (more.dataset.armed) { delete more.dataset.armed; if (label) label.textContent = 'Clear saved data'; } }, 4000);
        }
        return;
      }
      morePanel(kind); return;
    }
    var th = e.target.closest('[data-theme]'); if (th && th.closest('#theme-seg')) { Store.set('theme', th.dataset.theme); applyTheme(th.dataset.theme); $$('#theme-seg button').forEach(function (b) { b.classList.toggle('on', b === th); }); return; }
    if (e.target.closest('#ac-build')) { buildAddCourtMessage(); return; }
    if (e.target.closest('[data-install]')) { promptInstall(); return; }
    if (e.target.closest('[data-banner-x]')) { Store.set('installDismissed', Date.now()); if (isIOS()) Store.set('iosHintDismissed', 1); hideBanner(); return; }

    var oc = e.target.closest('[data-owner-copy]');
    if (oc) { copy(ownerText(oc)).then(function () { toast('Copied. Paste it to us on Messenger or email.'); }); return; }
    var om = e.target.closest('[data-owner-msg]'); if (om) { copy(ownerText(om)); toast('Message copied. Paste it in the chat.'); return; }
    var oe = e.target.closest('[data-owner-mail]'); if (oe) { oe.href = 'mailto:' + APP.ownerEmail + '?subject=' + encodeURIComponent('AsaKorte: court listing') + '&body=' + encodeURIComponent(ownerText(oe)); return; }

    /* filters sheet controls */
    var seg = e.target.closest('#f-setting button'); if (seg) { setFilter({ setting: seg.dataset.v }); $$('#f-setting button').forEach(function (b) { b.classList.toggle('on', b === seg); }); return; }
    var segc = e.target.closest('#f-courts button'); if (segc) { setFilter({ minCourts: Number(segc.dataset.v) }); $$('#f-courts button').forEach(function (b) { b.classList.toggle('on', b === segc); }); return; }
    var am = e.target.closest('#f-amen [data-a]');
    if (am) { var a = am.dataset.a, list = state.filters.amenities.slice(); var i = list.indexOf(a); if (i >= 0) list.splice(i, 1); else list.push(a); am.classList.toggle('on', i < 0); setFilter({ amenities: list }); return; }
  });

  function ownerText(el) {
    var from = el.dataset.from && $('#' + el.dataset.from);
    var t = from ? from.value.trim() : '';
    return t || el.dataset.ownerCopy || el.dataset.ownerMsg || el.dataset.ownerMail || '';
  }

  document.addEventListener('change', function (e) {
    var t = e.target.closest('[data-t]'); if (t) { var p = {}; p[t.dataset.t] = t.checked; setFilter(p); return; }
    if (e.target.id === 'sort') { setFilter({ sort: e.target.value }); return; }
    if (e.target.id === 'f-price') { var v = Number(e.target.value); setFilter({ maxPrice: v >= 500 ? null : v }); return; }
  });
  document.addEventListener('input', function (e) {
    if (e.target.id === 'q') {
      $('#q-clear').classList.toggle('show', !!e.target.value);
      clearTimeout(window.__qT); window.__qT = setTimeout(function () { setFilter({ query: e.target.value.trim() }); }, 120);
      return;
    }
    if (e.target.id === 'f-price') { var v = Number(e.target.value); $('#f-price-val').textContent = v >= 500 ? 'Any' : '₱' + v; return; }
    if (/^d-/.test(e.target.id)) updateDraftPreview();
  });
  $('#q-clear').addEventListener('click', function () { $('#q').value = ''; $('#q-clear').classList.remove('show'); setFilter({ query: '' }); $('#q').focus(); });
  $('#btn-locate').addEventListener('click', function () { locate(false); });
  $('#map-locate').addEventListener('click', function () { if (state.userPos && state.mapInit) { AppMap.setView(state.userPos.lat, state.userPos.lng, 13); AppMap.setMe(state.userPos); } else locate(true); });
  $('#btn-theme').addEventListener('click', cycleTheme);
  $('#btn-install').addEventListener('click', promptInstall);
  $('#brand-link').addEventListener('click', function (e) { e.preventDefault(); showTab('explore'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state.sheet) closeSheet(); });

  window.addEventListener('popstate', function (e) {
    if (state.sheet) { closeSheet({ fromPop: true }); return; }
    if (e.state && e.state.sheet === 'court' && e.state.id) courtSheet(e.state.id, { fromPop: true });
  });
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); state.deferredInstall = e;
    $('#btn-install').hidden = false;
    maybeShowInstallBanner();
  });
  window.addEventListener('appinstalled', function () { $('#btn-install').hidden = true; hideBanner(); toast('Installed. Dula ta! 🏓'); });

  /* Re-evaluate "open now" every minute so pills stay honest while the app is open. */
  setInterval(function () { if (state.tab === 'explore' && !state.sheet) renderList(); }, 60000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden && state.tab === 'explore') renderList(); });

  /* ── Boot ── */
  function boot() {
    applyTheme(Store.get('theme'));
    Store.set('visits', (Store.get('visits') || 0) + 1);
    var params = new URLSearchParams(location.search);
    var savedCity = Store.get('city');
    state.filters.city = params.get('city') && CITY_BY_NAME[params.get('city')] ? params.get('city') : (savedCity && (savedCity === 'all' || CITY_BY_NAME[savedCity]) ? savedCity : 'all');
    if (params.get('open') === '1') state.filters.openNow = true;
    var last = Store.get('lastPos');
    if (last && Date.now() - last.t < 6 * 3600000) { state.userPos = { lat: last.lat, lng: last.lng }; $('#btn-locate').classList.add('on'); $('#locate-note').textContent = 'Using your last location. Tap Near me to refresh.'; state.filters.sort = 'distance'; }
    var tab = params.get('tab');
    showTab(tab && $('#view-' + tab) ? tab : 'explore');
    var court = params.get('court') || '';
    if (!court && location.hash.length > 1) { try { court = decodeURIComponent(location.hash.slice(1)); } catch (e) { court = ''; } }
    if (court && COURT_BY_ID[court]) { history.replaceState({ sheet: 'court', id: court }, '', location.href); courtSheet(court, { fromPop: true }); }
    maybeShowInstallBanner();
  }
  boot();
})();
