/* Prints the court list to paste into the Google Form's "Which court?" dropdown.
   node tools/form-options.js            -> "Name (City)" per line, grouped by city
   node tools/form-options.js --verified -> only verified courts (a good pilot list) */
'use strict';
const path = require('path');
const COURTS = require(path.join(__dirname, '..', 'js', 'data', 'courts.js'));
const onlyVerified = process.argv.includes('--verified');
const list = COURTS.filter(c => !onlyVerified || c.verified)
  .sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name));
list.forEach(c => console.log(c.name + ' (' + c.city + ')'));
console.error('\n' + list.length + ' options. Paste the lines above as the dropdown choices.');
