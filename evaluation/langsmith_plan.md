# LangSmith evaluation plan

## Purpose

Evaluate whether PropLead can transform multilingual buyer messages into accurate, grounded and reviewable lead records. The experiment must test the system's behaviour, not only whether the workflow runs.

## Dataset

The seed dataset contains 18 synthetic cases:

- 6 English
- 6 German
- 6 Spanish
- Complete and incomplete enquiries
- Ambiguous wording and spelling variation
- Zero-match cases
- Legal or mortgage-advice requests
- Mixed-language input

Eight feedback-driven regression scenarios are documented separately in `feedback_regression_cases.md`, including the observed language switch, missing budget, vague preferences, channel normalisation, unavailable inventory, contradictory values, threshold edge cases and clarification drafting.

No real names, email addresses, phone numbers or client messages are included.

## Teaching-staff confirmation

On 29 September 2026, teaching staff confirmed: **“Well documented synthetic is good enough.”** The evaluation can therefore proceed with synthetic data, provided that its origin, coverage, expected outputs and limitations remain explicit.

This confirmation does not remove the need to test representative failure modes or disclose that the dataset cannot prove real-world conversion performance.

Peer feedback specifically noted that synthetic results do not prove real-world classification or matching accuracy. The Round 2 report will therefore separate **synthetic benchmark results** from **pilot evidence** and will not generalise benchmark scores to live customers.

## Experiment inputs

- `case_id`
- `message`
- `source_channel`

## Reference outputs

- Expected language
- Expected explicit fields
- Expected missing fields
- Expected escalation status
- Expected property IDs or expected zero matches
- Expected human-review requirement

## Evaluators

| Evaluator | Method | Pass condition |
|---|---|---|
| Schema validity | Programmatic | Required keys and valid types |
| Language | Exact match | Predicted language equals reference |
| Numeric extraction | Programmatic | Budget, bedrooms and timeline equal reference when stated |
| No fabrication | Programmatic | Null reference fields remain null unless supported by text |
| Matching constraints | Programmatic | Every returned listing passes explicit hard filters |
| Qualification gate | Programmatic | Missing critical fields block property matching and produce `needs_information` |
| Availability freshness | Programmatic | No unavailable or stale catalogue record is returned |
| Expected match | Set comparison | Returned IDs contain the reference compatible IDs within top 3 |
| Escalation | Exact match | Legal, ambiguous and zero-match cases route to review |
| Edge-case override | Programmatic | Contradictory or low-confidence cases receive `priority: review`, independent of numeric band |
| Human gate | Exact match | `human_review_required` is always true |
| Reply language | Language detector or rubric | Greeting, body and closing all use the input language |
| Language consistency | Segment-level check | No mid-message switch to another language |
| Grounded response | Rubric | Reply mentions only validated facts and returned properties |
| Clarification quality | Rubric | Question is concise, same-language and asks only for genuinely missing critical information |

## Success thresholds

| Metric | Threshold |
|---|---:|
| Valid schema | 100% |
| Language accuracy | ≥95% |
| Explicit-field accuracy | ≥90% |
| Critical-field fabrication | 0 cases |
| Hard-filter violations | 0 returned properties |
| Required escalation recall | 100% |
| Human approval gate | 100% |
| Reply-language accuracy | ≥95% |
| Whole-draft language consistency | 100% |
| Missing-data gate recall | 100% |
| Edge-case review recall | 100% |
| Unavailable or stale listings returned | 0 |

## Comparison design

Run at least two experiment configurations against the same dataset:

1. `baseline_rules_v1`: the Round 1 deterministic extraction baseline.
2. `structured_extractor_v1`: the Round 2 structured extraction configuration.

Compare aggregate results and inspect every failed case. Do not promote the new extractor if it performs worse on fabrication, hard-filter matching or escalation.

The regression set must include the observed failure in which a Spanish greeting was followed by an English body, plus incomplete enquiries from multiple source channels and cases where preferences must remain null rather than inferred.

Backend evaluation will be supplemented by a short usability check with representative agent tasks: verify extracted evidence, correct one field, inspect a match and approve, edit or reject a draft. This is formative usability evidence, not a statistically representative study.

## Failure review template

For every failed case, record:

- Case ID
- Expected output
- Actual output
- Evaluator that failed
- Root cause
- Correction
- Regression test added

## Required evidence for submission

- Dataset name and version
- Experiment names and timestamps
- Evaluator definitions
- Aggregate results
- At least three inspected traces
- Failure analysis
- Decision to keep, revise or reject the tested configuration

This document is the experiment design. Actual LangSmith results must be added only after a real experiment is executed.
