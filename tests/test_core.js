const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const PropLead = require('../mvp/app.js');

const ROOT = path.resolve(__dirname, '..');
const catalogue = fs.readFileSync(path.join(ROOT, 'data/properties.csv'), 'utf8').trim().split(/\r?\n/).slice(1).map(line => {
  const match = line.match(/^([^,]+),([^,]+),([^,]+),([^,]+),(\d+),(\d+),([^,]+),([^,]+),"([^"]*)"$/);
  if (!match) throw new Error(`Could not parse catalogue row: ${line}`);
  return {id:match[1],title:match[2],location:match[3],type:match[4],price_eur:Number(match[5]),bedrooms:Number(match[6]),status:match[7],last_verified_at:match[8],key_features:match[9].split(';').map(x=>x.trim())};
});

const cases = fs.readFileSync(path.join(ROOT, 'evaluation/dataset_seed.jsonl'), 'utf8').trim().split(/\r?\n/).map(JSON.parse);

for (const item of cases) {
  test(`${item.case_id}: expected structured output`, () => {
    const actual = PropLead.processLead({source_channel:item.source_channel,original_text:item.message,lead_id:item.case_id}, catalogue, {reference_date:'2026-10-03'});
    const expected = item.expected;
    assert.equal(actual.language, expected.language);
    assert.equal(actual.budget_eur, expected.budget_eur);
    assert.deepEqual(actual.locations, expected.locations);
    assert.equal(actual.property_type, expected.property_type);
    assert.equal(actual.min_bedrooms, expected.min_bedrooms);
    assert.equal(actual.timeline_months, expected.timeline_months);
    assert.equal(actual.purpose, expected.purpose);
    assert.equal(actual.financing_status, expected.financing_status);
    assert.equal(actual.must_escalate, expected.must_escalate);
    assert.deepEqual(actual.matches.map(property => property.id), expected.compatible_property_ids);
    assert.equal(actual.human_review_required, true);
  });
}

test('Spanish draft never switches to English', () => {
  const actual = PropLead.processLead({source_channel:'whatsapp',original_text:'Hola, busco un apartamento en Palma con dos dormitorios y presupuesto de 600.000 euros.'}, catalogue, {reference_date:'2026-10-03'});
  assert.equal(actual.language, 'es');
  assert.match(actual.draft_reply, /^Gracias/);
  assert.doesNotMatch(actual.draft_reply, /Thank you|agent will|could you/i);
});

test('missing budget blocks matching and drafts a German clarification', () => {
  const actual = PropLead.processLead({source_channel:'email',original_text:'Ich suche eine Wohnung mit zwei Schlafzimmern in Palma.'}, catalogue, {reference_date:'2026-10-03'});
  assert.equal(actual.status, 'needs_information');
  assert.deepEqual(actual.matches, []);
  assert.match(actual.draft_reply, /^Vielen Dank/);
  assert.match(actual.draft_reply, /Budget/);
});

test('unavailable property is never returned', () => {
  const modified = catalogue.map(property => property.id === 'PM-101' ? {...property,status:'unavailable'} : property);
  const actual = PropLead.processLead({source_channel:'web_form',original_text:'Looking for a 2-bedroom apartment in Palma with a budget of €800,000.'}, modified, {reference_date:'2026-10-03'});
  assert.ok(!actual.matches.some(property => property.id === 'PM-101'));
});

test('stale property is never returned', () => {
  const modified = catalogue.map(property => property.id === 'PM-101' ? {...property,last_verified_at:'2026-01-01'} : property);
  const actual = PropLead.processLead({source_channel:'web_form',original_text:'Looking for a 2-bedroom apartment in Palma with a budget of €800,000.'}, modified, {reference_date:'2026-10-03'});
  assert.ok(!actual.matches.some(property => property.id === 'PM-101'));
});

test('conflicting budgets trigger review and no matching', () => {
  const actual = PropLead.processLead({source_channel:'manual',original_text:'I need a two-bedroom apartment in Palma. My budget is €500,000, although the maximum may be €700,000.'}, catalogue, {reference_date:'2026-10-03'});
  assert.equal(actual.priority, 'review');
  assert.equal(actual.status, 'needs_information');
  assert.ok(actual.risk_flags.includes('conflicting_budget'));
  assert.deepEqual(actual.matches, []);
});

test('vague preferences are not inferred', () => {
  const actual = PropLead.processLead({source_channel:'social',original_text:'I am looking for something nice near the sea in Palma with a budget of €700,000.'}, catalogue, {reference_date:'2026-10-03'});
  assert.equal(actual.property_type, null);
  assert.equal(actual.min_bedrooms, null);
  assert.equal(actual.status, 'needs_information');
  assert.deepEqual(actual.matches, []);
});

test('property portal input is normalised without changing the original message', () => {
  const input = {source_channel:'property_portal',source_message_id:'portal-77',original_text:'Looking for a 2-bedroom apartment in Palma with a budget of €800,000.',source_metadata:{contact_name:'Synthetic Buyer'}};
  const actual = PropLead.processLead(input, catalogue, {reference_date:'2026-10-03'});
  assert.equal(actual.source_channel, 'property_portal');
  assert.equal(actual.source_message_id, 'portal-77');
  assert.equal(actual.original_text, input.original_text);
});

test('uncertain threshold case is routed to review', () => {
  const actual = PropLead.processLead({source_channel:'email',original_text:'Perhaps I need a 2-bedroom apartment in Palma with a budget of €800,000 within three months.'}, catalogue, {reference_date:'2026-10-03'});
  assert.equal(actual.priority, 'review');
  assert.ok(actual.risk_flags.includes('uncertain_requirements'));
});

test('Spanish missing-data case gets a same-language clarification question', () => {
  const actual = PropLead.processLead({source_channel:'web_form',original_text:'Hola, busco una finca en Artà.'}, catalogue, {reference_date:'2026-10-03'});
  assert.equal(actual.status, 'needs_information');
  assert.match(actual.draft_reply, /^Gracias/);
  assert.match(actual.draft_reply, /presupuesto/);
  assert.doesNotMatch(actual.draft_reply, /Thank you|could you/i);
});
