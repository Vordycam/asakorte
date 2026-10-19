/* ============================================================================
   COURTS — the venue list. This is the only file you edit to add or fix a court.

   Add a new court by copying the TEMPLATE below into the array. Then run
   `node tools/check-data.js` to catch typos before you publish.

   TEMPLATE (delete the fields you do not know; the app handles missing data):
   {
     id: 'davao-my-court',                 // unique, lowercase, letters-numbers-dashes. Used in share links.
     name: 'My Court Name',
     city: 'Davao City',                   // must match a name in js/data/cities.js
     area: 'Matina',                       // barangay or district
     address: 'Street, landmark',          // shown on the detail sheet
     lat: 7.0731, lng: 125.6128,           // Google Maps: right-click the spot > copy the numbers
     indoor: true,                         // true = covered or indoor
     aircon: false,
     courts: 4,
     surface: 'Acrylic hard court',        // free text
     lights: true,
     nets: 'permanent',                    // permanent | portable
     lines: 'permanent',                   // permanent | taped | shared (shared = painted on a basketball/tennis court)
     hours: { daily: '06:00-22:00' },      // or { weekdays: '6am-10pm', weekends: '7am-9pm' }, { mon: '...', sun: 'closed' }, or '24h'
     price: { perHour: 300, peakPerHour: 365, peakNote: 'after 4 PM', perHead: 100, free: false, note: '' },
     openPlay: [ { day: 'tue', start: '18:00', end: '21:00', fee: 100, level: 'All levels', note: '' } ],
                                           // day can be 'tue', ['mon','wed'], 'daily', 'weekdays', 'weekends'
     booking: {
       preferred: 'messenger',             // which button goes first: web | messenger | viber | call | facebook
       facebook: 'https://www.facebook.com/YourPage',   // <-- paste the Facebook page link here
       messenger: '',                      // optional m.me link if different from the page
       viber: '', phone: '0917 123 4567', whatsapp: '',
       url: '', urlLabel: 'Book on PickleHub',          // <-- paste a booking site link here
       reservation: 'recommended',         // required | recommended | walk-in
       notes: 'Book a day ahead. 50% deposit via GCash.'
     },
     payments: ['gcash', 'maya', 'cash'],
     amenities: ['parking', 'restroom', 'shower', 'paddle-rental', 'ball-sales', 'water', 'aircon', 'pro-shop', 'coaching', 'cafe', 'wifi', 'lockers', 'seating'],
     busy: 'Weeknights 6–9 PM',            // free text, shown as "Usually busy"
     photo: '',                            // optional image URL (keep it small)
     tags: ['beginner-friendly', 'tournaments'],
     rating: 4.6, reviews: 23,             // optional
     verified: '2026-10-14',               // the date YOU last confirmed this listing
     source: 'Owner',                      // where the info came from
     featured: false,                      // paid placement: shows first with a highlight
     claimed: false,                       // true once the owner has claimed the listing
     pinApprox: false,                     // true if lat/lng is a guess
     notes: 'House rules, parking tips, etc.'
   }

   SEED DATA NOTE: the entries below were compiled on 2026-10-14 from public
   directories (Pickleheads, picklehub.ph, courtogo.com, venue Facebook pages).
   None of them has `verified` set, so the app labels them "from public
   listings" until you confirm each one and add the date. Fix anything wrong.
   ============================================================================ */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.COURTS = factory();
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  var SRC = 'Pickleheads / picklehub.ph, Oct 2026';
  var SRC2 = 'metrocdodev.com, dinkbook.app, Pickleheads, Oct 2026';
  return [

    /* ───────────────────────── DAVAO CITY ───────────────────────── */
    {
      id: 'davao-dink-spot', name: 'Dink Spot Davao', city: 'Davao City', area: 'Panacan, Buhangin',
      address: 'Km 13 Panacan Avenue, Buhangin', lat: 7.1439, lng: 125.6610,
      indoor: false, courts: 7, lights: true, nets: 'permanent', lines: 'permanent',
      hours: { daily: '07:00-02:00' },
      price: { perHour: 200, peakPerHour: 350, peakNote: '4 PM – 2 AM' },
      booking: { preferred: 'web', url: 'https://picklehub.ph/dink-spot', urlLabel: 'Book on PickleHub', facebook: 'https://www.facebook.com/profile.php?id=61577470252473', phone: '0915 189 8220', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom', 'lights', 'seating'],
      busy: 'Weeknights after 5 PM', tags: ['late-night'], source: SRC
    },
    {
      id: 'davao-da-hub', name: 'Da-Hub Paddle Court', city: 'Davao City', area: 'Buhangin',
      address: 'C.P. Garcia Highway, Buhangin', lat: 7.1386, lng: 125.6491,
      indoor: false, courts: 4, lights: true,
      price: { perHour: 150 },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=61588576111993', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], tags: ['budget'], source: SRC
    },
    {
      id: 'davao-epicenter', name: 'Epicenter Pickleball', city: 'Davao City', area: 'Buhangin',
      address: 'Buhangin–Cabantian Road, beside Gaisano Citygate', lat: 7.1113, lng: 125.6126,
      indoor: true, courts: 4, lights: true, nets: 'permanent', lines: 'permanent',
      hours: { daily: '06:00-00:00' },
      price: { perHour: 315, peakPerHour: 365, peakNote: 'after 4 PM' },
      openPlay: [{ days: ['wed', 'fri'], start: '18:00', end: '22:00', fee: 245, level: 'All levels' }],
      booking: { preferred: 'web', url: 'https://picklehub.ph', urlLabel: 'Book on PickleHub', facebook: 'https://www.facebook.com/epicentercourtsdavao', phone: '0956 964 0611', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom', 'paddle-rental', 'cafe'], source: SRC
    },
    {
      id: 'davao-premier-court', name: 'Premier Court Davao', city: 'Davao City', area: 'Buhangin',
      address: 'NCCC Mall Buhangin, Mandug Road', lat: 7.1103, lng: 125.6118,
      indoor: true, aircon: true, courts: 3, lights: true,
      price: { perHour: 315 },
      booking: { preferred: 'web', url: 'https://premiercourtdavao.com', urlLabel: 'Book on their website', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['aircon', 'parking', 'restroom', 'cafe'], tags: ['aircon', 'mall'], source: SRC
    },
    {
      id: 'davao-pink-paddle', name: 'The Pink Paddle Club', city: 'Davao City', area: 'Bunawan',
      address: '3 Mudiang Road, Bunawan', lat: 7.1804, lng: 125.6329,
      indoor: true, courts: 6, lights: true,
      price: { perHour: 315 },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/p/The-Pink-Paddle-Club-61578669204930/', phone: '0960 831 3987', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom'], source: SRC
    },
    {
      id: 'davao-pickletown', name: 'PickleTown', city: 'Davao City', area: 'Bajada',
      address: 'Block 3 Carmelite Road, Bajada', lat: 7.1041, lng: 125.6241,
      indoor: true, courts: 10, lights: true,
      price: { perHour: 300, peakPerHour: 350, peakNote: 'peak hours' },
      booking: { preferred: 'web', url: 'https://app.court-access.com', urlLabel: 'Book on Court Access', facebook: 'https://www.facebook.com/pickletowndvo', phone: '0927 725 8015', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom', 'paddle-rental', 'cafe'], tags: ['big-venue'], source: SRC
    },
    {
      id: 'davao-azuela', name: 'Azuela Play Courts', city: 'Davao City', area: 'Lanang',
      address: '1 S Bay Road, Azuela Cove, Lanang', lat: 7.1010, lng: 125.6455,
      indoor: false, courts: 4, lights: true,
      price: { perHour: 315 },
      booking: { preferred: 'web', url: 'https://picklehub.ph', urlLabel: 'Book on PickleHub', phone: '0966 166 6263', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom', 'cafe'], tags: ['seaside'], source: SRC
    },
    {
      id: 'davao-oases', name: 'Oases Court', city: 'Davao City', area: 'Poblacion',
      address: 'Porras Street, Poblacion', lat: 7.0830, lng: 125.6164,
      indoor: true, courts: 2,
      price: { perHour: 265 },
      booking: { preferred: 'web', url: 'https://picklehub.ph', urlLabel: 'Book on PickleHub', phone: '0998 979 4573', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['restroom'], source: SRC
    },
    {
      id: 'davao-sps-pickle-trio', name: 'SPS Pickle Trio', city: 'Davao City', area: 'Poblacion',
      address: 'Datu Loho Street, Poblacion', lat: 7.0916, lng: 125.5894,
      indoor: false, courts: 3, lights: true,
      price: { perHour: 265 },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/p/SPS-Pickle-Trio-61566651227173/', url: 'https://picklehub.ph', urlLabel: 'Book on PickleHub', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], source: SRC
    },
    {
      id: 'davao-matchpoint', name: 'Matchpoint Pickleball Co.', city: 'Davao City', area: 'Poblacion',
      address: 'Domsat Road, Poblacion', lat: 7.0798, lng: 125.5982,
      indoor: true, courts: 10, lights: true,
      hours: { daily: '08:00-02:00' },
      price: { perHour: 315, peakPerHour: 365, peakNote: '5 PM – 5 AM' },
      booking: { preferred: 'web', url: 'https://picklehub.ph', urlLabel: 'Book on PickleHub', phone: '0977 460 9152', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom', 'cafe'], notes: '6 indoor and 4 outdoor courts. Runs late; confirm closing time with the venue.', tags: ['late-night'], source: SRC
    },
    {
      id: 'davao-croc-park', name: 'Croc Park Pickleball', city: 'Davao City', area: 'Riverfront, Talomo',
      address: 'Davao Riverfront, Diversion Road, Ma-a', lat: 7.0981, lng: 125.5964,
      indoor: false, courts: 8, lights: true,
      price: { perHour: 350 },
      openPlay: [{ day: 'wed', start: '15:00', end: '18:00', fee: 195, level: 'All levels' }],
      booking: { preferred: 'web', url: 'https://picklehub.ph/crocpark', urlLabel: 'Book on PickleHub', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom', 'cafe'], source: SRC
    },
    {
      id: 'davao-jacks-ridge', name: "Jack's Ridge Pickleball Courts", city: 'Davao City', area: 'Shrine Hills, Matina',
      address: 'Shrine Hills Road, Matina', lat: 7.0664, lng: 125.5824,
      indoor: false, courts: 3, lights: true,
      price: { note: 'Paid, ask for rates' },
      booking: { preferred: 'web', url: 'https://picklehub.ph', urlLabel: 'Book on PickleHub', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom', 'cafe'], tags: ['view'], source: SRC
    },
    {
      id: 'davao-sideout', name: 'SideOut Davao', city: 'Davao City', area: 'Talomo',
      address: 'Knight Alley Street, Talomo', lat: 7.0596, lng: 125.5529,
      indoor: true, courts: 3,
      price: { perHour: 215 },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/p/SideOut-Davao-61580604413898/', url: 'https://picklehub.ph', urlLabel: 'Book on PickleHub', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], notes: '2 indoor and 1 outdoor court.', source: SRC
    },
    {
      id: 'davao-paddle-republic', name: 'Paddle Republic Sports Center', city: 'Davao City', area: 'Matina Aplaya',
      address: 'Matina Aplaya Road', lat: 7.0439, lng: 125.5744,
      indoor: true, courts: 16, lights: true,
      hours: { weekdays: '09:00-00:00', weekends: '07:00-00:00' },
      price: { perHour: 265, peakPerHour: 465, peakNote: '3 PM – 2 AM' },
      booking: { preferred: 'web', url: 'https://picklehub.ph', urlLabel: 'Book on PickleHub', facebook: 'https://www.facebook.com/share/17x4sAmLeh/', phone: '0917 179 7601', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom', 'shower', 'paddle-rental', 'cafe', 'pro-shop'], tags: ['big-venue', 'tournaments'], source: SRC
    },
    {
      id: 'davao-mergrande', name: 'Mergrande Pickleball Court', city: 'Davao City', area: 'Bago Aplaya',
      address: 'Mergrande Ocean Resort, Bago Aplaya', lat: 7.0410, lng: 125.5302,
      indoor: false, courts: 8, lights: true,
      hours: { daily: '06:00-05:00' },
      price: { perHour: 250, peakPerHour: 350, peakNote: '5 PM – 5 AM' },
      booking: { preferred: 'web', url: 'https://picklehub.ph', urlLabel: 'Book on PickleHub', facebook: 'https://www.facebook.com/mergrandeoceanresort', phone: '0905 268 0535', reservation: 'required', notes: '12-hour cancellation rule; no cash refunds.' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom', 'shower', 'cafe'], tags: ['seaside', 'late-night'], source: SRC
    },
    {
      id: 'davao-dink-lab', name: 'Dink Lab', city: 'Davao City', area: 'Toril',
      address: 'Metavco Compound, Toril', lat: 7.0140, lng: 125.4961,
      indoor: true, courts: 12, lights: true,
      price: { perHour: 315 },
      booking: { preferred: 'web', url: 'https://picklehub.ph', urlLabel: 'Book on PickleHub', facebook: 'https://www.facebook.com/p/Dink-Lab-61589287402172/', phone: '0927 749 7690', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom', 'cafe'], tags: ['big-venue'], source: SRC
    },
    {
      id: 'davao-court-88', name: 'Court 88 Pickleball Club', city: 'Davao City', area: 'Lizada, Toril',
      address: 'Purok Tambacan, Lizada, Toril', lat: 6.9965, lng: 125.4930,
      indoor: true, courts: 8, lights: true,
      hours: { daily: '07:00-00:00' },
      price: { perHour: 315, peakPerHour: 365, peakNote: 'after 4 PM' },
      booking: { preferred: 'web', url: 'https://picklehub.ph/court-88', urlLabel: 'Book on PickleHub', facebook: 'https://www.facebook.com/profile.php?id=61589553901138', phone: '0917 539 9481', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom'], source: SRC
    },

    /* ───────────────────────── TAGUM ───────────────────────── */
    {
      id: 'tagum-paddle-point', name: 'Paddle Point Tagum', city: 'Tagum', area: 'Mabini Street',
      address: 'Door 6, Limcore Warehouse, Mabini Street', lat: 7.4474, lng: 125.7914,
      indoor: true, courts: 5, lights: true,
      hours: { daily: '08:00-00:00' },
      price: { perHour: 250, peakPerHour: 350, peakNote: 'after 5 PM' },
      openPlay: [{ day: 'daily', start: '08:00', end: '11:00', fee: 100, level: 'All levels', note: 'Morning open play' }],
      booking: { preferred: 'web', url: 'https://picklehub.ph', urlLabel: 'Book on PickleHub', facebook: 'https://www.facebook.com/p/Paddle-Point-Tagum-Pickleball-61578594496275/', phone: '0917 105 0277', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom'], source: SRC
    },
    {
      id: 'tagum-city-pickle-grounds', name: 'City Pickle Grounds', city: 'Tagum', area: 'City Hall',
      address: 'Tagum City Hall grounds, Ayala Avenue', lat: 7.4409, lng: 125.8265,
      indoor: false, courts: 6, lights: true,
      price: { note: 'Paid, ask for rates' },
      booking: { preferred: 'web', url: 'https://picklehub.ph', urlLabel: 'Book on PickleHub', reservation: 'recommended' },
      payments: ['cash'], amenities: ['parking'], source: SRC
    },
    {
      id: 'tagum-m-central', name: 'M Central Pickleball Club', city: 'Tagum', area: 'Dalisay Avenue',
      address: 'Doña Regina Dalisay Avenue', lat: 7.4569, lng: 125.8026,
      indoor: true, courts: 4,
      price: { perHour: 200, note: 'About ₱200/hr' },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/p/M-Central-Pickleball-Club-100077344475528/', phone: '0917 705 0011', url: 'https://picklehub.ph', urlLabel: 'Book on PickleHub', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], source: SRC
    },
    {
      id: 'tagum-picklezone', name: 'Picklezone Tagum', city: 'Tagum', area: 'Dela Cruz',
      address: 'Dela Cruz, Tagum City', lat: 7.4779, lng: 125.7980,
      indoor: true, courts: 3,
      price: { perHour: 250 },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=61584719222275', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: [], source: SRC
    },

    /* ───────────────────────── MATI ───────────────────────── */
    {
      id: 'mati-sp-indoor-court', name: 'SP Davao Oriental Indoor Court', city: 'Mati', area: 'Capitol',
      address: 'Sangguniang Panlalawigan office grounds', lat: 6.9459, lng: 126.2580,
      indoor: true, courts: 3, lights: true,
      price: { free: true },
      booking: { reservation: 'walk-in', notes: 'Community court run with the Banayan Pickleball Club. Walk in.' },
      payments: [], amenities: ['parking'], tags: ['public', 'free'], source: SRC
    },

    /* ───────────────────────── CAGAYAN DE ORO ───────────────────────── */
    {
      id: 'cdo-pcklpark', name: 'Pcklpark', city: 'Cagayan de Oro', area: 'Puntod',
      address: '106 Julio Pacana Street, Puntod', lat: 8.4936, lng: 124.6515,
      indoor: true, courts: 4, lights: true,
      price: { perHour: 350, note: 'Paddle rental ₱100' },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=61578189890182', phone: '0905 085 6790', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['paddle-rental', 'parking'], source: SRC2
    },
    {
      id: 'cdo-pickle-world-limketkai', name: 'Pickle World Limketkai', city: 'Cagayan de Oro', area: 'Limketkai Center, Lapasan',
      address: '2nd Level East Concourse, Limketkai Center', lat: 8.4816, lng: 124.6561,
      indoor: true, courts: 3, lights: true,
      price: { perHour: 415 },
      booking: { preferred: 'web', url: 'https://picklehub.ph', urlLabel: 'Book on PickleHub', facebook: 'https://www.facebook.com/pickleworldlimketkai', phone: '0956 283 2359', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom', 'cafe'], tags: ['mall'], source: SRC2
    },
    {
      id: 'cdo-pickle-point', name: 'Pickle Point', city: 'Cagayan de Oro', area: 'Bulua',
      address: 'Near Westbound Terminal, Bulua', lat: 8.5111, lng: 124.6260,
      indoor: true, courts: 8, lights: true,
      price: { perHour: 350 },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=61585949101874', phone: '0935 396 1543', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], notes: 'Listings disagree on the court count (5 to 8) and one says open 24 hours. Confirm with the venue.', source: SRC2
    },
    {
      id: 'cdo-xavier-sports', name: 'Xavier Sports & Country Club', city: 'Cagayan de Oro', area: 'Masterson Avenue',
      address: 'Masterson Avenue, Upper Balulang', lat: 8.4473, lng: 124.6221,
      indoor: true, courts: 10, lights: true,
      price: { perHour: 350 },
      booking: { preferred: 'call', facebook: 'https://www.facebook.com/xscci', phone: '0967 241 9262', reservation: 'required', notes: 'Club venue; call ahead for non-member access.' },
      payments: ['cash'], amenities: ['parking', 'restroom', 'shower', 'cafe'], notes: '6 outdoor and 4 indoor courts.', source: SRC2
    },
    {
      id: 'cdo-match-point', name: 'Match Point Sports Center', city: 'Cagayan de Oro', area: 'Balaos, Iponan',
      address: 'Balaos, Iponan', lat: 8.4947, lng: 124.5929,
      indoor: true, courts: 3,
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=61584447735739', phone: '0956 283 0458', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], source: SRC2
    },
    {
      id: 'cdo-sm-uptown', name: 'SM Uptown CDO Outdoor Court', city: 'Cagayan de Oro', area: 'Upper Carmen',
      address: 'SM City CDO Uptown grounds, Masterson Avenue', lat: 8.4553, lng: 124.6240,
      indoor: false, courts: 1,
      price: { free: true, note: 'Free as of listing' },
      booking: { reservation: 'walk-in' },
      payments: [], amenities: ['parking', 'restroom', 'cafe'], tags: ['free', 'mall'], notes: 'The paid roofdeck courts (Sky Play / SM Active Hub) are a separate listing.', source: SRC2
    },
    {
      id: 'cdo-sky-play-sm-uptown', name: 'Sky Play at SM Active Hub', city: 'Cagayan de Oro', area: 'Upper Carmen',
      address: 'Roofdeck, carpark building, SM City CDO Uptown', lat: 8.4558, lng: 124.6236,
      indoor: true, courts: 2,
      price: { perHour: 350 },
      booking: { preferred: 'facebook', facebook: 'https://www.facebook.com/smcitycdouptown', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom', 'cafe'], tags: ['mall'], source: SRC2
    },
    {
      id: 'cdo-middleton', name: 'Middleton Pickleball Club', city: 'Cagayan de Oro', area: 'Carmen',
      address: 'Lirio Street / Max Suniel Extension, at Middleton Apartelle', lat: 8.4839, lng: 124.6332,
      indoor: true, courts: 3, surface: 'Acrylic',
      price: { perHour: 350 },
      openPlay: [{ day: 'mon', start: '19:00', end: '22:00', fee: 200, level: 'All levels', note: 'CDO Pickleball Club · ₱160 for members' }],
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=61576799205719', phone: '0961 431 8522', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], source: SRC2
    },
    {
      id: 'cdo-country-village', name: 'Country Village Hotel – Rockwood Hall', city: 'Cagayan de Oro', area: 'Carmen',
      address: 'Villarin Street, Carmen', lat: 8.4828, lng: 124.6305,
      indoor: true, courts: 3,
      price: { perHour: 350, peakPerHour: 380, peakNote: 'peak' },
      booking: { preferred: 'web', url: 'https://picklevillage.rezerv.co', urlLabel: 'Book on Rezerv', facebook: 'https://www.facebook.com/countryvillagehotelcdo', phone: '0956 776 4501', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom', 'cafe'], notes: 'The hotel is also building Pickle Village (5 courts) in Biasong, Macasandig.', source: SRC2
    },
    {
      id: 'cdo-homecourt-bulua', name: 'Homecourt Bulua', city: 'Cagayan de Oro', area: 'Bulua',
      address: 'Saarenas Avenue, near Westbound Public Market', lat: 8.5084, lng: 124.6252,
      indoor: true, courts: 3,
      hours: { daily: '07:00-00:00' },
      price: { perHour: 300, peakPerHour: 400, peakNote: 'peak' },
      booking: { preferred: 'web', url: 'https://homecourtpickleballcdo.rezerv.co/timetable', urlLabel: 'Book on Rezerv', facebook: 'https://www.facebook.com/profile.php?id=61586628543525', phone: '0945 398 8184', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], notes: 'Home of the Oro Court-Side Crew daily "Paddle Stack" sessions.', verified: '2026-10-20', source: 'Links supplied by the app owner, Oct 2026'
    },
    {
      id: 'cdo-homecourt-downtown', name: 'Homecourt Downtown', city: 'Cagayan de Oro', area: 'Corrales Extension, Lapasan',
      address: 'Corrales Extension, beside LBC Warehouse', lat: 8.4830, lng: 124.6550, pinApprox: true,
      indoor: true,
      booking: { preferred: 'web', url: 'https://homecourtpickleballcdo.rezerv.co/timetable', urlLabel: 'Book on Rezerv', facebook: 'https://www.facebook.com/profile.php?id=61586628543525', phone: '0945 398 8184', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: [], source: SRC2
    },
    {
      id: 'cdo-paddle-play', name: 'Paddle Play Pickleball Courts', city: 'Cagayan de Oro', area: 'Kauswagan',
      address: 'St. Therese Street, Kauswagan', lat: 8.5076, lng: 124.6292,
      indoor: true, courts: 5, surface: 'Silica',
      price: { perHour: 350, peakPerHour: 400, peakNote: 'peak' },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=61590151291575', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], source: SRC2
    },
    {
      id: 'cdo-courtly', name: 'Courtly Pickleball CDO', city: 'Cagayan de Oro', area: 'Carmen',
      address: 'Mayor H. Avanceña – Gumamela Extension, Carmen', lat: 8.4860, lng: 124.6360, pinApprox: true,
      indoor: true, courts: 5, lights: true,
      hours: { daily: '06:00-00:00' },
      price: { perHour: 350, note: 'Courts 1–2 are ₱400' },
      booking: { preferred: 'web', url: 'https://courtogo.com/venues/courtly-pickleball-cdo', urlLabel: 'Book on Courtogo', facebook: 'https://www.facebook.com/profile.php?id=61589976539438', phone: '0977 357 6670', instagram: '@courtly.cdo', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], notes: 'Home of the Dink Different club.', source: SRC2
    },
    {
      id: 'cdo-dink-xcape', name: 'Dink XCape PickleHub', city: 'Cagayan de Oro', area: 'Camaman-an',
      address: 'Bontong, near AGT Petroleum, Camaman-an', lat: 8.4700, lng: 124.6600, pinApprox: true,
      indoor: true, courts: 3, lights: true,
      hours: { daily: '09:00-00:00' },
      price: { perHour: 350 },
      booking: { preferred: 'web', url: 'https://courtogo.com/venues/dink-xcape-picklehub', urlLabel: 'Book on Courtogo', facebook: 'https://www.facebook.com/profile.php?id=61570725689353', phone: '0926 042 3647', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], verified: '2026-10-20', source: 'Links supplied by the app owner, Oct 2026'
    },
    {
      id: 'cdo-002-pickle-courts', name: '0-0-2 Pickle Courts', city: 'Cagayan de Oro', area: 'Carmen',
      address: 'JV Seriña Street, across Madonna & Child Medical Center', lat: 8.4855, lng: 124.6395, pinApprox: true,
      indoor: true,
      hours: '24h',
      price: { perHour: 400 },
      booking: { preferred: 'web', url: 'https://0-0-2-pickle-courts.rezerv.co/', urlLabel: 'Book on Rezerv', facebook: 'https://www.facebook.com/profile.php?id=61570961877671', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: [], notes: '24/7 access. Home of the Zero-Zero-Two CDO club, evenings most days.', tags: ['late-night'], verified: '2026-10-20', source: 'Links supplied by the app owner, Oct 2026'
    },
    {
      id: 'cdo-dink-district', name: 'Dink District', city: 'Cagayan de Oro', area: 'Baloy, Tablon',
      address: 'Tablon Highway, beside Seaoil, Baloy', lat: 8.4703, lng: 124.7088,
      indoor: true, courts: 8, lights: true,
      hours: '24h',
      price: { perHour: 400, note: 'Training rooms ₱350' },
      booking: { preferred: 'web', url: 'https://courtogo.com/venues/dink-district', urlLabel: 'Book on Courtogo', facebook: 'https://www.facebook.com/profile.php?id=61590728906694', phone: '0955 461 7875', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'coaching'], notes: '8 courts plus 4 training rooms.', tags: ['big-venue', 'late-night'], verified: '2026-10-20', source: 'Links supplied by the app owner, Oct 2026'
    },
    {
      id: 'cdo-puerto-pickle-bay', name: 'Puerto Pickle Bay', city: 'Cagayan de Oro', area: 'Puerto',
      address: 'Sayre Highway, across Gaisano Puerto, beside MR.DIY', lat: 8.4990, lng: 124.7518,
      indoor: true, courts: 3,
      hours: { daily: '08:00-00:00' },
      price: { perHour: 250, peakPerHour: 350, peakNote: 'peak' },
      booking: { preferred: 'web', url: 'https://courtogo.com/venues/puerto-pickle-bay', urlLabel: 'Book on Courtogo', facebook: 'https://www.facebook.com/profile.php?id=61552401083145', phone: '0905 085 9343', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], source: SRC2
    },
    {
      id: 'cdo-fliqshot', name: 'Fliqshot Pickleball Courts', city: 'Cagayan de Oro', area: 'Lomboy, Indahag',
      address: 'Indahag Road, Lomboy', lat: 8.4316, lng: 124.6630,
      indoor: false, courts: 3, lights: true,
      hours: { daily: '05:00-00:00' },
      price: { perHour: 300, peakPerHour: 350, peakNote: 'peak' },
      booking: { preferred: 'web', url: 'https://fliqshot.ph', urlLabel: 'Book on fliqshot.ph', facebook: 'https://www.facebook.com/fliqshotPC', phone: '0965 956 4014', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], notes: '2 open courts and 1 covered court. Pickle Hero club plays here.', source: SRC2
    },
    {
      id: 'cdo-apovel', name: 'Apovel Pickleball Court', city: 'Cagayan de Oro', area: 'Bulua',
      address: 'Apovel Subdivision Plaza, Bulua', lat: 8.5120, lng: 124.6220, pinApprox: true,
      indoor: false, courts: 2,
      price: { perHour: 250 },
      booking: { preferred: 'web', url: 'https://apovelpickleball.rezerv.co', urlLabel: 'Book on Rezerv', facebook: 'https://www.facebook.com/SKBulua', phone: '0977 617 5125', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: [], tags: ['community'], source: SRC2
    },
    {
      id: 'cdo-bounz', name: 'BounZ Pickleball Hub', city: 'Cagayan de Oro', area: 'Gran Europa, Lumbia',
      address: 'Vista Place, Gran Europa, Lumbia', lat: 8.4233, lng: 124.6049,
      indoor: true, courts: 3,
      price: { perHead: 130, note: 'Open play ₱130 per player; court rates on request' },
      openPlay: [
        { days: ['mon', 'tue', 'fri'], start: '19:00', end: '22:00', fee: 130, level: 'All levels', note: 'Pickle Pals Club' },
        { day: 'sat', start: '16:00', end: '19:00', fee: 130, level: 'All levels', note: 'Pickle Pals Club' },
        { day: 'sun', start: '15:00', end: '18:00', fee: 130, level: 'All levels', note: 'Pickle Pals Club' }
      ],
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=61587640537995', phone: '0956 750 3853', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], source: SRC2
    },
    {
      id: 'cdo-pamilya-getaway', name: 'Pamilya Pickleball Getaway', city: 'Cagayan de Oro', area: 'Canitoan',
      address: 'Macapagal Drive, Zone 2, behind Familia Café', lat: 8.4752, lng: 124.5981,
      indoor: false, courts: 2,
      price: { perHour: 300 },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=61586981829241', phone: '0917 110 9014', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['cafe'], source: SRC2
    },
    {
      id: 'cdo-pikol', name: 'Pikol', city: 'Cagayan de Oro', area: 'Ecoverde, Indahag',
      address: 'Ecoverde, Indahag', lat: 8.4238, lng: 124.6718,
      indoor: true, courts: 2,
      price: { perHour: 300 },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/pikolcdo', phone: '0917 116 7671', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: [], notes: 'Opens 6 AM; closing time not listed.', source: SRC2
    },
    {
      id: 'cdo-champions-field', name: 'Champions Field Pickleball Center', city: 'Cagayan de Oro', area: 'Kauswagan',
      address: 'RN Pelaez Boulevard, near Geo Gas / FoodHaus crossing', lat: 8.5030, lng: 124.6320, pinApprox: true,
      indoor: true,
      price: { perHour: 400 },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/ChampionsFieldPickleballCenter', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], source: SRC2
    },
    {
      id: 'cdo-masters-venue', name: 'Masters Venue', city: 'Cagayan de Oro', area: 'Masterson Avenue, Upper Carmen',
      address: 'Masterson Avenue, behind Villa Tuna', lat: 8.4520, lng: 124.6240, pinApprox: true,
      indoor: true, courts: 3,
      price: { perHour: 350 },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=61579105186724', phone: '0968 488 5408', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], source: SRC2
    },
    {
      id: 'cdo-metro-square', name: 'Metro Square', city: 'Cagayan de Oro', area: 'Iponan',
      address: 'Zone 2, Iponan', lat: 8.4950, lng: 124.5930, pinApprox: true,
      indoor: true, courts: 3,
      price: { perHour: 350 },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/metrosquareiponan', phone: '0962 238 2089', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], notes: 'Multi-sport venue: badminton, table tennis and a gym too.', source: SRC2
    },
    {
      id: 'cdo-top-pick', name: 'Top Pick', city: 'Cagayan de Oro', area: 'Taguanao, Indahag',
      address: 'CDO Convention Center Access Road, before Nanuri International School', lat: 8.4400, lng: 124.6650, pinApprox: true,
      indoor: false, surface: 'Silica',
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=61590698939430', url: 'https://toppickcdo.com', urlLabel: 'Website', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['seating'], notes: 'Open-air courts with a view deck. Soft-opened September 2026; rates not published yet.', tags: ['view'], source: SRC2
    },
    {
      id: 'cdo-sports-zone-liceo', name: 'Sports Zone at Liceo Paseo del Rio', city: 'Cagayan de Oro', area: 'Rodelsa Circle, Carmen',
      address: '5th Floor, Liceo de Cagayan University Paseo del Rio campus', lat: 8.4707, lng: 124.6432,
      indoor: true, courts: 2, surface: 'Acrylic',
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=100064304431105', reservation: 'recommended' },
      payments: ['cash'], amenities: ['parking'], source: SRC2
    },
    {
      id: 'cdo-nobles', name: 'Nobles Pickle Court', city: 'Cagayan de Oro', area: 'Bulua',
      address: 'At the Total gas station, Bulua', lat: 8.5100, lng: 124.6180, pinApprox: true,
      indoor: false, courts: 2,
      price: { perHour: 300 },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=61570725417444', phone: '0917 706 2329', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], source: SRC2
    },
    {
      id: 'cdo-q-sports-club', name: 'Q Sports Club', city: 'Cagayan de Oro', area: 'Upper Canitoan',
      address: 'Zone 8, Upper Canitoan', lat: 8.4700, lng: 124.5950, pinApprox: true,
      indoor: true, courts: 2,
      price: { perHour: 300 },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=61578090382038', phone: '0997 518 0963', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: [], source: SRC2
    },
    {
      id: 'cdo-nazareth', name: 'Nazareth Barangay Court', city: 'Cagayan de Oro', area: 'Nazareth',
      address: 'Barangay Hall compound, Nazareth', lat: 8.4780, lng: 124.6500, pinApprox: true,
      indoor: false, courts: 2,
      price: { perHour: 200 },
      booking: { preferred: 'call', facebook: 'https://www.facebook.com/barangaynazarethcouncil', phone: '0906 798 3627', reservation: 'recommended' },
      payments: ['cash'], amenities: [], tags: ['community', 'budget'], source: SRC2
    },
    {
      id: 'cdo-rrc-bonbon', name: 'RRC Pickleball Court', city: 'Cagayan de Oro', area: 'Bonbon',
      address: 'Zone 6, near Villa Gracia Resort, Bonbon', lat: 8.5000, lng: 124.5700, pinApprox: true,
      indoor: false, courts: 2,
      price: { perHour: 250 },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=100095106373229', phone: '0915 986 4230', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: [], source: SRC2
    },
    {
      id: 'cdo-dink-and-drive', name: 'Dink and Drive Pickleball', city: 'Cagayan de Oro', area: 'Macasandig',
      address: 'Biasong–Tinib Road, Macasandig', lat: 8.4640, lng: 124.6410, pinApprox: true,
      indoor: true,
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=61586136975811', phone: '0994 145 6085', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: [], source: SRC2
    },
    {
      id: 'cdo-wallstreet', name: 'Wallstreet Pickleball', city: 'Cagayan de Oro', area: 'Macasandig',
      address: '168 Mandumol–Aluba–Buena Oro Road', lat: 8.4624, lng: 124.6432,
      indoor: true,
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=61582189890972', phone: '0956 927 7943', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: [], source: SRC2
    },
    {
      id: 'cdo-frontyard', name: 'Frontyard Pickleball & Typti Court', city: 'Cagayan de Oro', area: 'Tibasak, Macasandig',
      address: 'Upper Corona Drive, Tibasak', lat: 8.4600, lng: 124.6450, pinApprox: true,
      indoor: true,
      price: { perHour: 200, note: 'From ₱200' },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=61591294983690', phone: '0995 434 8199', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: [], tags: ['budget'], source: SRC2
    },
    {
      id: 'cdo-korte-dos', name: 'Korte Dos', city: 'Cagayan de Oro', area: 'Bayabas',
      address: 'Bayabas, Cagayan de Oro', lat: 8.5107, lng: 124.6388,
      indoor: true,
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/kortedos', phone: '0945 398 4516', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: [], source: SRC2
    },
    {
      id: 'cdo-camp-evangelista', name: 'Camp Evangelista – Montalvan Hall', city: 'Cagayan de Oro', area: 'Patag',
      address: 'CDO–Cadre Road, Camp Evangelista, Patag', lat: 8.4870, lng: 124.6100, pinApprox: true,
      indoor: true, courts: 5, lights: true,
      price: { perHead: 100, note: '₱100 civilians, ₱50 military per session' },
      openPlay: [{ day: 'thu', start: '18:00', end: '22:00', fee: 100, level: 'All levels', note: 'DPC Bangers' }],
      booking: { preferred: 'call', phone: '0926 666 6831', reservation: 'recommended', notes: 'Military camp: bring an ID.' },
      payments: ['gcash', 'cash'], amenities: ['parking'], tags: ['budget'], source: SRC2
    },
    {
      id: 'cdo-vesha-hall', name: 'Vesha Hall', city: 'Cagayan de Oro', area: 'Villa Ernesto, Gusa',
      address: 'Villa Ernesto Subdivision Phase 1, Gusa', lat: 8.4721, lng: 124.6877,
      indoor: true, courts: 1, lights: true, nets: 'portable', lines: 'taped',
      price: { free: true },
      booking: { preferred: 'call', phone: '0926 398 8213', reservation: 'walk-in' },
      payments: [], amenities: [], tags: ['free', 'community'], source: SRC2
    },
    {
      id: 'cdo-dula-lifestyle-hub', name: 'Dula Lifestyle Hub', city: 'Cagayan de Oro', area: 'SM Bypass Road, Upper Carmen',
      address: 'SM Bypass Road, across Steak Paraiso Uptown', lat: 8.4550, lng: 124.6280, pinApprox: true,
      indoor: true, courts: 5, lights: true,
      booking: { preferred: 'web', url: 'https://dulalifestylehub.rezerv.co', urlLabel: 'Book on Rezerv', facebook: 'https://www.facebook.com/DulaLifestyleHub', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], notes: '4 covered courts and 1 outdoor.', verified: '2026-10-20', source: 'Links supplied by the app owner, Oct 2026'
    },

    {
      id: 'cdo-breakpoint', name: 'Breakpoint Pickleball Courts', city: 'Cagayan de Oro', area: 'Lomboy, Indahag',
      address: 'Block 10A, Lomboy', lat: 8.4320, lng: 124.6640, pinApprox: true,
      indoor: true, courts: 3,
      hours: { daily: '06:00-23:00' },
      price: { perHour: 300, note: 'Some courts ₱350' },
      booking: { preferred: 'web', url: 'https://www.courtogo.com/venues/breakpoint-pickleball-courts-cdo', urlLabel: 'Book on Courtogo', facebook: 'https://www.facebook.com/breakpointpickleballcourtscdo', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], notes: 'Covered courts. "Where competition meets community."', verified: '2026-10-20', source: 'Links supplied by the app owner, Oct 2026'
    },
    {
      id: 'cdo-9000-sports-club', name: '9000 Sports Club', city: 'Cagayan de Oro', area: 'Location to confirm',
      address: 'Cagayan de Oro City', lat: 8.4542, lng: 124.6319, pinApprox: true,
      indoor: true,
      booking: { preferred: 'web', url: 'https://app.onda.fit/book/9000-sports-club', urlLabel: 'Book on Onda', facebook: 'https://www.facebook.com/9000sportsclub', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: [], notes: 'Address not published yet; the pin is the city centre until confirmed.', source: 'Links supplied by the app owner, Oct 2026'
    },
    {
      id: 'cdo-paddle-prime', name: 'Paddle Prime CDO', city: 'Cagayan de Oro', area: 'Apovel, Bulua',
      address: 'Beside the Phoenix gas station, Apovel, Bulua', lat: 8.5120, lng: 124.6210, pinApprox: true,
      indoor: true,
      booking: { preferred: 'web', url: 'https://paddleprimecdo.bookingdyno.com/', urlLabel: 'Book online', facebook: 'https://www.facebook.com/profile.php?id=61590892762020', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: [], notes: 'New in October 2026.', verified: '2026-10-20', source: 'Links supplied by the app owner, Oct 2026'
    },

    /* ───────────────────────── MISAMIS ORIENTAL TOWNS ───────────────────────── */
    {
      id: 'opol-west-side-ball-park', name: 'West Side Ball Park', city: 'Opol', area: 'Barra',
      address: 'Zone 5, Barra, Opol', lat: 8.5200, lng: 124.5750, pinApprox: true,
      indoor: false, courts: 3,
      price: { perHour: 200 },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=61551229020789', phone: '0917 149 3178', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], tags: ['budget'], source: SRC2
    },
    {
      id: 'tagoloan-sports-district', name: 'Tagoloan Sports District', city: 'Tagoloan', area: 'Poblacion',
      address: 'Del Rosario Street, Poblacion, Tagoloan', lat: 8.5400, lng: 124.7500, pinApprox: true,
      indoor: true,
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=61570996656111', phone: '0997 963 8474', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: [], notes: 'Also known as Pickleball Central PH; likely home of the Pickleball Central Social Club.', source: SRC2
    },
    {
      id: 'tagoloan-grey-kitchen', name: 'Grey Kitchen Pickleball Courts', city: 'Tagoloan', area: 'Casinglot',
      address: 'Simon Agribusiness Corporation compound, PHIVIDEC Industrial Estate, Casinglot', lat: 8.5259, lng: 124.7521,
      indoor: true, courts: 9,
      hours: { daily: '10:00-01:00' },
      price: { perHour: 300, peakPerHour: 400, peakNote: 'peak' },
      booking: { preferred: 'web', url: 'https://greykitchenpb.com', urlLabel: 'Book on their website', facebook: 'https://www.facebook.com/profile.php?id=61594226048284', phone: '0956 886 8988', reservation: 'required', notes: 'Bookings are final: no cancellations or rescheduling.' },
      payments: ['gcash', 'cash'], amenities: ['parking'], notes: 'Opened October 2026.', tags: ['big-venue', 'late-night'], verified: '2026-10-20', source: 'Links supplied by the app owner, Oct 2026'
    },
    {
      id: 'jasaan-town-plaza', name: 'Jasaan Town Plaza Courts', city: 'Jasaan', area: 'Poblacion',
      address: 'Municipal Plaza, Poblacion, Jasaan', lat: 8.6525, lng: 124.7549,
      indoor: false, courts: 2,
      price: { free: true },
      booking: { preferred: 'call', facebook: 'https://www.facebook.com/JasaanDinkers', phone: '0916 661 6845', reservation: 'walk-in' },
      payments: [], amenities: [], notes: '1 indoor and 1 outdoor court. Jasaan Dinkers club.', tags: ['free', 'community'], source: SRC2
    },
    {
      id: 'jasaan-sr-mall-net-club', name: 'SR Mall Net Club', city: 'Jasaan', area: 'Luz Banzon',
      address: 'SR Mall, Luz Banzon, Jasaan', lat: 8.6400, lng: 124.7600, pinApprox: true,
      indoor: true, aircon: true, courts: 2, lights: true,
      booking: { preferred: 'facebook', facebook: 'https://www.facebook.com/ShopAtSRMall', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom', 'aircon', 'cafe'], notes: 'Also called The Pckl Hub. Climate-controlled.', tags: ['mall', 'aircon'], source: SRC2
    },
    {
      id: 'el-salvador-pickleball-z', name: 'Pickleball Z Court', city: 'El Salvador', area: 'Cogon',
      address: 'Zone 3, Cogon, El Salvador City', lat: 8.5470, lng: 124.5058,
      indoor: false,
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=61589859012567', phone: '0917 770 6549', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: [], source: SRC2
    },

    /* ───────────────────────── ILIGAN ───────────────────────── */
    {
      id: 'iligan-dinkerz-den', name: 'Dinkerz Den', city: 'Iligan', area: 'Kiwalan',
      address: 'Kiwalan, Iligan City', lat: 8.2889, lng: 124.2838,
      indoor: false, courts: 1, lights: true,
      booking: { preferred: 'web', url: 'https://courtogo.com', urlLabel: 'Book on Courtogo', phone: '0917 803 0369', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: [], source: SRC
    },
    {
      id: 'iligan-miguel-sheker-park', name: 'Miguel Sheker Park Courts', city: 'Iligan', area: 'Poblacion',
      address: 'Miguel Sheker Park, Iligan City', lat: 8.2389, lng: 124.2489,
      indoor: false, courts: 4, lights: true,
      price: { free: true, note: 'Lights ₱120/hr, split among players' },
      booking: { reservation: 'walk-in', notes: 'Busiest in the late afternoon.' },
      payments: [], amenities: ['parking'], tags: ['public', 'free'], busy: 'Afternoons 4–7 PM', source: SRC
    },

    /* ───────────────────────── BUKIDNON ───────────────────────── */
    {
      id: 'malaybalay-juniors', name: "Junior's Pickleball Covered Courts", city: 'Malaybalay', area: 'Casisang',
      address: 'Casisang, Malaybalay City', lat: 8.1333, lng: 125.1291,
      indoor: true, courts: 2, lights: true,
      hours: { daily: '06:00-22:00' },
      price: { perHour: 200, peakPerHour: 250, peakNote: '5 PM – 10 PM' },
      booking: { preferred: 'web', url: 'https://juniorspickleball.picklecourt.ph', urlLabel: 'Book online', facebook: 'https://www.facebook.com/share/1BUepqydMf/', phone: '0948 969 4153', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], source: SRC
    },
    {
      id: 'manolo-fortich-pickle-site', name: 'The Pickle Site', city: 'Manolo Fortich', area: 'Sto. Niño',
      address: 'Barangay Sto. Niño, Manolo Fortich', lat: 8.3700, lng: 124.8600, pinApprox: true,
      indoor: true, courts: 2,
      hours: { daily: '06:00-00:00' },
      price: { perHour: 350 },
      booking: { preferred: 'call', phone: '0917 726 1688', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: [], source: SRC2
    },
    {
      id: 'manolo-fortich-dream-golftel', name: 'Dream Golftel Pickleball Court', city: 'Manolo Fortich', area: 'Camp Phillips',
      address: 'Dream Residences, across Del Monte Golf Course', lat: 8.3300, lng: 124.8800, pinApprox: true,
      indoor: false, courts: 1,
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/p/Dream-Golftel-100090045173411/', phone: '0917 135 9761', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], source: SRC2
    },

    /* ───────────────────────── GINGOOG ───────────────────────── */
    {
      id: 'gingoog-pickle-match', name: 'Pickle Match Court', city: 'Gingoog', area: 'Mercado Avenue',
      address: 'Mercado Avenue, Gingoog City', lat: 8.8146, lng: 125.1034,
      indoor: true, courts: 4, lights: true,
      booking: { preferred: 'web', url: 'https://picklematchgc.com', urlLabel: 'Book online', phone: '0997 844 2208', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], source: SRC
    },
    {
      id: 'gingoog-racquet-club', name: 'The Racquet Club', city: 'Gingoog', area: 'Guno Street',
      address: 'Guno Street, Gingoog City', lat: 8.8268, lng: 125.0986,
      indoor: true, courts: 2, lights: true, surface: 'Carpet',
      price: { perHour: 300, note: 'Members ₱250 plus ₱20 per guest' },
      booking: { reservation: 'recommended', notes: 'Facebook page not found yet; add it.' },
      payments: ['cash'], amenities: [], source: SRC2
    },
    {
      id: 'gingoog-ot-court', name: 'OT Court', city: 'Gingoog', area: 'Daan-Lungsod',
      address: 'Daan-Lungsod, Gingoog City', lat: 8.8378, lng: 125.1338,
      indoor: false, courts: 4, lights: true, nets: 'portable',
      price: { perHead: 50, note: '₱50 per play' },
      booking: { reservation: 'walk-in', notes: 'Facebook page not found yet; add it.' },
      payments: ['cash'], amenities: [], tags: ['budget'], source: SRC2
    },

    /* ───────────────────────── GENERAL SANTOS ───────────────────────── */
    {
      id: 'gensan-pickle-world', name: 'Pickle World GenSan Downtown', city: 'General Santos', area: 'Downtown',
      address: 'NCCC Compound, National Highway', lat: 6.1066, lng: 125.1501,
      indoor: true, courts: 13, lights: true,
      hours: { daily: '07:00-02:00' },
      price: { perHour: 310, peakPerHour: 360, peakNote: '4 PM – 2 AM' },
      booking: { preferred: 'web', url: 'https://picklehub.ph', urlLabel: 'Book on PickleHub', phone: '0956 283 1362', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom', 'cafe', 'paddle-rental'], tags: ['big-venue', 'late-night'], source: SRC
    },
    {
      id: 'gensan-third-shot', name: 'Third Shot Pickleground', city: 'General Santos', area: 'Arradaza Street',
      address: 'Arradaza Street, General Santos', lat: 6.1189, lng: 125.1971,
      indoor: true, courts: 5, lights: true,
      price: { perHour: 315 },
      booking: { preferred: 'web', url: 'https://picklehub.ph', urlLabel: 'Book on PickleHub', facebook: 'https://www.facebook.com/p/Third-Shot-Pickleground-Gensan-61587722303837/', phone: '0927 742 5286', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom'], source: SRC
    },
    {
      id: 'gensan-cabin-pickle-club', name: 'Cabin Pickle Club', city: 'General Santos', area: 'Apopong',
      address: 'The Cabin Brewery, Diversion Road, Apopong', lat: 6.1014, lng: 125.1056,
      indoor: true, courts: 8, lights: true,
      hours: { daily: '12:00-00:00' },
      price: { perHour: 300, peakPerHour: 325, peakNote: 'after 4 PM' },
      booking: { preferred: 'web', url: 'https://picklehub.ph', urlLabel: 'Book on PickleHub', instagram: '@thecabinpickleclub', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom', 'cafe'], notes: '6 indoor and 2 outdoor courts, beside a brewery.', tags: ['food'], source: SRC
    },
    {
      id: 'gensan-court-zero', name: 'Court Zero Racquet Club', city: 'General Santos', area: 'Sampaguita Street',
      address: 'Sampaguita Street, General Santos', lat: 6.1266, lng: 125.1678,
      indoor: false, courts: 3, lights: true,
      price: { perHour: 200 },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/p/Court-Zero-Racquet-Club-61583701796729/', url: 'https://picklehub.ph', urlLabel: 'Book on PickleHub', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], tags: ['budget'], source: SRC
    },

    /* ───────────────────────── KORONADAL ───────────────────────── */
    {
      id: 'koronadal-sox-pickleball', name: 'Sox Pickleball Grounds', city: 'Koronadal', area: 'Doña Lourdes Subdivision',
      address: 'Doña Lourdes Subdivision, Koronadal', lat: 6.5004, lng: 124.8433,
      indoor: false, courts: 3, lights: true,
      price: { note: 'Paid, ask for rates' },
      booking: { preferred: 'call', phone: '0939 920 8003', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], notes: '2 outdoor and 1 covered court.', source: SRC
    },
    {
      id: 'koronadal-smraa', name: 'SMRAA Sports Complex', city: 'Koronadal', area: 'Alunan Avenue',
      address: 'Alunan Avenue, Koronadal', lat: 6.4963, lng: 124.8400,
      indoor: false, courts: 4,
      price: { free: true },
      booking: { preferred: 'call', phone: '0995 376 7202', reservation: 'walk-in' },
      payments: [], amenities: ['parking', 'restroom'], tags: ['public', 'free'], source: SRC
    },

    /* ───────────────────────── KIDAPAWAN ───────────────────────── */
    {
      id: 'kidapawan-o2', name: 'O2 Pickleball Kidapawan', city: 'Kidapawan', area: 'Poblacion',
      address: 'Kidapawan City', lat: 7.0213, lng: 125.0902,
      indoor: true, courts: 7, lights: true,
      price: { perHour: 250 },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/p/O2-Pickleball-61580711736262/', url: 'https://picklehub.ph', urlLabel: 'Book on PickleHub', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], notes: '4 outdoor and 3 covered courts.', source: SRC
    },

    /* ───────────────────────── TACURONG ───────────────────────── */
    {
      id: 'tacurong-pickle-hub', name: 'The Pickle Hub Tacurong', city: 'Tacurong', area: 'Alunan Highway',
      address: 'Alunan Highway, Tacurong', lat: 6.6885, lng: 124.6786,
      indoor: true, courts: 5, lights: true,
      price: { note: 'Paid, ask for rates' },
      booking: { reservation: 'recommended', notes: 'Books through Facebook. Add the page link.' },
      payments: ['gcash', 'cash'], amenities: ['parking'], source: SRC
    },

    /* ───────────────────────── ZAMBOANGA ───────────────────────── */
    {
      id: 'zamboanga-dink-and-dunk', name: 'Dink & Dunk Sports Center', city: 'Zamboanga City', area: 'Tumaga',
      address: 'Tumaga–Putik Road', lat: 6.9392, lng: 122.0846,
      indoor: true, courts: 6, lights: true,
      price: { perHour: 300 },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/DinkDunkSC', phone: '0945 841 2948', url: 'https://picklehub.ph', urlLabel: 'Book on PickleHub', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom'], source: SRC
    },
    {
      id: 'ipil-dropshot', name: 'DropShot Pickle Hub', city: 'Ipil', area: 'Sanito',
      address: 'National Highway, Sanito, Ipil', lat: 7.7833, lng: 122.5865,
      indoor: false, courts: 3, lights: true,
      booking: { preferred: 'call', facebook: 'https://www.facebook.com/share/1H2RjiPcGk/', phone: '0997 721 7608', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: ['parking'], source: SRC
    },
    {
      id: 'dipolog-rgs-tennis', name: 'RGS Tennis Center', city: 'Dipolog', area: 'Lobing Ogis Road',
      address: 'Lobing Ogis Road, Dipolog', lat: 8.5512, lng: 123.3415,
      indoor: false, courts: 4, lights: true, lines: 'shared',
      price: { free: true, note: 'Court is free; lights are paid' },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/RGSTennisCenter', reservation: 'walk-in' },
      payments: ['cash'], amenities: ['parking'], tags: ['free'], source: SRC
    },
    {
      id: 'dipolog-pilot-school', name: 'Dipolog Pilot Demonstration School Court', city: 'Dipolog', area: 'Poblacion',
      address: 'Dipolog Pilot Demonstration School', lat: 8.5870, lng: 123.3426,
      indoor: true, courts: 3,
      price: { free: true },
      booking: { preferred: 'messenger', facebook: 'https://www.facebook.com/profile.php?id=61566514712525', phone: '0917 115 1834', reservation: 'walk-in' },
      payments: [], amenities: [], tags: ['public', 'free'], source: SRC
    },

    /* ───────────────────────── CARAGA ───────────────────────── */
    {
      id: 'surigao-river-sports-complex', name: 'Surigao River Sports Complex', city: 'Surigao City', area: 'Rizal',
      address: 'Maharlika Highway, Rizal', lat: 9.7842, lng: 125.4631,
      indoor: true, courts: 3, lights: true,
      price: { perHour: 350 },
      booking: { reservation: 'required', notes: 'Reservation needed. Add the venue contact.' },
      payments: ['gcash', 'cash'], amenities: ['parking', 'restroom'], source: SRC
    },
    {
      id: 'butuan-dinkaholics', name: 'Butuan Dinkaholics Court', city: 'Butuan', area: 'J. Rosales Avenue',
      address: 'Foodgate, J. Rosales Avenue', lat: 8.9578, lng: 125.5278,
      indoor: false, courts: 2, nets: 'portable', lines: 'taped',
      price: { free: true, note: 'Bring your own net' },
      booking: { preferred: 'facebook', facebook: 'https://www.facebook.com/groups/ButuanDinks', phone: '0928 375 4560', reservation: 'walk-in' },
      payments: [], amenities: ['cafe'], tags: ['public', 'free', 'community'], source: SRC
    },

    /* ───────────────────────── MARAWI ───────────────────────── */
    {
      id: 'marawi-ranaw', name: 'Ranaw Pickleball Club', city: 'Marawi', area: 'East Basak',
      address: 'East Basak, Marawi City', lat: 8.0000, lng: 124.2900, pinApprox: true,
      indoor: true, courts: 6,
      price: { perHour: 400 },
      booking: { preferred: 'web', url: 'https://courtogo.com/venues/ranaw-pickleball-club', urlLabel: 'Book on Courtogo', reservation: 'recommended' },
      payments: ['gcash', 'cash'], amenities: [], source: SRC
    }

    /* ───────────────────────── TO VERIFY BEFORE ADDING ─────────────────────────
       Found in listings but not confirmed, or with a map pin that looks wrong.
       Davao: The Dink Yard Society (Maa Bypass, 15 courts, fb.com/dinkyarddvo), Paddle Yard,
       Pickle Space, Paddle Bay, Durian Pickleball House, Prime Pickleball Davao, Davao Pickleyard,
       Pickle House, Summit Serve, Matina Town Square courts, Bangkus Pickle Zone (free, pin lands near Digos).
       Tagum: Rally Point. Panabo: Paddle House. Nabunturan: Pickle Power.
       CDO: Middleton Pickleball Club, Country Village Hotel. Koronadal: Paraiso Verde Hotel, South Cotabato Sports Complex.
       Tacurong: DPickleZone, Pickle At the Barn. Cotabato City: LMB Pickleball League (free; pin lands in Kidapawan), PMO Court.
       Kabacan: PickleBoy. Butuan: COA RO XIII (private). Marawi: Sultan Lala Maruhom Hub (free).
       Iligan: After Hours, Sweat Rally. Zamboanga: Curuan Gym (free), Wrong House. Isabela: PickleLob Basilan.
       Ozamiz: Misamis Institute of Technology.
       CDO, opening soon or seen once (Oct 2026): Acepoint Sports Center (Lumbia), Baseline Pickleball (Biasong, 7 courts, 2027),
       Center Court Pickleball Arena (behind 0-0-2), Courthouse, Dink Zone (Lumbia), DinkNest (Tablon),
       FADZ Pickle Court (Canitoan), Koi Kitchen (Indahag), Lifestyle Pickleball Sports Club (Corrales Ext), MBC Pickle Yard (Tablon),
       McPars Sports Center (Canitoan), Net Dinkers Play Center (Kauswagan), One Paseo Sports Hub (Pueblo, 6 courts ₱400),
       Paddle Rage CDO (Iponan, paddleragecdo.ph), PD Pickleball Hub (Balulang), Pickleball Center (Bulua Business Park),
       Picklehouse CDO (Kauswagan), Pickleyard x Yoru (Bayabas), RenzTer (Iponan), Rove Courtyard (Dansolihon), Sam's Dink House (Bayabas),
       South Villa Private Resort (Iponan), St. John Vianney courts (Camaman-an), The Commons Club (Bulua), The Courtside Pickle (Bugo),
       The Dink Zone (Bugo), The Dirty Kitchen (Del Pilar), The Paddle Village (Carmen), Torralba Pickleport (Lumbia), Xanria (Macasandig),
       Balulang Riverside Park, Unity Court (Provincial Capitol, LGU), City Hall Quadrangle open play (Mon 6 PM), Iponan free outdoor court,
       MJN Farm & Café (3 outdoor ₱250), Yasha Sports Zone (San Pedro, ₱150/₱250), Pickle Village by Country Village Hotel (Macasandig, soon).
       Nearby: Sideout Opol (7 indoor, planned), Opol Pickleball Community, Igpit Gymnasium (Opol), GN Pickleball Court (Tagoloan),
       Villanueva Pickleball United (Municipal Hall), DEZ Seaside and Fontana courts (Jasaan), Crown Peak Paddle Club (Alubijid, soon),
       BPS Pickleball Club (Balingasag), LB Pickleball Club (Manolo Fortich), E-Court (Gingoog).
       ───────────────────────────────────────────────────────────────────────── */
  ];
});
