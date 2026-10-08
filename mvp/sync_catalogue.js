const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const CSV_PATH = path.join(ROOT, 'data/properties.csv');
const JS_PATH = path.join(ROOT, 'mvp/catalogue.js');

function parseCsvCatalogue(csvText) {
  return csvText.trim().split(/\r?\n/).slice(1).map(line => {
    const match = line.match(/^([^,]+),([^,]+),([^,]+),([^,]+),(\d+),(\d+),([^,]+),([^,]+),"([^"]*)"$/);
    if (!match) throw new Error(`Could not parse catalogue row: ${line}`);
    return {
      id: match[1],
      title: match[2],
      location: match[3],
      type: match[4],
      price_eur: Number(match[5]),
      bedrooms: Number(match[6]),
      status: match[7],
      last_verified_at: match[8],
      key_features: match[9].split(';').map(value => value.trim())
    };
  });
}

function materialFields(value) {
  return {
    id: value.id,
    title: value.title,
    location: value.location,
    type: value.type,
    price_eur: value.price_eur,
    bedrooms: value.bedrooms,
    status: value.status,
    last_verified_at: value.last_verified_at,
    key_features: value.key_features
  };
}

function stringifyCatalogue(entries) {
  return `window.PROPLEAD_CATALOGUE = ${JSON.stringify(entries, null, 2)};\n`;
}

function loadJsCatalogue() {
  const jsText = fs.readFileSync(JS_PATH, 'utf8');
  const window = {};
  const catalogue = new Function('window', `${jsText}; return window.PROPLEAD_CATALOGUE;`)(window);
  if (!Array.isArray(catalogue)) throw new Error('mvp/catalogue.js did not expose window.PROPLEAD_CATALOGUE.');
  return catalogue;
}

function materialiseCatalogue() {
  const entries = parseCsvCatalogue(fs.readFileSync(CSV_PATH, 'utf8'));
  if (process.argv.includes('--write')) {
    fs.writeFileSync(JS_PATH, stringifyCatalogue(entries), 'utf8');
    return { written: true, count: entries.length };
  }

  const actualMaterial = loadJsCatalogue().map(materialFields);
  const expectedMaterial = entries.map(materialFields);
  if (JSON.stringify(actualMaterial) !== JSON.stringify(expectedMaterial)) {
    throw new Error('mvp/catalogue.js is out of sync with data/properties.csv. Run `node mvp/sync_catalogue.js --write`.');
  }
  return { written: false, count: entries.length };
}

if (require.main === module) {
  const result = materialiseCatalogue();
  console.log(JSON.stringify(result, null, 2));
}

module.exports = { parseCsvCatalogue, stringifyCatalogue, materialFields, materialiseCatalogue };
