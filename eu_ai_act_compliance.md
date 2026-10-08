# PropLead EU AI Act assessment — draft

> Preliminary capstone assessment, not legal advice. Classification must be reviewed if the intended purpose or deployment context changes.

## Intended purpose

PropLead assists a real-estate sales agent by structuring an incoming enquiry, measuring information completeness, applying explicit catalogue filters and drafting a response. It does not decide whether a person may buy or rent a property, assess creditworthiness, negotiate, provide legal advice or send a message autonomously.

## Preliminary risk classification

The current use case is **not identified as an Annex III high-risk use case** because it does not evaluate creditworthiness, employment, access to public benefits, insurance risk or another listed high-risk purpose. It remains decision-support with mandatory human review.

This conclusion must be reassessed if PropLead is extended to:

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
| Data governance | Document synthetic and pilot datasets, limitations and failure coverage |
| Accuracy | Measure by language; inspect failed cases; prohibit unsupported claims |
| Traceability | Retain input, output, version, flags and agent action for the pilot |
| Fundamental rights | Exclude protected attributes and prevent credit, legal or eligibility decisions |
| Vendor governance | Record model/provider versions, terms, subprocessors and incident routes |

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

