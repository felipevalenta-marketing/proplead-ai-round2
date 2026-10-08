# POC upgrade plan

## Baseline to preserve

The Round 1 n8n workflow already proves the sequence:

1. Manual trigger
2. Sample enquiry
3. Extract and score lead
4. Match properties
5. Agent review queue

It remains the deterministic reference implementation and fallback demo.

## Round 2 upgrade objective

Improve the extraction and response-drafting stages without changing the validated business controls.

## Planned changes

| Area | Round 1 | Round 2 target |
|---|---|---|
| Language handling | Keyword and pattern rules | Structured multilingual extraction |
| Source channels | Source not fully specified | Normalised intake contract with explicit channel metadata |
| Field extraction | JavaScript rules | Validated structured output |
| Missing data | Rule-based checklist | Schema validation, deterministic checklist and `needs_information` gate |
| Clarification | Static missing-field note | Same-language clarification draft awaiting agent approval |
| Scoring | Deterministic | Keep unchanged and document weights |
| Matching | Deterministic catalogue filters | Run only after qualification; reject unavailable or stale listings |
| Response | Template; observed Spanish-to-English switch | Grounded whole-message draft in one language |
| Review | Queue status | Approve, edit or reject evidence screen |
| Usability | Workflow output | Focused agent screen with evidence, confidence and clear actions |
| Evaluation | Five crafted cases | Multilingual dataset and LangSmith experiment |

## Delivery steps

1. Freeze the Round 1 workflow as `baseline`.
2. Define the normalised intake contract and simulated channel examples.
3. Define and validate the lead JSON schema.
4. Implement structured extraction behind a replaceable interface.
5. Add the missing-information and qualification gate.
6. Add same-language clarification drafting for incomplete leads.
7. Reuse deterministic scoring with an edge-case review override.
8. Add matching with availability checks.
9. Add grounded reply drafting plus whole-message language validation.
10. Build a focused evidence screen with explicit approval outcomes.
11. Connect traces and dataset examples to LangSmith.
12. Compare the new extractor with the deterministic baseline.
13. Run a short usability check and record a stable demo.

## Demo acceptance checklist

- The same input produces a valid structured record.
- Missing values remain null.
- Missing critical values block matching and generate a clarification request.
- The score can be explained field by field.
- Every returned property passes the hard filters.
- Zero-match cases show no invented listing.
- The greeting, body and closing use the original language without switching.
- Unavailable or stale catalogue records are never returned.
- The workflow stops at human approval.
- A backup recording exists before the final presentation.

## Scope protection

Do not add live WhatsApp, CRM write access, autonomous sending, embeddings, vector search or deployment until the core MVP and evaluation pass. These additions do not prove the central use case and could put the final delivery at risk.
