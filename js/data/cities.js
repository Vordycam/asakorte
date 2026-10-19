/* Cities: the Mindanao hubs the app knows about, with map centres.
   `region` groups the city chips; `zoom` is the map zoom when a city is picked.
   Add a city here and it appears in the chips as soon as a court lists it. */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.CITIES = factory();
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  return [
    { name: 'Davao City',       short: 'Davao',     region: 'Davao',      lat: 7.0731, lng: 125.6128, zoom: 12 },
    { name: 'Tagum',            short: 'Tagum',     region: 'Davao',      lat: 7.4478, lng: 125.8078, zoom: 13 },
    { name: 'Panabo',           short: 'Panabo',    region: 'Davao',      lat: 7.3081, lng: 125.6841, zoom: 13 },
    { name: 'Digos',            short: 'Digos',     region: 'Davao',      lat: 6.7497, lng: 125.3572, zoom: 13 },
    { name: 'Samal',            short: 'Samal',     region: 'Davao',      lat: 7.0731, lng: 125.7086, zoom: 12 },
    { name: 'Mati',             short: 'Mati',      region: 'Davao',      lat: 6.9550, lng: 126.2167, zoom: 13 },
    { name: 'Cagayan de Oro',   short: 'CDO',       region: 'Northern',   lat: 8.4542, lng: 124.6319, zoom: 12 },
    { name: 'Opol',             short: 'Opol',      region: 'Northern',   lat: 8.5219, lng: 124.5747, zoom: 13 },
    { name: 'El Salvador',      short: 'El Salvador', region: 'Northern', lat: 8.5634, lng: 124.5226, zoom: 13 },
    { name: 'Tagoloan',         short: 'Tagoloan',  region: 'Northern',   lat: 8.5386, lng: 124.7536, zoom: 13 },
    { name: 'Jasaan',           short: 'Jasaan',    region: 'Northern',   lat: 8.6525, lng: 124.7549, zoom: 13 },
    { name: 'Manolo Fortich',   short: 'Manolo F.', region: 'Northern',   lat: 8.3686, lng: 124.8644, zoom: 12 },
    { name: 'Iligan',           short: 'Iligan',    region: 'Northern',   lat: 8.2280, lng: 124.2452, zoom: 13 },
    { name: 'Malaybalay',       short: 'Malaybalay',region: 'Northern',   lat: 8.1575, lng: 125.1278, zoom: 13 },
    { name: 'Valencia',         short: 'Valencia',  region: 'Northern',   lat: 7.9064, lng: 125.0943, zoom: 13 },
    { name: 'Gingoog',          short: 'Gingoog',   region: 'Northern',   lat: 8.8254, lng: 125.0972, zoom: 13 },
    { name: 'Ozamiz',           short: 'Ozamiz',    region: 'Northern',   lat: 8.1481, lng: 123.8405, zoom: 13 },
    { name: 'General Santos',   short: 'GenSan',    region: 'SOCCSKSARGEN', lat: 6.1164, lng: 125.1716, zoom: 12 },
    { name: 'Koronadal',        short: 'Koronadal', region: 'SOCCSKSARGEN', lat: 6.5031, lng: 124.8469, zoom: 13 },
    { name: 'Polomolok',        short: 'Polomolok', region: 'SOCCSKSARGEN', lat: 6.2186, lng: 125.0636, zoom: 13 },
    { name: 'Kidapawan',        short: 'Kidapawan', region: 'SOCCSKSARGEN', lat: 7.0083, lng: 125.0894, zoom: 13 },
    { name: 'Tacurong',         short: 'Tacurong',  region: 'SOCCSKSARGEN', lat: 6.6925, lng: 124.6764, zoom: 13 },
    { name: 'Cotabato City',    short: 'Cotabato',  region: 'BARMM',      lat: 7.2236, lng: 124.2464, zoom: 13 },
    { name: 'Marawi',           short: 'Marawi',    region: 'BARMM',      lat: 8.0000, lng: 124.2900, zoom: 13 },
    { name: 'Zamboanga City',   short: 'Zamboanga', region: 'Zamboanga',  lat: 6.9214, lng: 122.0790, zoom: 12 },
    { name: 'Pagadian',         short: 'Pagadian',  region: 'Zamboanga',  lat: 7.8257, lng: 123.4370, zoom: 13 },
    { name: 'Dipolog',          short: 'Dipolog',   region: 'Zamboanga',  lat: 8.5880, lng: 123.3410, zoom: 13 },
    { name: 'Ipil',             short: 'Ipil',      region: 'Zamboanga',  lat: 7.7833, lng: 122.5865, zoom: 13 },
    { name: 'Butuan',           short: 'Butuan',    region: 'Caraga',     lat: 8.9475, lng: 125.5406, zoom: 13 },
    { name: 'Surigao City',     short: 'Surigao',   region: 'Caraga',     lat: 9.7838, lng: 125.4889, zoom: 13 },
    { name: 'Bislig',           short: 'Bislig',    region: 'Caraga',     lat: 8.2131, lng: 126.3164, zoom: 13 },
    { name: 'Tandag',           short: 'Tandag',    region: 'Caraga',     lat: 9.0786, lng: 126.1986, zoom: 13 }
  ];
});
