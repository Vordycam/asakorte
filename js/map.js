/* Map: Leaflet + OpenStreetMap tiles, loaded only when the Map tab is first opened
   so the first paint stays light on a prepaid connection. No API key needed.
   Tile usage follows the OSM tile policy: tiles are fetched only for what the
   user is looking at, with attribution shown. For heavy traffic switch TILE_URL
   to a keyed provider (see README). */
(function () {
  'use strict';

  /* Vendored copy of Leaflet 1.9.4 (vendor/leaflet) so the map shell works offline
     and on hosts that block third-party stylesheets. */
  var LEAFLET_CSS = 'vendor/leaflet/leaflet.css';
  var LEAFLET_JS = 'vendor/leaflet/leaflet.js';
  var TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  var TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  var MINDANAO = { lat: 7.9, lng: 124.6, zoom: 7 };

  var map = null, markerLayer = null, meMarker = null, loading = null, onSelect = null;

  function load() {
    if (window.L) return Promise.resolve(window.L);
    if (loading) return loading;
    loading = new Promise(function (resolve, reject) {
      if (!document.querySelector('link[data-leaflet]')) {
        var css = document.createElement('link');
        css.rel = 'stylesheet'; css.href = LEAFLET_CSS; css.setAttribute('data-leaflet', '1');
        document.head.appendChild(css);
      }
      var s = document.createElement('script');
      s.src = LEAFLET_JS; s.async = true;
      var timer = setTimeout(function () { reject(new Error('Map took too long to load.')); }, 20000);
      s.onload = function () { clearTimeout(timer); window.L ? resolve(window.L) : reject(new Error('Map library missing.')); };
      s.onerror = function () { clearTimeout(timer); loading = null; reject(new Error('Could not load the map. Check your connection.')); };
      document.head.appendChild(s);
    });
    return loading;
  }

  function init(el, selectHandler, opts) {
    if (map) return map;
    var L = window.L;
    opts = opts || {};
    onSelect = selectHandler;
    map = L.map(el, { zoomControl: false, attributionControl: true, tap: true })
      .setView([MINDANAO.lat, MINDANAO.lng], MINDANAO.zoom);
    var tiles = L.tileLayer(TILE_URL, { maxZoom: 19, attribution: TILE_ATTR, crossOrigin: true }).addTo(map);
    /* If the first tiles all fail (offline, or a host that blocks outside images),
       tell the page so it can explain instead of showing a blank grey map. */
    var okCount = 0, errCount = 0, warned = false;
    tiles.on('tileload', function () { okCount++; });
    tiles.on('tileerror', function () {
      errCount++;
      if (!warned && okCount === 0 && errCount >= 4 && typeof opts.onTilesBlocked === 'function') { warned = true; opts.onTilesBlocked(); }
    });
    L.control.zoom({ position: 'bottomleft' }).addTo(map);
    markerLayer = L.layerGroup().addTo(map);
    return map;
  }

  function markerClass(row) {
    var c = 'marker';
    if (row.court.featured) c += ' featured';
    else if (row.status.open) c += ' open';
    else if (row.status.known) c += ' closed';
    return c;
  }

  function setMarkers(rows) {
    if (!map) return;
    var L = window.L;
    markerLayer.clearLayers();
    rows.forEach(function (row) {
      var c = row.court;
      if (!isFinite(c.lat) || !isFinite(c.lng)) return;
      var icon = L.divIcon({ className: '', html: '<div class="' + markerClass(row) + '" title="' + String(c.name).replace(/"/g, '&quot;') + '"></div>', iconSize: [30, 30], iconAnchor: [15, 30] });
      var m = L.marker([c.lat, c.lng], { icon: icon, keyboard: true, title: c.name });
      m.on('click', function () { if (onSelect) onSelect(row); });
      markerLayer.addLayer(m);
    });
  }

  function fitRows(rows, opts) {
    if (!map) return;
    var pts = rows.filter(function (r) { return isFinite(r.court.lat) && isFinite(r.court.lng); })
      .map(function (r) { return [r.court.lat, r.court.lng]; });
    if (!pts.length) { map.setView([MINDANAO.lat, MINDANAO.lng], MINDANAO.zoom); return; }
    if (pts.length === 1) { map.setView(pts[0], 14); return; }
    map.fitBounds(pts, Object.assign({ padding: [40, 40], maxZoom: 14 }, opts || {}));
  }

  function setView(lat, lng, zoom) { if (map) map.setView([lat, lng], zoom || 13); }

  function setMe(pos) {
    if (!map || !pos) return;
    var L = window.L;
    if (meMarker) meMarker.remove();
    meMarker = L.marker([pos.lat, pos.lng], {
      icon: L.divIcon({ className: '', html: '<div class="marker me" title="You are here"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }),
      interactive: false, zIndexOffset: 1000
    }).addTo(map);
  }

  function invalidate() { if (map) setTimeout(function () { map.invalidateSize(); }, 50); }
  function ready() { return !!map; }

  window.AppMap = { load: load, init: init, setMarkers: setMarkers, fitRows: fitRows, setView: setView, setMe: setMe, invalidate: invalidate, ready: ready };
})();
