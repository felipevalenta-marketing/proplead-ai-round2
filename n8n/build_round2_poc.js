const fs = require('node:fs');
const path = require('node:path');

const file = path.join(__dirname, 'proplead_round2_poc.json');
const workflow = JSON.parse(fs.readFileSync(file, 'utf8'));

function getNode(name) {
  const node = workflow.nodes.find(entry => entry.name === name);
  if (!node) throw new Error(`Missing workflow node: ${name}`);
  return node;
}

function setNodeCode(name, jsCode) {
  const node = getNode(name);
  node.parameters.jsCode = jsCode.trim();
}

workflow.name = 'PropLead AI — Round 2 POC v2';

setNodeCode('Simulated test inputs', String.raw`return [
  {
    json: {
      demo_case: 'es-qualified-match',
      source_channel: 'whatsapp',
      source_message_id: 'wa-round2-es-001',
      received_at: '2026-10-03T09:00:00.000Z',
      consent_status: 'synthetic_demo',
      original_message: 'Hola, busco un apartamento en Palma con balcón y preferiblemente vista al mar. Mi presupuesto es de 600000 euros.'
    }
  },
  {
    json: {
      demo_case: 'de-escalation',
      source_channel: 'email',
      source_message_id: 'em-round2-de-001',
      received_at: '2026-10-03T09:05:00.000Z',
      consent_status: 'synthetic_demo',
      original_message: 'Ich suche eine Wohnung mit zwei Schlafzimmern in Palma.'
    }
  }
];`);

setNodeCode('Normalise intake', String.raw`const allowedChannels = ['web_form', 'email', 'whatsapp', 'property_portal', 'social', 'manual'];
const originalMessage = String($json.original_message || '');
const normalisedMessage = originalMessage.replace(/\s+/g, ' ').trim();
if (!normalisedMessage) throw new Error('A lead message is required');

return [{
  json: {
    ...$json,
    source_channel: allowedChannels.includes($json.source_channel) ? $json.source_channel : 'manual',
    original_message: originalMessage,
    normalised_message: normalisedMessage,
    received_at: $json.received_at || new Date().toISOString(),
    consent_status: $json.consent_status || 'synthetic_demo'
  }
}];`);

