# PropLead Round 2 n8n POC

## What it proves

The importable workflow demonstrates the controlled automation sequence:

1. Simulated multichannel input
2. Standardised intake record
3. Multilingual field extraction
4. Missing-data and qualification gate
5. Availability-aware property matching
6. One-language response or clarification draft
7. Mandatory agent review queue

## Run the demo

1. In n8n, choose **Import from file**.
2. Select `proplead_round2_workflow.json`.
3. Open **Simulated channel input** to change the channel or message.
4. Select **Execute workflow**.
5. Inspect **Agent review queue**.

The default Spanish case should return `PM-101`, a fully Spanish draft and `human_review_required: true`.

For a missing-data demonstration, replace the message with:

> Ich suche eine Wohnung mit zwei Schlafzimmern in Palma.

The result should be `needs_information`, no matches and a German clarification draft.

## Safety boundary

This POC uses no credentials, sends no message and writes to no CRM. It demonstrates the workflow logic only. The tested browser MVP in `mvp/` contains the more complete deterministic baseline and evaluation coverage.

## Rebuild

Run:

```bash
node n8n/build_workflow.js
```
