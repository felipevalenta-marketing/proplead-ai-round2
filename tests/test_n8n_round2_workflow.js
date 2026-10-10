const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const WORKFLOW_FILE = path.join(ROOT, 'n8n', 'proplead_round2_poc.json');
const workflow = JSON.parse(fs.readFileSync(WORKFLOW_FILE, 'utf8'));

function codeNode(name) {
  const node = workflow.nodes.find(entry => entry.name === name);
  if (!node) throw new Error(`Missing workflow node: ${name}`);
  return node;
}

function runNode(code, input) {
  return new Function('$json', code)(input);
}

function runWorkflow(input) {
  const stepNames = [
    'Normalise intake',
    'Multilingual structured lead extraction',
    'Deterministic qualification and escalation',
    'Controlled catalogue matching',
    'Multilingual response-draft preparation',
    'Agent review queue'
  ];

  let items = [{ json: input }];
  for (const name of stepNames) {
    const nextItems = [];
    const code = codeNode(name).parameters.jsCode;
    for (const item of items) {
      const output = runNode(code, item.json);
      for (const entry of output) nextItems.push(entry);
    }
    items = nextItems;
  }
  return items.map(item => item.json);
}

test('n8n workflow JSON round-trips cleanly', () => {
  const parsed = JSON.parse(fs.readFileSync(WORKFLOW_FILE, 'utf8'));
  const roundTripped = JSON.parse(JSON.stringify(parsed));
  assert.deepEqual(roundTripped, parsed);
  assert.equal(parsed.name, 'PropLead AI — Round 2 POC v2');
});

test('parsed workflow preserves controlled matching regex escapes', () => {
  const parsed = JSON.parse(fs.readFileSync(WORKFLOW_FILE, 'utf8'));
  const node = parsed.nodes.find(entry => entry.name === 'Controlled catalogue matching');
  assert.ok(node, 'Controlled catalogue matching node is present');
  assert.ok(node.parameters.jsCode.includes('replace(/\\s+/g'), 'regex escapes are preserved in the parsed JSON');
  assert.ok(node.parameters.jsCode.includes('Port de S\\u00f3ller'), 'catalogue matching code retains the canonical location');
});

test('Spanish regression keeps the original message and matches PM-101', () => {
  const input = {
    source_channel: 'whatsapp',
    source_message_id: 'wa-regression-es-001',
    original_message: 'Hola, busco un apartamento en Palma con balcón y preferiblemente vista al mar. Mi presupuesto es de 600000 euros.'
  };
  const [result] = runWorkflow(input);

  assert.equal(result.original_message, input.original_message);
  assert.equal(result.detected_language, 'es');
  assert.equal(result.budget_eur, 600000);
  assert.deepEqual(result.locations, ['Palma']);
  assert.equal(result.property_type, 'apartment');
  assert.deepEqual(result.must_have_features, ['balcony']);
  assert.deepEqual(result.preferred_features, ['sea view']);
  assert.deepEqual(result.compatible_property_ids, ['PM-101']);
  assert.equal(result.qualification_status, 'matching_ready');
  assert.equal(result.must_escalate, false);
  assert.equal(result.human_review_required, true);
  assert.equal(result.status, 'awaiting_agent_approval');
});

test('German missing-budget case still escalates deterministically', () => {
  const [result] = runWorkflow({
    source_channel: 'email',
    source_message_id: 'em-regression-de-001',
    original_message: 'Ich suche eine Wohnung mit zwei Schlafzimmern in Palma.'
  });

  assert.equal(result.detected_language, 'de');
  assert.equal(result.must_escalate, true);
  assert.ok(result.escalation_reasons.includes('missing_budget_eur'));
  assert.equal(result.human_review_required, true);
  assert.equal(result.status, 'awaiting_agent_approval');
});