setNodeCode('Multilingual structured lead extraction', String.raw`function fold(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’'´]/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectLanguage(text) {
  const normalised = fold(text);
  if (/(hola|busco|presupuesto|opcion|opciones|informacion|comprobara|dormitorios|si es posible|vistas al mar|vista al mar)/.test(normalised)) return 'es';
  if (/(ich|suche|wohnung|schlafzimmer|verfugbarkeit|pruft|bitte|moglich|muss|haus|reihenhaus|stadthaus)/.test(normalised)) return 'de';
  return 'en';
}

function parseBudget(text) {
  const raw = String(text || '');
  const compactMatch = raw.match(/(\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?)(?:\s*(m|million(?:es)?|k))\b/i);
  if (compactMatch) {
    let token = compactMatch[1];
    const unit = compactMatch[2].toLowerCase();
    if (unit === 'm' || unit.startsWith('million')) return Math.round(Number(token.replace(',', '.')) * 1000000);
    if (unit === 'k') return Math.round(Number(token.replace(',', '.')) * 1000);
  }
  const plainMatch = raw.match(/(?:€\s*)?(\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?)(?:\s*(?:€|eur|euro|euros?))?/i);
  if (!plainMatch) return null;
  let token = plainMatch[1];
  if (/^\d{1,3}([.,]\d{3})+$/.test(token)) token = token.replace(/[.,]/g, '');
  else token = token.replace(',', '.');
  const amount = Number(token);
  return Number.isFinite(amount) && amount >= 1000 ? Math.round(amount) : null;
}

function wholePhrase(text, phrase) {
  return new RegExp('(?:^|\\s)' + phrase.replace(/\s+/g, '\\s+') + '(?:\\s|$)').test(text);
}

function extractLocations(text) {
  const normalised = fold(text);
  const rules = [
    { canonical: 'Palma', aliases: ['palma old town', 'old town palma', 'santa catalina', 'palma'] },
    { canonical: 'Sóller', aliases: ['port de soller', 'soller'] },
    { canonical: 'Artà', aliases: ['arta'] },
    { canonical: 'Sant Llorenç des Cardassar', aliases: ['sant llorenc des cardassar'] },
    { canonical: 'Inca', aliases: ['inca'] },
    { canonical: 'Cala d\'Or', aliases: ['cala d or', 'cala dor'] }
  ];
  const matches = [];
  for (const rule of rules) {
    if (rule.aliases.some(alias => wholePhrase(normalised, fold(alias)))) matches.push(rule.canonical);
  }
  return [...new Set(matches)];
}

function extractPropertyType(text) {
  const normalised = fold(text);
  if (/(townhouse|casa de pueblo|reihenhaus|stadthaus)/.test(normalised)) return 'townhouse';
  if (/\bvilla\b/.test(normalised)) return 'villa';
  if (/(finca|country house|landhaus|casa de campo)/.test(normalised)) return 'finca';
  if (/(house|haus|casa)/.test(normalised)) return 'house';
  if (/(apartment|apartamento|wohnung|piso)/.test(normalised)) return 'apartment';
  return null;
}

function extractBedrooms(text) {
  const normalised = fold(text);
  const digitMatch = normalised.match(/(\d+)\s*(?:bedrooms?|dormitorios?|habitaciones?|schlafzimmer)/);
  if (digitMatch) return Number(digitMatch[1]);
  const words = {
    one: 1, two: 2, three: 3, four: 4, five: 5,
    ein: 1, eins: 1, eine: 1, zwei: 2, drei: 3, vier: 4,
    uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5
  };
  for (const [word, value] of Object.entries(words)) {
    const pattern = new RegExp('\\b' + word + '\\b(?=.{0,14}(?:bedrooms?|dormitorios?|habitaciones?|schlafzimmer))', 'i');
    if (pattern.test(normalised)) return value;
  }
  return null;
}

function lastBefore(values, position) {
  const matches = values.filter(value => value >= 0 && value < position);
  return matches.length ? Math.max(...matches) : -1;
}

function extractFeatureMentions(text) {
  const normalised = fold(text);
  const hardCues = ['must have', 'must', 'need', 'needs', 'required', 'have to', 'has to', 'necesito', 'necesita', 'debe tener', 'tiene que', 'brauche', 'brauchen', 'muss', 'musst'];
  const softCues = ['preferably', 'preferred', 'if possible', 'if you can', 'would prefer', 'would like', 'ideally', 'nice to have', 'si es posible', 'si puede ser', 'preferiblemente', 'preferiria', 'wenn moglich', 'am liebsten', 'gern', 'gerne'];
  const featureRules = [
    { canonical: 'balcony', aliases: ['balcony', 'balcon', 'balkon'] },
    { canonical: 'sea view', aliases: ['sea view', 'sea front', 'seafront', 'frontline', 'beachfront', 'vistas al mar', 'vista al mar', 'meerblick'] },
    { canonical: 'pool', aliases: ['pool', 'piscina'] },
    { canonical: 'parking', aliases: ['parking', 'aparcamiento', 'stellplatz'] },
    { canonical: 'tourist licence', aliases: ['tourist licence', 'tourist license', 'licencia turistica', 'ferienvermietung'] },
    { canonical: 'renovation', aliases: ['renovation', 'renovate', 'reformar', 'reforma', 'renovierungsbedurftig'] }
  ];

  const mustHaveFeatures = [];
  const preferredFeatures = [];
  const hardPositions = hardCues.map(cue => normalised.indexOf(fold(cue))).filter(position => position >= 0);
  const softPositions = softCues.map(cue => normalised.indexOf(fold(cue))).filter(position => position >= 0);

  for (const feature of featureRules) {
    const alias = feature.aliases.find(item => wholePhrase(normalised, fold(item)));
    if (!alias) continue;
    const index = normalised.indexOf(fold(alias));
    const nearestHardBefore = lastBefore(hardPositions, index);
    const nearestSoftBefore = lastBefore(softPositions, index);
    if (nearestSoftBefore > nearestHardBefore) preferredFeatures.push(feature.canonical);
    else mustHaveFeatures.push(feature.canonical);
  }

  return {
    must_have_features: [...new Set(mustHaveFeatures)],
    preferred_features: [...new Set(preferredFeatures)]
  };
}

const originalMessage = $json.normalised_message || $json.original_message || '';
const detectedLanguage = detectLanguage(originalMessage);
const budgetEur = parseBudget(originalMessage);
const locations = extractLocations(originalMessage);
const propertyType = extractPropertyType(originalMessage);
const minBedrooms = extractBedrooms(originalMessage);
const featureMentions = extractFeatureMentions(originalMessage);

const structuredLead = {
  budget_eur: budgetEur,
  locations,
  property_type: propertyType,
  min_bedrooms: minBedrooms,
  timeline_months: null,
  purpose: null,
  financing_status: null,
  must_have_features: featureMentions.must_have_features,
  preferred_features: featureMentions.preferred_features,
  catalogue_reference_date: '2026-10-03',
  catalogue_freshness_days: 30
};

const missingFields = [];
if (budgetEur === null) missingFields.push('budget_eur');
if (!locations.length) missingFields.push('specific_location');
if (!propertyType && minBedrooms === null) missingFields.push('property_type_or_bedrooms');

const qualificationStatus = missingFields.length ? 'needs_information' : 'matching_ready';
const scoreWeights = { budget_eur: 20, locations: 20, property_type: 15, min_bedrooms: 15 };
let score = 0;
for (const [key, weight] of Object.entries(scoreWeights)) {
  const value = { budget_eur: budgetEur, locations, property_type: propertyType, min_bedrooms: minBedrooms }[key];
  if (Array.isArray(value) ? value.length : value !== null) score += weight;
}

return [{
  json: {
    ...$json,
    detected_language: detectedLanguage,
    structured_lead: structuredLead,
    must_have_features: featureMentions.must_have_features,
    preferred_features: featureMentions.preferred_features,
    budget_eur: budgetEur,
    locations,
    property_type: propertyType,
    min_bedrooms: minBedrooms,
    missing_fields: missingFields,
    qualification_status: qualificationStatus,
    score,
    priority: qualificationStatus === 'needs_information' ? 'review' : score >= 55 ? 'warm' : 'cold',
    confidence: 'high',
    risk_flags: []
  }
}];`);

