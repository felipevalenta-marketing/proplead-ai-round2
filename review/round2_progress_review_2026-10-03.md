# PropLead Round 2 — progress review

## One-sentence update

PropLead has moved from a Round 1 concept into a working, testable MVP that standardises multilingual enquiries, qualifies missing information, controls property matching and stops every response for human approval.

## What to show in five minutes

### 1. Start with the feedback response — 45 seconds

> After Round 1, I kept the same use case but narrowed the core. Intake and qualification now come first, and property matching only runs after a quality gate. I also addressed the unclear entry channels, the Spanish-to-English draft error, unavailable properties and edge cases that do not fit a simple Hot/Warm/Cold classification.

Show `feedback/round1_peer_feedback.md` briefly.

### 2. Demo the working MVP — 2 minutes

Open `mvp/index.html`.

1. Run **Qualified · ES**.
2. Point out the normalised source channel.
3. Show extracted fields, score and confidence.
4. Show the verified property match.
5. Read the Spanish draft and show the approval actions.
6. Run **Missing budget · DE**.
7. Show that matching is blocked and a German clarification question is drafted.

Key line:

> The system assists the agent; it does not send, approve or reject anything by itself.

### 3. Show n8n — 45 seconds

Import `n8n/proplead_round2_workflow.json` if the environment is available. Otherwise show the seven-node sequence in `poc_documentation.md`.

Key line:

> The n8n POC mirrors the controlled workflow, while the browser MVP is the more complete and automated-testable implementation.

### 4. Show evidence — 45 seconds

Open `evaluation/baseline_results.md`.

> I ran 18 synthetic cases across English, German and Spanish. The current deterministic baseline reached 100% on the controlled dataset, and the complete suite has 27 passing tests. I am not presenting this as real-world accuracy; it is the benchmark that the future LangSmith LLM experiment must equal or improve without introducing safety failures.

### 5. Close with next steps — 45 seconds

> The next priority is to port the dataset to LangSmith, run a structured LLM extractor against the same cases and inspect failed traces. In parallel, I have drafted the ROI, GDPR, EU AI Act and 30-day pilot documents. Live channels and automatic sending remain out of scope.

## Evidence ready today

- Working browser MVP
- Importable seven-node n8n workflow
- 18-case multilingual dataset
- 27/27 automated tests
- Baseline metrics report
- POC and MVP documentation
- ROI and risk assessment
- GDPR draft
- EU AI Act draft
- 30-day pilot strategy

## Be precise if asked

**Is the data real?**  
No. It is realistic, documented synthetic data accepted for the capstone. Real accuracy requires a permissioned pilot.

**Is the LLM implemented?**  
Not yet. The current working MVP is the deterministic baseline. The structured LLM version and LangSmith comparison are the next experiment.

**Does it connect to WhatsApp?**  
Not live. The MVP standardises simulated channel payloads. Live integration follows only after the core evaluation and compliance gates pass.

**Can it send replies?**  
No. Every draft requires an agent action, and the MVP has no sending integration.

**Why keep deterministic rules?**  
They make scoring, qualification and matching inspectable, reproducible and suitable as a safety baseline for the LLM comparison.

