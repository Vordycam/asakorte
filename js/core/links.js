/* Links: build the hand-off links that get a player from our app to a booking.
   Nothing here talks to a server. Every venue is reached through its own
   channel: Messenger, Viber, a phone call, a booking website, or just directions. */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.Links = factory();
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  /* 0917 123 4567 / 09171234567 / +63 917... / 63917... -> +639171234567 */
  function normalizePhone(raw) {
    if (!raw) return '';
    var digits = String(raw).replace(/[^\d+]/g, '');
    if (!digits) return '';
    if (digits[0] === '+') digits = digits.slice(1);
    digits = digits.replace(/\+/g, '');
    if (digits.indexOf('63') === 0 && digits.length >= 12) return '+' + digits;
    if (digits[0] === '0' && digits.length === 11) return '+63' + digits.slice(1);
    if (digits.length === 10 && digits[0] === '9') return '+63' + digits;
    if (/^\d{7,8}$/.test(digits)) return digits; /* landline, leave as-is */
    return '+' + digits;
  }

  function prettyPhone(raw) {
    var p = normalizePhone(raw);
    var m = /^\+63(9\d{2})(\d{3})(\d{4})$/.exec(p);
    if (m) return '0' + m[1] + ' ' + m[2] + ' ' + m[3];
    return p || '';
  }

  /* Facebook page URL or handle -> handle. https://www.facebook.com/PickleDavao/ -> PickleDavao
     Also accepts profile.php?id=123 -> 123, m.me/handle, and plain handles. */
  function facebookHandle(raw) {
    if (!raw) return '';
    var s = String(raw).trim();
    var path = s.replace(/^https?:\/\//i, '').replace(/^(?:www\.|m\.|web\.)(?=facebook\.com)/i, '');
    var m;
    if (/^facebook\.com\//i.test(path)) {
      path = path.replace(/^facebook\.com\//i, '');
      /* share links, groups, events: no page handle to message */
      if (/^(share|groups|events|hashtag|watch|reel|stories)\b/i.test(path)) return '';
      m = /^profile\.php\?id=(\d+)/i.exec(path);
      if (m) return m[1];
      m = /^(?:p|people)\/[^/?#]*?[-/](\d{5,})\/?(?:[?#].*)?$/i.exec(path);
      if (m) return m[1];
      m = /^pages\/[^/]+\/(\d+)/i.exec(path);
      if (m) return m[1];
      m = /^([^/?#&]+)/.exec(path);
      return m ? m[1] : '';
    }
    m = /^(?:m\.me|messenger\.com\/t)\/([^/?#&]+)/i.exec(path);
    if (m) return m[1];
    if (/^[A-Za-z0-9._-]+$/.test(s)) return s;
    return '';
  }

  function facebookUrl(raw) {
    if (!raw) return '';
    var s = String(raw).trim();
    if (/^(https?:\/\/)?(www\.|m\.|web\.)?(facebook\.com|fb\.com|fb\.me)\//i.test(s)) {
      return s.replace(/^(https?:\/\/)?(m\.|web\.)?/i, 'https://').replace(/^https:\/\/fb\.com/i, 'https://www.facebook.com')
        .replace(/^https:\/\/facebook\.com/i, 'https://www.facebook.com');
    }
    var h = facebookHandle(s);
    if (!h) return '';
    if (/^\d+$/.test(h)) return 'https://www.facebook.com/profile.php?id=' + h;
    return 'https://www.facebook.com/' + h;
  }

  function messengerUrl(booking) {
    if (!booking) return '';
    if (booking.messenger) {
      var h = facebookHandle(booking.messenger);
      return h ? 'https://m.me/' + h : String(booking.messenger);
    }
    var fb = facebookHandle(booking.facebook);
    return fb ? 'https://m.me/' + fb : '';
  }

  function viberUrl(number) {
    var p = normalizePhone(number);
    if (!p) return '';
    return 'viber://chat?number=' + encodeURIComponent(p);
  }

  function telUrl(number) {
    var p = normalizePhone(number);
    return p ? 'tel:' + p : '';
  }

  function whatsappUrl(number) {
    var p = normalizePhone(number).replace('+', '');
    return p ? 'https://wa.me/' + p : '';
  }

  function directionsUrl(venue) {
    if (!venue || !isFinite(venue.lat) || !isFinite(venue.lng)) return '';
    return 'https://www.google.com/maps/dir/?api=1&destination=' + venue.lat + ',' + venue.lng;
  }

  function wazeUrl(venue) {
    if (!venue || !isFinite(venue.lat) || !isFinite(venue.lng)) return '';
    return 'https://waze.com/ul?ll=' + venue.lat + ',' + venue.lng + '&navigate=yes';
  }

  function mapsSearchUrl(venue) {
    if (!venue) return '';
    var q = [venue.name, venue.address, venue.city].filter(Boolean).join(', ');
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
  }

  /* The ordered list of ways to book, best first. Each: {kind, label, href, external, primary} */
  function bookingActions(venue) {
    var b = (venue && venue.booking) || {};
    var out = [];
    if (b.url) out.push({ kind: 'web', label: b.urlLabel || 'Book online', href: b.url, external: true });
    var mm = messengerUrl(b);
    if (mm) out.push({ kind: 'messenger', label: 'Message on Messenger', href: mm, external: true });
    if (b.viber) out.push({ kind: 'viber', label: 'Chat on Viber', href: viberUrl(b.viber), external: true });
    if (b.whatsapp) out.push({ kind: 'whatsapp', label: 'WhatsApp', href: whatsappUrl(b.whatsapp), external: true });
    if (b.phone) out.push({ kind: 'call', label: 'Call ' + prettyPhone(b.phone), href: telUrl(b.phone) });
    var fb = facebookUrl(b.facebook);
    if (fb) out.push({ kind: 'facebook', label: 'Facebook page', href: fb, external: true });
    if (b.instagram) out.push({ kind: 'instagram', label: 'Instagram', href: /^https?:/.test(b.instagram) ? b.instagram : 'https://instagram.com/' + String(b.instagram).replace(/^@/, ''), external: true });
    /* Preferred channel first when the venue says so. */
    if (b.preferred) {
      var idx = -1;
      for (var i = 0; i < out.length; i++) if (out[i].kind === b.preferred) { idx = i; break; }
      if (idx > 0) out.unshift(out.splice(idx, 1)[0]);
    }
    if (out.length) out[0].primary = true;
    return out;
  }

  /* Deep link to a venue inside this app, for sharing into group chats. */
  function shareUrl(venueId, base) {
    base = base || (typeof location !== 'undefined' ? location.origin + location.pathname : '');
    return base + '?court=' + encodeURIComponent(venueId);
  }

  return {
    normalizePhone: normalizePhone, prettyPhone: prettyPhone,
    facebookHandle: facebookHandle, facebookUrl: facebookUrl, messengerUrl: messengerUrl,
    viberUrl: viberUrl, telUrl: telUrl, whatsappUrl: whatsappUrl,
    directionsUrl: directionsUrl, wazeUrl: wazeUrl, mapsSearchUrl: mapsSearchUrl,
    bookingActions: bookingActions, shareUrl: shareUrl
  };
});
