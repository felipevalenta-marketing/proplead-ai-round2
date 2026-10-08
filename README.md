# PropLead â€” Ironhack Capstone Round 2

**Consultant:** Carlos Felipe Valencia  
**Scenario:** Chleo Realty Mallorca, a micro real estate agency with 1â€“9 employees  
**Decision after Round 1:** KEEP  
**Primary use case:** Multilingual lead qualification and property matching

## Round 2 objective

Upgrade the transparent Round 1 proof of concept into a reliable MVP that normalises one multilingual enquiry, creates a structured lead, identifies missing information and calculates a transparent score. Property matching runs only after qualification, and every single-language draft stops for mandatory human approval.

## Smallest MVP

One free-text enquiry enters the system. The MVP:

1. Identifies English, German or Spanish.
2. Extracts only explicitly stated buyer requirements.
3. Keeps unknown values empty.
4. Calculates a deterministic readiness score.
5. Uses confidence and ambiguity flags to route edge cases to review.
6. Drafts an agent-approved clarification question when critical information is missing.
7. Matches up to three current, available properties from an authorised catalogue.
8. Drafts the complete response in the buyer's language.
9. Stops at an agent approval gate.

## Current status

- Round 1 decision documented as KEEP.
- Round 2 use-case definition completed.
- MVP architecture and data contract drafted.
- The browser MVP is implemented.
- The seven-node n8n workflow was imported and executed successfully.
- The 18-case multilingual dataset was created and validated.
- Both LangSmith experiments were executed.
- The structured OpenAI experiment achieved 100% language accuracy, 100% mandatory human-review compliance, 94.4% no-critical-fabrication performance, 92.4% explicit-field accuracy and 61.1% escalation accuracy.
- Current improvement priorities are unseen-query property matching and deterministic escalation.
- Synthetic data is documented, and no response is sent without human approval.
- Round 1 peer feedback (4.00 / 5.00) translated into scope, controls and regression criteria.

## Important implementation boundary

The Round 1 n8n workflow and browser demo remain the validated baseline. LLM extraction, LangSmith tracing and production integrations are planned Round 2 work and must not be described as implemented until they run successfully.

The project uses synthetic data only for evaluation and documentation purposes, and every generated response waits for human approval before being sent.

PropLead is developed independently. Code, tests, architecture and documentation from unrelated Ironhack labs or repositories are not part of this capstone and will not be reused or reported as PropLead work.

## Folder structure

```text
architecture/               MVP architecture and lead schema
data/                       Fictional Round 2 property catalogue with availability metadata
evaluation/                 LangSmith plan and synthetic dataset
feedback/                   Round 1 decision and peer-feedback response
mvp/                        Working offline agent-review MVP
n8n/                        Importable Round 2 POC and instructions
poc/                        POC upgrade plan
review/                     Progress-review guide and checkpoint deck
tests/                      Automated multilingual and regression tests
use_case_definition.md      Round 1 to Round 2 evolution
round2_project_plan.md      Delivery roadmap and checklist
pf-check-in-day-1.md        Daily progress record
pf-check-in-day-2.md        MVP implementation progress record
```

## Dataset validation

Run:

```bash
python evaluation/validate_dataset.py
```

The validator checks JSON syntax, required reference fields, catalogue IDs and expected hard-filter compatibility.

Run the MVP test suite and baseline:

```bash
node --test tests/test_core.js
node evaluation/run_baseline.js
```

Open `mvp/index.html` for the visual demo.
