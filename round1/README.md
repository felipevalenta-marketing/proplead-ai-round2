# Round 1 evidence index

## Objective
Document the original PropLead evidence set for the Ironhack capstone, show the KEEP decision, and connect the Round 1 baseline to the Round 2 refinement.

## Selected scope
- **Sector:** Mallorca real estate
- **Company size:** microagency with 1–9 employees
- **Selected use case:** multilingual lead qualification and property matching for buyer enquiries

## Deliverable audit

| Round 1 requirement | Status | Evidence file/path | Notes |
|---|---|---|---|
| Sector and company-size definition | Complete | `README.md`, `use_case_definition.md`, `feedback/round1_decision.md` | The scenario is documented as a Mallorca microagency with 1–9 employees. |
| Sector research, opportunities and risks | Partial | `feedback/round1_peer_feedback.md`, `poc/poc_upgrade_plan.md` | Risks and opportunities are reflected in peer feedback and the upgrade plan, but no standalone research memo was found. |
| 2–3 use cases | Partial | `use_case_definition.md` | The repository documents one primary use case and the Round 1 to Round 2 refinement; no separate multi-use-case brief was found. |
| Public or documented synthetic dataset selection and justification | Complete | `use_case_definition.md`, `pf-check-in-day-1.md` | The synthetic dataset decision and rationale are documented. |
| 4–6 stakeholder charts | Missing | None found | No chart files or chart pack were found in the repository. |
| charts_documentation.md | Missing | None found | No file named `charts_documentation.md` exists. |
| Original n8n POC and documentation | Complete | `n8n/build_workflow.js`, `n8n/execution_evidence_2026-10-03.md`, `n8n/README.md`, `poc/poc_upgrade_plan.md` | The Round 1-style workflow, execution evidence and upgrade plan are present. |
| evaluation/eval_plan.md with 3–5 criteria and at least five scored cases | Missing | None found | No file named `evaluation/eval_plan.md` exists. |
| Cost and timeline estimate | Missing | None found | No dedicated Round 1 cost/timeline estimate file was found. |
| Round 1 presentation material | Missing | None found | No Round 1 slide deck or presentation notes were found. |
| round1_decision.md with KEEP decision | Complete | `feedback/round1_decision.md` | The KEEP decision is documented explicitly. |

## Round 1 results summary
Round 1 proved the core business idea: a multilingual real-estate lead can be normalised, qualified, scored and routed to a human review queue with a transparent rules-based workflow. The Round 1 evidence also showed the limitations that drove Round 2: unclear intake channels, synthetic-only evidence, reply-language drift, inferred preferences, and the need for safer matching and compliance controls.

## Peer feedback received
The peer review scored the project **4.00 / 5.00**. Peers found the multilingual workflow, practical Mallorca real-estate fit and POC value clear. The main concerns were synthetic evidence, inconsistent reply language, undefined channel handling, incomplete data, inferred preferences, unavailable properties, usability, rigid edge-case handling and compliance.

## KEEP decision and justification
The Round 1 decision was **KEEP**. The use case remained valuable, but the scope needed tightening. Round 2 therefore keeps the real-estate industry and multilingual lead qualification use case, narrows the workflow to a safer intake-and-qualification core, and preserves mandatory human approval for every response.

## How Round 1 evolved into Round 2
Round 2 keeps the same business problem and synthetic benchmark, but strengthens the evidence chain:
- explicit intake-channel normalisation
- deterministic qualification before matching
- clearer handling of missing information
- same-language response drafts
- catalogue-bound matching controls
- stronger regression tests and evaluation evidence
- documented ROI, GDPR, EU AI Act and pilot planning

## Remaining Round 1 gaps
- No dedicated `charts_documentation.md` was found.
- No dedicated `evaluation/eval_plan.md` was found.
- No dedicated cost/timeline estimate file was found.
- No dedicated Round 1 presentation deck was found.
- The repository contains later Round 2 documents that explain the evolution, but they do not replace the missing Round 1 artifacts.
