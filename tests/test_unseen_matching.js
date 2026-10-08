const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const PropLead = require('../mvp/app.js');

const ROOT = path.resolve(__dirname, '..');

function loadCsvCatalogue() {
  return fs.readFileSync(path.join(ROOT, 'data/properties.csv'), 'utf8').trim().split(/\r?\n/).slice(1).map(line => {
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

function loadJsCatalogue() {
  const code = fs.readFileSync(path.join(ROOT, 'mvp/catalogue.js'), 'utf8');
  const sandbox = { PROPLEAD_CATALOGUE: null };
  const window = sandbox;
  new Function('window', `${code}; return window.PROPLEAD_CATALOGUE;`)(window);
  return sandbox.PROPLEAD_CATALOGUE;
}

function processMessage(message, catalogue = loadCsvCatalogue(), options = {}) {
  return PropLead.processLead({ source_channel: 'web_form', original_text: message }, catalogue, { reference_date: '2026-10-03', ...options });
}

function expectSingleMatch(message, expectedId, extraOptions = {}) {
  const actual = processMessage(message, loadCsvCatalogue(), extraOptions);
  assert.ok(actual.matches.some(property => property.id === expectedId), `Expected ${expectedId} in matches for: ${message}`);
  if (extraOptions.expect_single !== false) {
    assert.equal(actual.matches.length, 1, `Expected a single match for: ${message}`);
  }
  assert.equal(actual.human_review_required, true);
  return actual;
}

const matchingCases = [
  { message: "I'm after a Palma old town flat, two beds, around 600k, no rush.", expectedId: 'PM-101' },
  { message: 'Busco un piso en el casco antiguo de Palma, dos dormitorios, sobre 600 mil euros.', expectedId: 'PM-101' },
  { message: 'Ich suche eine Wohnung in Palmas Altstadt mit zwei Schlafzimmern und ca. 600 K Budget.', expectedId: 'PM-101' },
  { message: 'We need a Santa Catalina townhouse with three bedrooms, up to 950k.', expectedId: 'PM-102' },
  { message: 'Queremos una casa de pueblo en Santa Catalina, tres dormitorios y presupuesto de 900 mil euros.', expectedId: 'PM-102' },
  { message: 'Gesucht wird ein Stadthaus in Santa Catalina mit drei Schlafzimmern bis 950 K.', expectedId: 'PM-102' },
  { message: 'Looking for a sea-view apartment in Port de Soller, two bed, budget 1.4m.', expectedId: 'PM-103' },
  { message: 'Busco un apartamento con vistas al mar en Port de Soller, dos habitaciones y hasta 1,4 millones.', expectedId: 'PM-103' },
  { message: 'Ich suche eine Wohnung mit Meerblick in Port de Soller, zwei Schlafzimmer, Budget 1,4 Millionen.', expectedId: 'PM-103' },
  { message: 'Need an Artà finca with tourist rental licence and pool, investment purchase up to 1.4m.', expectedId: 'PM-104' },
  { message: 'Busco una finca en Artà con licencia turística y piscina, inversión, hasta 1,4 millones.', expectedId: 'PM-104' },
  { message: 'Gesucht wird eine Finca in Artà mit Ferienvermietung und Pool, Kapitalanlage bis 1,4 Millionen.', expectedId: 'PM-104' },
  { message: 'We want a townhouse in Sant Llorenç des Cardassar with a pool, 450 mil euros max.', expectedId: 'PM-105' },
  { message: 'Queremos una casa de pueblo en Sant Llorenç des Cardassar con piscina y 450 mil euros.', expectedId: 'PM-105' },
  { message: 'Wir suchen ein Stadthaus in Sant Llorenç des Cardassar mit Pool bis 450 K.', expectedId: 'PM-105' },
  { message: 'A frontline apartment in Cala Dor for renovation, around 300k.', expectedId: 'PM-106' },
  { message: "Necesito un piso en Cala d'Or para reformar, primera línea, hasta 320 mil.", expectedId: 'PM-106' },
  { message: 'Ich suche eine Wohnung in Cala Dor direkt am Meer zum Renovieren, Budget 300 K.', expectedId: 'PM-106' },
  { message: 'Family villa in Palma with pool and parking, four bedrooms, 1.25m max.', expectedId: 'PM-107' },
  { message: 'Buscamos villa familiar en Palma con piscina y parking, cuatro dormitorios, hasta 1,25 millones.', expectedId: 'PM-107' },
  { message: 'Gesucht wird eine Villa in Palma mit Pool und Stellplatz, vier Schlafzimmer, Budget 1,3 Millionen.', expectedId: 'PM-107' },
  { message: 'Renovation house in Inca, three bedrooms, 320k.', expectedId: 'PM-108' },
  { message: 'Casa para reformar en Inca, tres dormitorios, 320 mil euros.', expectedId: 'PM-108' },
  { message: 'Renovierungsbedürftiges Haus in Inca mit drei Schlafzimmern bis 320 K.', expectedId: 'PM-108' }
];

for (const testCase of matchingCases) {
  test(`unseen match: ${testCase.expectedId} :: ${testCase.message}`, () => {
    expectSingleMatch(testCase.message, testCase.expectedId);
  });
}

test('must-have feature cannot be ignored', () => {
  const actual = processMessage('Looking for a Palma apartment with sea view and a pool, budget 800k.');
  assert.ok(actual.matches.every(property => property.key_features.includes('pool')));
  assert.equal(actual.human_review_required, true);
});

test('unavailable property cannot be returned', () => {
  const catalogue = loadCsvCatalogue().map(property => property.id === 'PM-101' ? { ...property, status: 'unavailable' } : property);
  const actual = processMessage('Looking for a Palma old town flat, two beds, around 600k.', catalogue);
  assert.ok(!actual.matches.some(property => property.id === 'PM-101'));
  assert.equal(actual.human_review_required, true);
});

test('stale property cannot be returned', () => {
  const catalogue = loadCsvCatalogue().map(property => property.id === 'PM-101' ? { ...property, last_verified_at: '2026-01-01' } : property);
  const actual = processMessage('Looking for a Palma old town flat, two beds, around 600k.', catalogue);
  assert.ok(!actual.matches.some(property => property.id === 'PM-101'));
  assert.equal(actual.human_review_required, true);
});

test('missing critical information still blocks matching', () => {
  const actual = processMessage('Searching for a place in Mallorca around 600k.');
  assert.equal(actual.status, 'needs_information');
  assert.deepEqual(actual.matches, []);
  assert.equal(actual.human_review_required, true);
});

test('ambiguous information is not silently inferred', () => {
  const actual = processMessage('Need 2 or 3 rooms somewhere in Palma, maybe a flat around 600k.');
  assert.equal(actual.status, 'needs_information');
  assert.ok(actual.risk_flags.includes('ambiguous_bedrooms'));
  assert.deepEqual(actual.matches, []);
  assert.equal(actual.human_review_required, true);
});

test('catalogue csv and js stay in sync', () => {
  const csvCatalogue = loadCsvCatalogue();
  const jsCatalogue = loadJsCatalogue();
  assert.deepEqual(jsCatalogue.map(property => property.id), csvCatalogue.map(property => property.id));
  assert.deepEqual(jsCatalogue.map(property => ({ id: property.id, title: property.title, location: property.location, type: property.type, price_eur: property.price_eur, bedrooms: property.bedrooms, status: property.status, last_verified_at: property.last_verified_at, key_features: property.key_features })), csvCatalogue.map(property => ({ id: property.id, title: property.title, location: property.location, type: property.type, price_eur: property.price_eur, bedrooms: property.bedrooms, status: property.status, last_verified_at: property.last_verified_at, key_features: property.key_features })));
});
