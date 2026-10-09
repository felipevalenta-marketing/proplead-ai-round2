const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const DATASET = path.join(ROOT, 'evaluation', 'dataset_seed.jsonl');
const RUNNER = path.join(ROOT, 'evaluation', 'run_baseline_case.js');

const cases = fs.readFileSync(DATASET, 'utf8').trim().split(/\r?\n/).map(JSON.parse);

function sortedIds(ids) {
  return [...ids].sort();
}

function runBaselineCase(item) {
  const payload = JSON.stringify({message: item.message, source_channel: item.source_channel});
  const stdout = execFileSync('node', [RUNNER], {input: payload, encoding: 'utf8', cwd: ROOT});
  return JSON.parse(stdout);
}

for (const item of cases) {
  test(`${item.case_id}: compatible_property_ids match reference output`, () => {
    const actual = runBaselineCase(item);
    assert.deepEqual(sortedIds(actual.compatible_property_ids), sortedIds(item.expected.compatible_property_ids));
    assert.equal(actual.match_count, item.expected.compatible_property_ids.length);
  });
}

const failedCases = [
  ['EN-01', ['PM-101']],
  ['EN-03', ['PM-104']],
  ['ES-04', ['PM-104']],
  ['DE-01', ['PM-103']],
  ['DE-02', ['PM-105']],
];

for (const [caseId, expectedIds] of failedCases) {
  test(`${caseId}: corrected matching covers the hosted v2 failure`, () => {
    const item = cases.find(entry => entry.case_id === caseId);
    const actual = runBaselineCase(item);
    assert.deepEqual(sortedIds(actual.compatible_property_ids), expectedIds);
  });
}
