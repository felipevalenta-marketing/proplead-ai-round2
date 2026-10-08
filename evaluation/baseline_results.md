# PropLead deterministic baseline results

**Run:** `baseline_rules_v2`  
**Date:** 2026-10-03  
**Dataset:** 18 documented synthetic enquiries (6 English, 6 German, 6 Spanish)

## Results

| Metric | Result | Round 2 target |
|---|---:|---:|
| Cases executed | 18 | 18 |
| Explicit-field accuracy | 100% | ≥90% |
| Language accuracy | 100% | ≥95% |
| Exact expected matching | 100% | Measured baseline |
| Escalation accuracy | 100% | 100% |
| Human-review gate | 100% | 100% |

## Interpretation

The deterministic Round 2 baseline passes the current controlled dataset and provides a reproducible reference for the future structured-LLM experiment. These results show behaviour on the documented synthetic cases only. They do not demonstrate performance on live enquiries or real conversion impact.

## Additional regression coverage

The automated test suite also checks the Spanish-to-English reply failure, missing-data clarification, unavailable and stale listings, conflicting budgets, vague preferences, property-portal normalisation and uncertain edge cases.

## Next experiment

Run the same cases through `structured_extractor_v1` in LangSmith, compare it with this baseline, inspect every failed trace and retain the deterministic safety controls.