setNodeCode('Deterministic qualification and escalation', String.raw`const lead = $json;
const catalogue = [
  { id: 'PM-101', title: 'Palma Old Town Apartment', location: 'Palma', type: 'apartment', price_eur: 575000, bedrooms: 2, status: 'available', last_verified_at: '2026-09-29', key_features: ['balcony', 'sea view'] },
  { id: 'PM-102', title: 'Santa Catalina Townhouse', location: 'Palma', type: 'townhouse', price_eur: 820000, bedrooms: 3, status: 'available', last_verified_at: '2026-09-29', key_features: ['pool', 'parking'] },
  { id: 'PM-103', title: 'Port de Sóller Sea View Apartment', location: 'Sóller', type: 'apartment', price_eur: 760000, bedrooms: 2, status: 'available', last_verified_at: '2026-09-29', key_features: ['sea view', 'balcony'] },
  { id: 'PM-104', title: 'Artà Stone Finca', location: 'Artà', type: 'finca', price_eur: 1390000, bedrooms: 4, status: 'available', last_verified_at: '2026-09-29', key_features: ['pool', 'tourist licence'] },
  { id: 'PM-105', title: 'Sant Llorenç Townhouse', location: 'Sant Llorenç des Cardassar', type: 'townhouse', price_eur: 450000, bedrooms: 3, status: 'available', last_verified_at: '2026-09-29', key_features: ['pool', 'parking'] },
  { id: 'PM-108', title: 'Inca Renovation House', location: 'Inca', type: 'townhouse', price_eur: 320000, bedrooms: 3, status: 'available', last_verified_at: '2026-09-29', key_features: ['renovation'] }
];

function fold(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasFeature(property, feature) {
  return property.key_features.map(fold).includes(fold(feature));
}

function typeCompatible(leadType, propertyType) {
  if (!leadType) return true;
  if (leadType === propertyType) return true;
  if (leadType === 'house' && propertyType === 'townhouse') return true;
  if (leadType === 'townhouse' && propertyType === 'house') return true;
  return false;
}

function locationCompatible(leadLocations, propertyLocation) {
  if (!leadLocations.length) return true;
  const propertyFolded = fold(propertyLocation);
  return leadLocations.some(location => fold(location) === propertyFolded);
}

function matches(property, leadData) {
  if (property.status !== 'available') return false;
  if (leadData.budget_eur !== null && property.price_eur > leadData.budget_eur) return false;
  if (!locationCompatible(leadData.locations, property.location)) return false;
  if (!typeCompatible(leadData.property_type, property.type)) return false;
  if (leadData.min_bedrooms !== null && property.bedrooms < leadData.min_bedrooms) return false;
  if (!leadData.must_have_features.every(feature => hasFeature(property, feature))) return false;
  return true;
}

function preferenceScore(property, preferredFeatures) {
  return preferredFeatures.reduce((score, feature) => score + (hasFeature(property, feature) ? 1 : 0), 0);
}

const matchesFound = lead.qualification_status === 'matching_ready'
  ? catalogue.filter(property => matches(property, lead.structured_lead)).sort((left, right) => {
      const preferenceDelta = preferenceScore(right, lead.structured_lead.preferred_features) - preferenceScore(left, lead.structured_lead.preferred_features);
      if (preferenceDelta !== 0) return preferenceDelta;
      return left.price_eur - right.price_eur;
    })
  : [];

const compatiblePropertyIds = matchesFound.map(property => property.id);
const escalationReasons = [...lead.missing_fields].map(field => field === 'budget_eur' ? 'missing_budget_eur' : field === 'specific_location' ? 'missing_specific_location' : field === 'property_type_or_bedrooms' ? 'missing_property_type_or_bedrooms' : field);
if (lead.qualification_status === 'matching_ready' && compatiblePropertyIds.length === 0) escalationReasons.push('no_catalogue_match');

return [{
  json: {
    ...lead,
    matched_properties: matchesFound,
    compatible_property_ids: compatiblePropertyIds,
    must_escalate: escalationReasons.length > 0,
    escalation_reasons: escalationReasons
  }
}];`);

