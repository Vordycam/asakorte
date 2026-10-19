/* Generates the app icons with no dependencies: a lime pickleball on court-navy.
   node tools/make-icons.js
   Writes icons/icon-192.png, icons/icon-512.png (rounded, transparent corners)
   and icons/icon-512-maskable.png (full-bleed, content inside the safe zone). */
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const NAVY = [11, 27, 58];
const BLUE = [29, 78, 216];
const LIME = [212, 244, 59];
const HOLE = [11, 27, 58];

/* ---- tiny PNG writer ---- */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td), 0);
  return Buffer.concat([len, td, crc]);
}
function png(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

/* ---- scene ---- */
function inRoundedRect(x, y, s, r) {
  if (x < 0 || y < 0 || x > s || y > s) return false;
  const cx = Math.min(Math.max(x, r), s - r), cy = Math.min(Math.max(y, r), s - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}

/* Returns [r,g,b,a] for a point in unit space (0..1), given layout params. */
function sample(u, v, opts) {
  const { rounded, ballScale } = opts;
  if (rounded && !inRoundedRect(u, v, 1, 0.22)) return [0, 0, 0, 0];
  /* background: navy with a subtle court-blue diagonal band */
  let col = NAVY;
  const band = (u + v) * 0.5;
  if (band > 0.68 && band < 0.82) col = BLUE;
  /* court line: a thin lime kitchen line in the lower-left */
  const lineD = Math.abs((v - 0.5) - (u - 0.5) * -1.0);
  /* ball */
  const cx = 0.5, cy = 0.5, R = 0.33 * ballScale;
  const d = Math.hypot(u - cx, v - cy);
  if (d <= R) {
    col = LIME;
    /* holes: center + ring of 6 + outer ring of 6 offset */
    const holes = [[0, 0]];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      holes.push([Math.cos(a) * 0.42, Math.sin(a) * 0.42]);
    }
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      holes.push([Math.cos(a) * 0.78, Math.sin(a) * 0.78]);
    }
    for (const [hx, hy] of holes) {
      const hd = Math.hypot(u - (cx + hx * R), v - (cy + hy * R));
      if (hd <= R * 0.105) { col = HOLE; break; }
    }
    /* soft highlight top-left */
    const hl = Math.hypot(u - (cx - R * 0.35), v - (cy - R * 0.35));
    if (col === LIME && hl < R * 0.55) col = [228, 250, 120];
  } else if (d <= R * 1.08) {
    /* dark rim so the ball pops on the blue band */
    col = [8, 18, 40];
  }
  void lineD;
  return [col[0], col[1], col[2], 255];
}

function render(size, opts) {
  const buf = Buffer.alloc(size * size * 4);
  const SS = 4; /* supersampling grid per axis */
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const u = (x + (sx + 0.5) / SS) / size, v = (y + (sy + 0.5) / SS) / size;
          const c = sample(u, v, opts);
          r += c[0] * c[3]; g += c[1] * c[3]; b += c[2] * c[3]; a += c[3];
        }
      }
      const i = (y * size + x) * 4;
      if (a > 0) { buf[i] = r / a; buf[i + 1] = g / a; buf[i + 2] = b / a; }
      buf[i + 3] = a / (SS * SS);
    }
  }
  return png(size, size, buf);
}

const out = path.join(__dirname, '..', 'icons');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'icon-192.png'), render(192, { rounded: true, ballScale: 1 }));
fs.writeFileSync(path.join(out, 'icon-512.png'), render(512, { rounded: true, ballScale: 1 }));
fs.writeFileSync(path.join(out, 'icon-512-maskable.png'), render(512, { rounded: false, ballScale: 0.8 }));
fs.writeFileSync(path.join(out, 'apple-touch-icon.png'), render(180, { rounded: false, ballScale: 0.9 }));
console.log('icons written to', out);
