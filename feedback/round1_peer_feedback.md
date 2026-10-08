# Round 1 peer feedback and response

## Result

- **Average peer rating:** 4.00 / 5.00
- **Direction:** KEEP PropLead, with a narrower and more controlled MVP sequence

## What peers found clear

- The conversion of an unstructured multilingual enquiry into structured lead data.
- The lead-classification use case and its potential value for a small real-estate agency.
- The overall pitch, workflow and business problem.
- The multilingual workflow fits a realistic real-estate sales process.
- Matching stated requirements to available properties can free agents to arrange viewings and promote listings.
- The POC made the proposed workflow easy to understand.
- The solution is practical and intentionally simple.

## Concerns raised

| Feedback theme | Project response |
|---|---|
| Synthetic results do not prove real-world accuracy | Keep the teacher-approved synthetic dataset for the capstone, make it more realistic, measure every claim and reserve real-world performance claims for a permissioned pilot. |
| The draft changed from Spanish to English | Add a same-language regression test and require the whole draft—not only the greeting—to match the detected language. |
| Entry channels were not sufficiently defined | Define one normalised intake contract with explicit `source_channel` metadata. Simulate web form, email, WhatsApp, property portal, social and manual entry; defer live integrations. |
| Incomplete or inconsistent data can cause incorrect classification | Add a minimum-data gate. Missing critical data produces `needs_information`; unknown preferences remain null and are not inferred. |
| The system could infer preferences | Extract only text-supported facts and score completeness, not inferred buyer suitability. |
| Recommendations may be unsuitable or unavailable | Run matching only after validation, block unavailable or stale listings and require agent approval before use. |
| Compliance may be the highest risk | Move GDPR, EU AI Act, retention, access and human-oversight work forward rather than leaving it until the end. |
| Usability and visual design need more attention | Build one focused agent review screen with visible evidence, missing fields, matches and clear approve/edit/reject actions. Test task completion, not only backend accuracy. |
| Missing information should be collected conversationally | Let the assistant draft one concise clarification question in the lead's language. An agent approves it; the MVP does not autonomously contact the lead. |
| Hot/Warm/Cold may be too rigid for edge cases | Keep the score transparent but add confidence, ambiguity flags and a `review` outcome. Borderline cases cannot be promoted by score alone. |
| Effectiveness in practice is still unproven | Treat practical effectiveness as a pilot hypothesis measured with real, permissioned enquiries and catalogue constraints. |
| Validate with real enquiries and catalogue constraints | Use realistic synthetic data for the academic evaluation; propose anonymised or consented real data only during a controlled pilot. Model availability, verification date, price, location, type and bedrooms now. |

## Refined MVP sequence

1. Capture an enquiry and its source metadata.
2. Normalise channel-specific fields into one intake contract.
3. Detect language and extract only explicitly stated requirements.
4. Validate critical fields and ask for missing information when necessary.
5. Draft a same-language clarification question for agent approval when information is missing.
6. Calculate a transparent completeness/readiness score with ambiguity and confidence indicators.
7. Allow matching only when the record passes the qualification gate.
8. Filter only current, available catalogue records.
9. Draft the complete reply in one language.
10. Stop for agent approval, editing or rejection.

## Scope decision

The use case remains **multilingual real-estate lead intake and qualification with controlled property matching**. Intake and qualification are the core proof. Property matching is a gated secondary capability, not an autonomous recommendation engine.

## Evidence to produce in Round 2

- Field-level extraction accuracy by language.
- Classification accuracy against documented deterministic criteria.
- Borderline and contradictory cases routed to `review` rather than forced into a normal priority band.
- Missing-data detection and `needs_information` recall.
- Same-language draft accuracy, including the reported Spanish-to-English failure.
- Zero inferred critical preferences.
- Zero unavailable or hard-filter-violating properties returned.
- Human approval present in every case.
- Agent usability evidence from short task-based testing.
