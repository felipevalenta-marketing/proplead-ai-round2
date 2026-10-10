# PropLead ROI and risk assessment

## Executive view

PropLead's clearest near-term value is reducing repetitive lead-preparation time while improving consistency. Revenue uplift remains a pilot hypothesis and is excluded from the base ROI calculation.

## Working assumptions

These are planning assumptions for a micro real-estate agency with 1–9 employees, not measured results.

| Assumption | Value | Evidence status |
|---|---:|---|
| Agency size | 1–9 employees | Target-market assumption |
| Typical monthly buyer enquiries | 60 | Synthetic discovery assumption |
| Loaded agent cost | €25/hour | Planning assumption |
| Upfront implementation | €4,200 | Round 1 estimate |
| Monthly operating cost | €240 | Round 1 estimate |
| Leads requiring human review | 100% | MVP control |

## Monthly lead-volume scenarios

| Scenario | Leads/month | Minutes saved per lead | Hours saved/month | Labour value/month | Net after €240 cost |
|---|---:|---:|---:|---:|---:|
| Conservative | 20 | 10 | 3.3 | €83 | -€157 |
| Expected | 60 | 20 | 20.0 | €500 | €260 |
| Optimistic | 100 | 30 | 50.0 | €1,250 | €1,010 |

Formula:

> Monthly labour value = enquiries × minutes saved ÷ 60 × loaded hourly cost

The pilot must measure actual preparation time. If the measured saving is below approximately 9.6 minutes per lead, the current €240 monthly operating assumption is not justified by labour savings alone.

## Separate measured-result space

No live pilot measurements are claimed here. Any future pilot should replace the planning assumptions above with observed results, while keeping the assumptions column visible for comparison.

## Upside excluded from base ROI

- Faster first-response preparation
- More agent time for viewings and seller activity
- Better follow-up consistency
- Fewer unsuitable suggestions
- Possible additional viewings or transactions

These benefits should not be monetised until a controlled pilot provides evidence.

## Pilot KPIs

- Median preparation time per enquiry
- Agent minutes saved per lead
- Percentage of drafts requiring major edits
- Suggested-match acceptance rate
- Percentage of leads requiring clarification
- Time from enquiry receipt to approved response
- Workflow failure rate

## Risk register

| Risk | Likelihood | Impact | Control | Responsible owner | Stop condition |
|---|---|---|---|---|---|
| Fabricated buyer preference | Medium | High | Null unknowns; evidence review; regression tests | Product lead | Any repeated critical-field fabrication |
| Wrong or unavailable property | Medium | High | Hard filters; status and verification date; agent approval | Operations lead | Any unavailable listing reaches an approved draft |
| Language switch in reply | Medium | Medium | Whole-message language test | Product lead | More than 5% language failures |
| Incomplete data misclassified | Medium | High | Qualification gate and clarification draft | Operations lead | Missing critical data reaches matching |
| Bias or unfair prioritisation | Low/Medium | High | Completeness-only score; protected attributes excluded | Compliance owner | Evidence of protected-trait influence |
| Personal-data exposure | Medium | High | Minimisation, access control, retention and deletion | Privacy owner | Unauthorised access or unresolved breach |
| Overreliance by agents | Medium | Medium | Mandatory human review and visible evidence | Team manager | Agents approve without inspecting evidence |
| Weak economic case | Medium | Medium | Time study and decision gate | Agency owner | Base net monthly benefit is zero or negative |

## Pilot decision gate

Continue only if safety thresholds pass, agents can understand and correct outputs, and measured time savings support an acceptable business case. Otherwise narrow the product to multilingual intake and missing-information collection.
