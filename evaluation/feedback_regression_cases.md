# Feedback-driven regression cases

These cases turn the Round 1 peer feedback into measurable Round 2 tests. They supplement the 18-case multilingual seed dataset and the new unseen-matching regressions.

Status: the final hosted hybrid structured-extraction evaluation passed, the regression cases remain in force, and mandatory human review is still required.

| ID | Scenario | Source | Expected control |
|---|---|---|---|
| REG-01 | Spanish enquiry produces a Spanish greeting but an English body | WhatsApp | Fail the draft; regenerate or escalate until greeting, body and closing are Spanish |
| REG-02 | German enquiry has location and bedrooms but no budget | Email | Set budget to null, mark `needs_information`, ask for budget and block matching |
| REG-03 | English buyer says â€œsomething nice near the seaâ€ without type or bedroom count | Social | Do not infer apartment, villa or bedroom count; request clarification |
| REG-04 | Property-portal payload contains message text plus duplicated contact metadata | Property portal | Preserve the original message, normalise metadata once and extract only message-supported preferences |
| REG-05 | A property otherwise matches but has status `unavailable` | Web form | Return no unavailable property; use zero-match or another valid listing and require review |
| REG-06 | A buyer gives two conflicting budgets in one message | Manual | Add an ambiguity flag, do not select a budget, block matching and route to review |
| REG-07 | A case scores near a Hot/Warm boundary but contains uncertain wording | Email | Do not rely on the threshold alone; expose confidence and route low-confidence output to review |
| REG-08 | A lead is missing only one critical field | Web form | Draft one concise same-language clarification question for agent approval |

## Required measurements

- Pass/fail per case and evaluator.
- Trace showing the normalised input and structured output.
- Root cause and correction for each failure.
- Confirmation that the corrected case remains in the regression set and still passes in the final hosted evaluation.
- Short usability check: an agent can identify the original evidence, correct a field and approve or reject the draft without guidance.

## New unseen-matching regressions

| Category | Initial failure pattern | Final result |
|---|---|---|
| Hosted structured-v2 matching | Five canonical cases returned empty compatible IDs in the initial run | Final hosted run reached 100% matching while keeping human review mandatory |
| Accent and apostrophe normalisation | Palma / Sóller / Artà variants were not matched reliably | All requested catalogue locations now match deterministically |
| Budget parsing | 600k, 450 mil, 1,4 millones and 1,3 Millionen were inconsistently extracted | All requested budget formats parse to the correct euro value |
| Bedroom parsing | Word-based and hyphenated bedroom phrases were missed; ranges stayed ambiguous | Definite bedroom counts are extracted and ranges still block matching |
| Feature matching | Pool, parking, sea-view, frontline, renovation and tourist-licence concepts were not treated consistently | Canonical must-have concepts now act as hard filters |
| Catalogue sync | CSV and browser catalogue could drift silently | mvp/sync_catalogue.js validates the two representations against the same material fields |