setNodeCode('Multilingual response-draft preparation', String.raw`const lead = $json;
const language = lead.detected_language;
const matchCount = lead.compatible_property_ids.length;
let responseDraft = '';

if (language === 'es') {
  if (lead.qualification_status === 'needs_information') {
    responseDraft = 'Gracias por su consulta. Para continuar, necesitamos confirmar ' + lead.missing_fields.join(', ') + '. Un agente revisará la información y responderá después de la aprobación humana.';
  } else if (matchCount) {
    responseDraft = 'Gracias por su consulta. Hemos identificado ' + matchCount + ' opción' + (matchCount === 1 ? '' : 'es') + ' compatible' + (matchCount === 1 ? '' : 's') + ': ' + lead.compatible_property_ids.join(', ') + '. Un agente comprobará la información y revisará el mensaje antes de responder.';
  } else {
    responseDraft = 'Gracias por su consulta. No hemos encontrado una coincidencia fiable en el catálogo controlado. Un agente revisará la información antes de responder.';
  }
} else if (language === 'de') {
  if (lead.qualification_status === 'needs_information') {
    responseDraft = 'Vielen Dank für Ihre Anfrage. Bitte bestätigen Sie ' + lead.missing_fields.join(', ') + '. Ein Makler prüft die Informationen und bestätigt die Verfügbarkeit, bevor wir antworten.';
  } else if (matchCount) {
    responseDraft = 'Vielen Dank für Ihre Anfrage. Wir haben ' + matchCount + ' passende Option' + (matchCount === 1 ? '' : 'en') + ' gefunden: ' + lead.compatible_property_ids.join(', ') + '. Ein Makler prüft die Verfügbarkeit und die Informationen, bevor wir antworten.';
  } else {
    responseDraft = 'Vielen Dank für Ihre Anfrage. Im kontrollierten Katalog wurde keine verlässliche Übereinstimmung gefunden. Ein Makler prüft die Informationen vor einer Antwort.';
  }
} else {
  if (lead.qualification_status === 'needs_information') {
    responseDraft = 'Thank you for your enquiry. Please confirm ' + lead.missing_fields.join(', ') + '. An agent will review the information before any reply is sent.';
  } else if (matchCount) {
    responseDraft = 'Thank you for your enquiry. We found ' + matchCount + ' compatible option' + (matchCount === 1 ? '' : 's') + ': ' + lead.compatible_property_ids.join(', ') + '. An agent will review the information before any reply is sent.';
  } else {
    responseDraft = 'Thank you for your enquiry. No reliable match was found in the controlled catalogue. An agent will review the information before any reply is sent.';
  }
}

return [{
  json: {
    ...lead,
    response_draft: responseDraft
  }
}];`);

setNodeCode('Agent review queue', String.raw`return [{
  json: {
    original_message: $json.original_message,
    source_channel: $json.source_channel,
    detected_language: $json.detected_language,
    budget_eur: $json.budget_eur,
    locations: $json.locations,
    property_type: $json.property_type,
    min_bedrooms: $json.min_bedrooms,
    structured_lead: $json.structured_lead,
    must_have_features: $json.must_have_features,
    preferred_features: $json.preferred_features,
    compatible_property_ids: $json.compatible_property_ids,
    qualification_status: $json.qualification_status,
    must_escalate: $json.must_escalate,
    escalation_reasons: $json.escalation_reasons,
    response_draft: $json.response_draft,
    human_review_required: true,
    status: 'awaiting_agent_approval'
  }
}];`);

fs.writeFileSync(file, JSON.stringify(workflow, null, 2) + '\n', 'utf8');

const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!parsed.name.endsWith('v2')) throw new Error('Workflow name was not updated');
const normaliseCode = getNode('Normalise intake').parameters.jsCode;
if (!normaliseCode.includes('replace(/\\s+/g')) throw new Error('Normalise intake regex escapes were not preserved');
if (!getNode('Multilingual structured lead extraction').parameters.jsCode.includes('vista al mar')) throw new Error('Feature extraction code was not written');
console.log(`Created ${parsed.name} with ${parsed.nodes.length} nodes.`);



