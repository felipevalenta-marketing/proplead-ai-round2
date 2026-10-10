# PropLead Round 2 n8n POC documentation

## Purpose

This workflow demonstrates the controlled Round 2 automation path for PropLead AI without external sending, credentials or CRM access. It keeps the Round 1 structure but adds separate `must_have_features` and `preferred_features`, deterministic escalation and final review output.

## Importable workflow

- File: `n8n/proplead_round2_poc.json`
- Workflow name: `PropLead AI — Round 2 POC`
- Regenerator: `node n8n/build_round2_poc.js`

## Node sequence

1. `Manual trigger`
2. `Simulated test inputs`
3. `Normalise intake`
4. `Multilingual structured lead extraction`
5. `Deterministic qualification and escalation`
6. `Controlled catalogue matching`
7. `Multilingual response-draft preparation`
8. `Agent review queue`

## What it proves

- Manual lead intake with synthetic test payloads.
- Channel and input normalisation.
- Multilingual extraction in English, Spanish and German.
- Separate hard requirements and soft preferences.
- Matching only against the controlled synthetic catalogue.
- Deterministic escalation when data is incomplete.
- Multilingual response drafting with UTF-8 characters preserved.
- Mandatory human review before any response is sent.

## Demo inputs

### Case 1 — Spanish enquiry with a match

Input:

> Hola, busco un apartamento en Palma con balcón y, si es posible, vistas al mar. Mi presupuesto es de 600.000 euros.

Expected output:

- `detected_language`: `es`
- `must_have_features`: `balcony`
- `preferred_features`: `sea view`
- `compatible_property_ids`: `PM-101`
- `qualification_status`: `matching_ready`
- `must_escalate`: `false`
- `human_review_required`: `true`
- `status`: `awaiting_agent_approval`

### Case 2 — German enquiry with deterministic escalation

Input:

> Ich suche eine Wohnung mit zwei Schlafzimmern in Palma.

Expected output:

- `detected_language`: `de`
- `qualification_status`: `needs_information`
- `compatible_property_ids`: empty
- `must_escalate`: `true`
- `escalation_reasons`: includes `missing_budget_eur`
- `human_review_required`: `true`
- `status`: `awaiting_agent_approval`

## Import and execution

1. Open n8n.
2. Choose **Import from file**.
3. Select `n8n/proplead_round2_poc.json`.
4. Open the `Simulated test inputs` node if you want to review or swap the demo payloads.
5. Execute the workflow from `Manual trigger`.
6. Inspect `Agent review queue` for the final review payload.

## Safety boundary

- The workflow uses documented synthetic leads and a controlled synthetic catalogue.
- It does not send email, WhatsApp or CRM messages.
- It is an importable POC only and is separate from the public browser MVP and the LangSmith evaluation targets.
