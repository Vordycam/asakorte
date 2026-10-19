/* Builds a copy of the app for hosts that wrap the page in their own HTML skeleton
   (for example a claude.ai artifact): strips the document wrapper and the service
   worker, keeps everything else, and copies the supporting files next to it.

   node tools/build-artifact.js <outDir> [publicUrl]

   publicUrl, when given, is baked in as window.ASAKORTE_SHARE_BASE so "Share" links
   from that host point at the public page (courts are addressed as "#<court-id>"). */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'dist-artifact'));
const PUBLIC_URL = process.argv[3] || '';

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const body = /<body>([\s\S]*)<\/body>/.exec(html)[1]
  .replace(/<script>\s*if \('serviceWorker' in navigator[\s\S]*?<\/script>/, '');
const fonts = /<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/.exec(html)[0];

const page = [
  '<title>AsaKorte</title>',
  fonts,
  '<link rel="stylesheet" href="styles.css">',
  PUBLIC_URL ? '<script>window.ASAKORTE_SHARE_BASE = ' + JSON.stringify(PUBLIC_URL) + ';</script>' : '',
  body.trim(),
  ''
].filter(Boolean).join('\n');

function copyDir(from, to, list, rel) {
  fs.mkdirSync(to, { recursive: true });
  for (const name of fs.readdirSync(from)) {
    const src = path.join(from, name), dst = path.join(to, name), r = rel ? rel + '/' + name : name;
    if (fs.statSync(src).isDirectory()) copyDir(src, dst, list, r);
    else { fs.copyFileSync(src, dst); list.push(r); }
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), page);
const files = [];
fs.copyFileSync(path.join(ROOT, 'styles.css'), path.join(OUT, 'styles.css')); files.push('styles.css');
for (const dir of ['js', 'icons', 'vendor']) copyDir(path.join(ROOT, dir), path.join(OUT, dir), files, dir);
fs.writeFileSync(path.join(OUT, 'files.json'), JSON.stringify(files, null, 2));
console.log('built', OUT, 'with', files.length, 'supporting files');
console.log(JSON.stringify(files));
