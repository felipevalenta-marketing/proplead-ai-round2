# n8n execution evidence — 3 October 2026

## Environment validation

The seven-node Round 2 workflow was imported into the target n8n environment and executed successfully.

## Executed scenario

- Lead ID: `demo-es-001`
- Source channel: `whatsapp`
- Language: `es`
- Budget: EUR 600,000
- Location: Palma
- Property type: apartment
- Minimum bedrooms: 2
- Qualification status: `matching_ready`
- Score: 70
- Priority: `warm`
- Confidence: `high`

## Matching output

- Property ID: `PM-101`
- Title: Palma Old Town Apartment
- Price: EUR 575,000
- Catalogue status: `available`
- Last verified: `2026-09-29`

## Human-control output

- Draft language: Spanish
- `human_review_required`: `true`
- Status: `awaiting_agent_approval`
- Allowed actions: `approve`, `edit`, `reject`, `escalate`

## Interpretation

This execution confirms that the importable workflow is compatible with the target n8n environment and that the controlled orchestration reaches the mandatory review queue. It does not demonstrate live WhatsApp, email or CRM integration. The input was synthetic, no customer data was used and no message was sent.
