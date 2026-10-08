const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const input = JSON.parse(fs.readFileSync(0, 'utf8'));
const app = require(path.join(__dirname, '..', 'mvp', 'app.js'));
const catalogueCode = fs.readFileSync(path.join(__dirname, '..', 'mvp', 'catalogue.js'), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(catalogueCode, sandbox);
const result = app.processLead(
  { source_channel: input.source_channel, original_text: input.message },
  sandbox.window.PROPLEAD_CATALOGUE,
  { now: '2026-10-03', freshnessDays: 30 }
);

process.stdout.write(JSON.stringify({
  language: result.language,
  budget_eur: result.budget_eur,
  locations: result.locations,
  property_type: result.property_type,
  min_bedrooms: result.min_bedrooms,
  timeline_months: result.timeline_months,
  purpose: result.purpose,
  financing_status: result.financing_status,
  must_escalate: result.must_escalate,
  compatible_property_ids: result.matches.map(item => item.id),
  human_review_required: result.human_review_required
}));

