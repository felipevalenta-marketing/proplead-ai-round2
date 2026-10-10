# PropLead EU AI Act assessment — draft

> Preliminary capstone assessment, not legal advice. This document does not claim full legal compliance.

## Intended purpose

PropLead assists a real-estate sales agent by structuring an incoming enquiry, measuring information completeness, applying explicit catalogue filters and drafting a response. It does not decide whether a person may buy or rent a property, assess creditworthiness, negotiate, provide legal advice or send a message autonomously.

## Likely risk classification

The current use case is best treated as a **decision-support system with mandatory human oversight**, not as an autonomous decision-maker. On the current facts, it does not look like an Annex III high-risk use case because it does not evaluate creditworthiness, employment, public-benefit access, insurance risk or another listed high-risk purpose.

That assessment must be revisited if PropLead is extended to:

- tenant eligibility or applicant ranking;
- creditworthiness or mortgage decisions;
- autonomous acceptance or rejection;
- protected-trait profiling;
- access decisions with significant effects.

## Relevant obligations and controls

| Area | Project response |
|---|---|
| AI literacy | Train agents on limits, verification and escalation before pilot use |
| Transparency | If a buyer directly interacts with an AI assistant, disclose that it is AI; agent-reviewed drafts must not imply autonomous professional advice |
| Human oversight | All responses stop for approve, edit, reject or escalate |
| Logging | Retain input, output, version, flags and agent action for the pilot |
| Accuracy | Measure by language; inspect failed cases; prohibit unsupported claims |
| Data governance | Document synthetic and pilot datasets, limitations and failure coverage |
| Traceability | Keep trace identifiers, model versions and review actions |
| Vendor governance | Record model/provider versions, terms, subprocessors and incident routes |

## Limitations and actions before production

PropLead is not ready for production use. Before any live deployment, the agency must:

- confirm the final intended purpose;
- complete a formal legal review of classification and transparency duties;
- lock the human-oversight workflow;
- test the logging and retention setup;
- document model, dataset and vendor change control;
- review whether the final scope changes the risk classification.

## Prohibited-use guardrails

PropLead must not:

- manipulate or exploit vulnerable people;
- perform social scoring;
- infer sensitive traits for ranking;
- use emotion recognition;
- autonomously deny access to a property or service;
- present legal, tax or mortgage guarantees as professional advice.

## Transparency notice for a future buyer-facing assistant

> You are interacting with an AI-assisted property enquiry service. Your message will be reviewed by a real-estate agent before any recommendation or response is finalised.

## Current evidence

- Human-review gate in 100% of the 18 benchmark cases.
- Deterministic score breakdown.
- Protected attributes excluded from the schema.
- Missing and ambiguous information routed to review.
- Availability and hard-filter checks.
- Synthetic data origin and limitations documented.

## Remaining actions before pilot

- Confirm provider/deployer roles.
- Complete AI literacy training record.
- Approve buyer-facing transparency wording.
- Complete vendor and subprocessor review.
- Define incident and corrective-action process.
- Reassess classification after final architecture and intended purpose are frozen.

## Official sources checked

- European Commission, *AI Act — risk-based approach and application timeline*: https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
- European Commission, *Enforcement framework*: https://digital-strategy.ec.europa.eu/en/policies/enforcement-ai-act
- Consolidated Regulation (EU) 2024/1689, current version dated 27 July 2026: https://eur-lex.europa.eu/eli/reg/2024/1689/2026-07-27/eng

As of the current project date, the Commission states that the AI Act generally became applicable on 2 August 2026, including relevant transparency rules; Annex III high-risk rules apply from 2 December 2027 under the amended timeline.
