# PropLead Round 2 POC documentation

## Purpose

The POC demonstrates how one multilingual property enquiry moves from a simulated channel to a structured, reviewable agent queue. It proves workflow feasibility without credentials, external sending or CRM access.

## Implemented workflow

1. Accept a synthetic enquiry with channel metadata.
2. Normalise WhatsApp, email, web form, property portal, social or manual input to one contract.
3. Detect English, German or Spanish.
4. Extract only text-supported requirements.
5. Identify missing, conflicting or uncertain data.
6. Calculate a deterministic completeness/readiness score.
7. Block matching when the minimum qualification gate is not met.
8. Filter only available and recently verified catalogue properties.
9. Draft a complete response or clarification question in one language.
10. Stop in an agent queue with approve, edit, reject and escalate actions.

## POC artifacts

| Artifact | Purpose | Current status |
|---|---|---|
| `n8n/proplead_round2_workflow.json` | Importable seven-node automation workflow | Imported and executed successfully in the target n8n environment on 3 October 2026 |
| `n8n/README.md` | Import and demo instructions | Complete |
| `mvp/index.html` | Visual agent-review demonstration | Working offline |
| `mvp/app.js` | Testable deterministic workflow engine | Working |
| `tests/test_core.js` | Dataset and feedback regressions | 27/27 passing |

## n8n node sequence

1. **Manual trigger**
2. **Simulated channel input**
3. **Normalise intake**
4. **Extract and qualify**
5. **Qualification gate and matching**
6. **Single-language draft**
7. **Agent review queue**

## Recommended live demo

### Case A — Qualified Spanish lead

Use the default n8n case or select **Qualified · ES** in the browser MVP.

Expected evidence:

- Language: Spanish
- Budget: €300,000 or €600,000, depending on the selected sample
- Structured requirements
- Available property match
- Fully Spanish draft
- `human_review_required: true`

### Case B — Missing budget in German

Use:

> Ich suche eine Wohnung mit zwei Schlafzimmern in Palma.

Expected evidence:

- Language: German
- Status: `needs_information`
- No matching performed
- German clarification question
- No automatic sending

### Case C — Mixed-language edge case

Use the **Mixed language** browser sample.

Expected evidence:

- The explicit requirements are still extracted.
- `mixed_language` appears as a review flag.
- Priority is overridden to `review`.
- The complete draft remains Spanish.

## Validation completed

- n8n workflow JSON parses correctly.
- All six n8n code nodes compile.
- The default n8n path was executed locally in sequence and returned `PM-101`, a Spanish draft and the approval gate.
- The workflow was imported into the target n8n environment and executed successfully on 3 October 2026.
- The final `Agent review queue` output returned `PM-101`, `human_review_required: true`, `status: awaiting_agent_approval` and the actions `approve`, `edit`, `reject` and `escalate`.
- The browser engine passes 27 automated tests.

## Honest limitation

The n8n environment compatibility has now been confirmed. No claim is made that live WhatsApp, email, CRM or LangSmith integrations are implemented; the successful execution used a synthetic simulated channel payload and did not send or persist customer data.
