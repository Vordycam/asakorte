/* Geo: distance maths and a small geolocation wrapper.
   Pure functions take explicit inputs so they can be unit tested in Node. */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.Geo = factory();
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var EARTH_KM = 6371.0088;

  function toRad(deg) { return deg * Math.PI / 180; }

  /* Great-circle distance in kilometres between two {lat,lng} points. */
  function distanceKm(a, b) {
    if (!a || !b || !isFinite(a.lat) || !isFinite(a.lng) || !isFinite(b.lat) || !isFinite(b.lng)) return NaN;
    var dLat = toRad(b.lat - a.lat);
    var dLng = toRad(b.lng - a.lng);
    var s = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(s)));
  }

  /* "850 m", "1.2 km", "14 km". Empty string when unknown. */
  function formatDistance(km) {
    if (!isFinite(km)) return '';
    if (km < 0.95) return Math.max(50, Math.round(km * 1000 / 50) * 50) + ' m';
    if (km < 10) return km.toFixed(1).replace(/\.0$/, '') + ' km';
    return Math.round(km) + ' km';
  }

  /* Rough bounding box check used to pre-filter before the trig. */
  function withinBox(point, center, km) {
    var dLat = km / 111;
    var dLng = km / (111 * Math.cos(toRad(center.lat)) || 1);
    return Math.abs(point.lat - center.lat) <= dLat && Math.abs(point.lng - center.lng) <= dLng;
  }

  /* Promise wrapper over navigator.geolocation with a friendly error string. */
  function locate(opts) {
    opts = opts || {};
    return new Promise(function (resolve, reject) {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        reject(new Error('Location is not supported on this device.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(function (pos) {
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
      }, function (err) {
        var msg = 'Could not get your location.';
        if (err && err.code === 1) msg = 'Location permission was denied. You can still pick a city.';
        else if (err && err.code === 2) msg = 'Location unavailable right now. Try again outdoors or pick a city.';
        else if (err && err.code === 3) msg = 'Location timed out. Pick a city instead.';
        reject(new Error(msg));
      }, { enableHighAccuracy: false, timeout: opts.timeout || 10000, maximumAge: opts.maximumAge || 120000 });
    });
  }

  return { distanceKm: distanceKm, formatDistance: formatDistance, withinBox: withinBox, locate: locate };
});
