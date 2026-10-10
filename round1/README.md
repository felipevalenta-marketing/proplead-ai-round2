# Round 1 evidence index

## Purpose
This index points to the authentic Round 1 project archive copied into `round1/original_submission/`. It separates the original student submission from the later Round 1 retrospective notes and the Round 2 materials in the repository root.

## Round 1 scope
- **Sector:** Mallorca real estate
- **Company size:** microagency with 1–9 employees
- **Primary use case:** multilingual lead qualification and property matching for buyer enquiries
- **Decision:** KEEP

## Authentic archive location
- `round1/original_submission/`

## Deliverable audit

| Round 1 requirement | Status | Original evidence path | Notes |
|---|---|---|---|
| Sector and company-size definition | Complete | `round1/original_submission/README.md` | The archive states a Mallorca microagency with five employees and a 1–9 employee profile. |
| Sector research, opportunities and risks | Complete | `round1/original_submission/research/sector_research.md`, `round1/original_submission/research/opportunities_risks.md` | Both market context and risks/opportunities are documented in the archive. |
| 2–3 use cases | Complete | `round1/original_submission/research/use_cases.md` | The archive includes a prioritised use-case table and the selected use case. |
| Public or documented synthetic dataset selection and justification | Complete | `round1/original_submission/README.md`, `round1/original_submission/data/baseline_metrics.csv`, `round1/original_submission/data/properties.csv` | The archive uses a documented synthetic dataset and explains the choice. |
| 4–6 stakeholder charts | Complete | `round1/original_submission/presentation/PropLead_AI_Round1_Carlos_Felipe_Valencia_PERSONALIZED.pptx`, `round1/original_submission/charts/charts_documentation.md` | The deck contains five chart slides and the chart documentation explains them. |
| `charts_documentation.md` | Complete | `round1/original_submission/charts/charts_documentation.md` | Present in the archive. |
| Original n8n POC and documentation | Complete | `round1/original_submission/n8n/proplead_round1_workflow.json`, `round1/original_submission/n8n/workflow_documentation.md`, `round1/original_submission/poc/proplead_demo.html` | The Round 1 POC workflow and documentation are present. |
| `evaluation/eval_plan.md` with 3–5 criteria and at least five scored cases | Complete | `round1/original_submission/evaluation/eval_plan.md` | The evaluation plan includes five scored cases and pass/fail criteria. |
| Cost and timeline estimate | Complete | `round1/original_submission/cost_estimation/cost_analysis.md`, `round1/original_submission/cost_estimation/timeline_estimate.md` | Both cost and timeline artifacts are in the archive. |
| Round 1 presentation material | Complete | `round1/original_submission/presentation/Presentation_Checklist.md`, `round1/original_submission/presentation/PropLead_AI_Round1_Carlos_Felipe_Valencia_PERSONALIZED.pptx`, `round1/original_submission/presentation/PropLead_AI_Round1_Pitch_Script.md`, `round1/original_submission/presentation/PropLead_AI_Round1_Pitch_Script_PERSONALIZED.md` | The original deck and presentation script are present. |
| `round1_decision.md` with KEEP decision | Complete | `round1/original_submission/feedback/round1_decision.md` | The KEEP decision is explicit in the archive. |

## Round 1 results summary
Round 1 proved that the core idea is viable: a multilingual buyer enquiry can be normalised, scored, matched against a controlled catalogue and routed to human review with a transparent rules-based workflow. The archive also shows why Round 2 was needed: tighter intake definitions, safer matching controls, clearer documentation, and stronger evidence for compliance and evaluation.

## Peer feedback received
The Round 1 presentation received an average peer score of **4.00 / 5.00**. The feedback supported the concept but highlighted risks around synthetic evidence, language drift, unclear intake channels, incomplete data, inferred preferences, unavailable properties, usability, edge-case handling and compliance.

## KEEP decision and justification
The KEEP decision preserved the use case but narrowed the implementation. The Round 1 archive supports the same industry and business problem while showing that the MVP needed stricter qualification, explicit channel normalisation and mandatory human approval. That became the basis for Round 2.

## How Round 1 evolved into Round 2
Round 2 keeps the same core use case but strengthens the evidence chain:
- explicit intake-channel normalisation
- deterministic qualification before matching
- clearer handling of missing information
- same-language response drafts
- catalogue-bound matching controls
- stronger regression tests and evaluation evidence
- documented ROI, GDPR, EU AI Act and pilot planning

## Retrospective documents kept separate
These files are useful for explaining the transition, but they are not part of the original Round 1 archive:
- `feedback/round1_decision.md`
- `feedback/round1_peer_feedback.md`
- this file: `round1/README.md`
- Round 2 documentation in the repository root

## Remaining gaps
No core Round 1 deliverables are missing from the archive copy in `round1/original_submission/`. The only gap is that the original submission appears as a single archived package rather than a live, separately published Round 1 repository.
