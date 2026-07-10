/**
 * build.js — Minifica index.html (CSS + JS inline) antes de hacer push
 * Uso: node build.js
 *
 * Primera vez: npm install html-minifier-terser --save-dev
 */

const fs   = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');

const SRC  = path.join(__dirname, 'index.src.html');
const OUT  = path.join(__dirname, 'index.html');

async function build() {
  // Si no existe index.src.html, crea una copia del index.html actual como fuente
  if (!fs.existsSync(SRC)) {
    if (!fs.existsSync(OUT)) {
      console.error('❌ No se encontró index.html ni index.src.html');
      process.exit(1);
    }
    fs.copyFileSync(OUT, SRC);
    console.log('✅ index.src.html creado (tu fuente editable a partir de ahora)');
  }

  const html = fs.readFileSync(SRC, 'utf8');
  const originalSize = Buffer.byteLength(html, 'utf8');

  const minified = await minify(html, {
    collapseWhitespace:    true,
    removeComments:        true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    minifyCSS:             true,
    minifyJS: {
      compress: true,
      mangle:   true,   // cambia nombres de variables a a, b, c...
    },
  });

  fs.writeFileSync(OUT, minified, 'utf8');
  const newSize = Buffer.byteLength(minified, 'utf8');
  const pct = (((originalSize - newSize) / originalSize) * 100).toFixed(1);

  console.log(`✅ index.html generado`);
  console.log(`   Original : ${(originalSize / 1024).toFixed(1)} KB`);
  console.log(`   Minificado: ${(newSize / 1024).toFixed(1)} KB  (−${pct}%)`);
  console.log(`\n▶  Ahora puedes hacer: git add . && git commit -m "..." && git push`);
}

build().catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
