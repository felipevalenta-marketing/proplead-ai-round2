# PropLead AI — Ironhack Capstone Round 2

**Consultant:** Carlos Felipe Valencia  
**Scenario:** Chleo Realty Mallorca, a micro real-estate agency with 1–9 employees
**Decision after Round 1:** KEEP  
**Primary use case:** Multilingual lead qualification and property matching

## Round 2 objective

Round 2 keeps the same capstone use case but narrows the scope to a controlled multilingual lead workflow, deterministic catalogue matching and mandatory human approval. The project documents the synthetic dataset, the review-gated browser MVP, the importable n8n POC and the final LangSmith hybrid-v2 evaluation.

## Final submission status

- The public browser MVP is deployed at <https://proplead-ai-round2-mvp.vercel.app/>.
- The browser MVP is deterministic, catalogue-bound and requires human review before any response is sent.
- The final n8n POC is importable as `n8n/proplead_round2_poc.json` and contains 8 nodes including the Manual Trigger.
- The final hosted LangSmith experiment is `structured_extractor_v2-d2454c34` with 18/18 successful runs.
- Final hosted metrics: matching 100%, escalation 100%, human-review gate 100%, language 100%, explicit-field accuracy 93.0556% and no-critical-fabrication 94.4444%.
- The current documentation promotes `hybrid_policy_v2` as the evaluation candidate while keeping mandatory human review.
- The final presentation package is complete: [content](presentation/final_presentation_content.md), [runbook](presentation/demo_runbook.md), [PowerPoint](presentation/PropLead_AI_Final_Presentation.pptx).
- The demo recording is still pending and no public recording URL is documented yet.
- The final pitch rehearsal is still pending.
- Synthetic data is documented throughout the repository, and no response is sent automatically.

## Key deliverables

- [Use case definition](use_case_definition.md)
- [POC documentation](poc_documentation.md)
- [MVP documentation](mvp_documentation.md)
- [LangSmith evaluation](evaluation/langsmith.md)
- [ROI and risk assessment](roi_risk_assessment.md)
- [EU AI Act compliance draft](eu_ai_act_compliance.md)
- [GDPR documentation](gdpr_documentation.md)
- [Strategic plan](strategic_plan.md)
- [Round 2 project plan](round2_project_plan.md)
- [Final presentation content](presentation/final_presentation_content.md)
- [Demo runbook](presentation/demo_runbook.md)
- [Round 1 evidence index](round1/README.md)

## Evaluation snapshot

### Deterministic browser baseline

The browser MVP and deterministic catalogue baseline achieve the documented synthetic benchmark on the current dataset:

- Explicit-field accuracy: 100%
- Language accuracy: 100%
- Exact expected matching: 100%
- Escalation accuracy: 100%
- Human-review gate: 100%

### Final hosted LangSmith hybrid v2

The final hosted run is recorded in [`evaluation/langsmith.md`](evaluation/langsmith.md):

- Experiment: `structured_extractor_v2-d2454c34`
- Runs: 18/18 successful
- Matching correctness: 100%
- Escalation correctness: 100%
- Human-review gate: 100%
- Language correctness: 100%
- Explicit-field accuracy: 93.0556%
- No-critical-fabrication: 94.4444%
- Average latency: 1.5378 seconds
- Total tokens: 7,753
- Total cost: USD 0.01120725

## Implementation boundary

The public browser MVP, the n8n proof of concept and the hosted LangSmith evaluation are separate components. The browser MVP is deterministic. The n8n workflow demonstrates an operational review-gated pipeline. The LangSmith run evaluates the OpenAI-backed hybrid extractor separately.

The project uses synthetic data for development, evaluation and presentation. Real customer messages, private credentials and automatic outbound messaging are out of scope for this repository snapshot.

## Folder structure

```text
architecture/               MVP architecture and lead schema
data/                       Fictional Round 2 property catalogue with availability metadata
evaluation/                 LangSmith plan and synthetic dataset
feedback/                   Round 1 decision and peer-feedback response
round1/                     Round 1 evidence index
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

## Validation

Run the core validators and tests with:

```bash
python evaluation/validate_dataset.py
node --test tests/test_core.js
node evaluation/run_baseline.js
```

## Notes

- The Round 1 evidence archive is in `round1/README.md`.
- The public MVP URL is included above for the final submission.
- No automatic customer response is sent from any public-facing artifact.
