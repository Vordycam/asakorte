/* Storage: on-device preferences via localStorage. Nothing leaves the phone.
   Keys are namespaced so this app never collides with others on the same origin. */
(function () {
  'use strict';

  var KEY = 'asakorte-v1';

  function defaults() {
    return {
      version: 1,
      favorites: [],        /* court ids */
      recent: [],           /* court ids, most recent first, max 10 */
      city: 'all',          /* last chosen city chip */
      theme: 'auto',        /* auto | light | dark */
      visits: 0,            /* for the install hint timing */
      installDismissed: 0,  /* timestamp */
      iosHintDismissed: 0,
      lastPos: null,        /* {lat,lng,t} */
      contactTaps: {},      /* courtId -> count, to show "popular" later */
      bookingDraft: null    /* {date,time,hours,players,name} for the copy-message helper */
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      var data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return defaults();
      return Object.assign(defaults(), data);
    } catch (e) {
      return defaults();
    }
  }

  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); return true; }
    catch (e) { return false; }
  }

  var state = load();

  function get(k) { return state[k]; }
  function set(k, v) { state[k] = v; save(state); return v; }
  function update(fn) { fn(state); save(state); return state; }

  function toggleFavorite(id) {
    var i = state.favorites.indexOf(id);
    if (i >= 0) state.favorites.splice(i, 1); else state.favorites.unshift(id);
    save(state);
    return i < 0;
  }
  function isFavorite(id) { return state.favorites.indexOf(id) >= 0; }

  function touchRecent(id) {
    state.recent = [id].concat(state.recent.filter(function (x) { return x !== id; })).slice(0, 10);
    save(state);
  }

  function countTap(id) {
    state.contactTaps[id] = (state.contactTaps[id] || 0) + 1;
    save(state);
  }

  function reset() { state = defaults(); save(state); }

  window.Store = {
    get: get, set: set, update: update, reset: reset,
    toggleFavorite: toggleFavorite, isFavorite: isFavorite,
    touchRecent: touchRecent, countTap: countTap,
    all: function () { return state; }
  };
})();
