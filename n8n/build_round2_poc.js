const fs = require('node:fs');
const path = require('node:path');

const file = path.join(__dirname, 'proplead_round2_poc.json');
const workflow = JSON.parse(fs.readFileSync(file, 'utf8'));
fs.writeFileSync(file, JSON.stringify(workflow, null, 2) + '\n', 'utf8');
console.log(`Created ${workflow.name} with ${workflow.nodes.length} nodes.`);
