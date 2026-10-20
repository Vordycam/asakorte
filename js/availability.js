/* Availability (browser side): fetches the published Google Sheet CSV, keeps the
   last copy on the phone for offline use, refreshes on a timer and when the app
   comes back to the foreground, and tells the app when something changed.
   Dormant unless configured with a csvUrl. */
(function () {
  'use strict';

  var KEY = 'asakorte-avail-v1';
  var cfg = null, listeners = [], timer = null;
  var state = { csv: '', fetchedAt: 0, error: '', loading: false };

  function configure(c) { cfg = Object.assign({ refreshMinutes: 3, maxAgeHours: 6, defaultValidHours: 3, tzOffset: '+08:00' }, c || {}); }
  function enabled() { return !!(cfg && cfg.csvUrl); }
  function onChange(fn) { listeners.push(fn); }
  function notify() { listeners.forEach(function (fn) { try { fn(state); } catch (e) {} }); }

  function loadCache() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (data && typeof data.csv === 'string') { state.csv = data.csv; state.fetchedAt = data.fetchedAt || 0; }
    } catch (e) {}
  }
  function saveCache() {
    try { localStorage.setItem(KEY, JSON.stringify({ csv: state.csv, fetchedAt: state.fetchedAt })); } catch (e) {}
  }

  function refresh(force) {
    if (!enabled() || state.loading) return Promise.resolve();
    if (!force && Date.now() - state.fetchedAt < 45000) return Promise.resolve();
    state.loading = true;
    var url = cfg.csvUrl + (cfg.csvUrl.indexOf('?') >= 0 ? '&' : '?') + '_=' + Date.now();
    return fetch(url, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    }).then(function (text) {
      state.csv = text; state.fetchedAt = Date.now(); state.error = ''; state.loading = false;
      saveCache(); notify();
    }).catch(function (err) {
      state.error = err && err.message ? err.message : 'fetch failed'; state.loading = false;
      notify();
    });
  }

  /* Live reports keyed by court id, evaluated at `now`. */
  function reports(courts, now) {
    if (!enabled() || !state.csv) return {};
    return window.AvailabilityCore.parseReports(state.csv, courts, now || new Date(), cfg).byId;
  }
  function all(courts, now) {
    if (!enabled() || !state.csv) return [];
    return window.AvailabilityCore.parseReports(state.csv, courts, now || new Date(), cfg).all;
  }

  /* The form venues use, with their court preselected when the entry id is known. */
  function formLink(court) {
    if (!cfg || !cfg.formUrl) return '';
    if (!court || !cfg.formVenueEntry) return cfg.formUrl;
    var sep = cfg.formUrl.indexOf('?') >= 0 ? '&' : '?';
    return cfg.formUrl + sep + 'usp=pp_url&' + encodeURIComponent(cfg.formVenueEntry) + '=' + encodeURIComponent(court.name);
  }

  function start() {
    if (!enabled()) return;
    loadCache();
    if (state.csv) notify();
    refresh(true);
    clearInterval(timer);
    timer = setInterval(function () { if (!document.hidden) refresh(false); }, Math.max(1, cfg.refreshMinutes) * 60000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) refresh(false); });
  }

  window.Availability = { configure: configure, enabled: enabled, start: start, refresh: refresh, reports: reports, all: all, formLink: formLink, onChange: onChange, state: function () { return state; } };
})();
