# Final Presentation Content — PropLead AI

## 1) PropLead AI and the business problem

**Slide title:** PropLead AI for a Mallorca microagency

**On-slide content:**
- Multilingual real-estate lead qualification for a small Mallorca agency
- Turns one enquiry into a structured, reviewable lead record
- Helps agents identify missing data, likely matches and response readiness
- Mandatory human approval before any customer reply

**Recommended visual or screenshot:**
- Full-screen screenshot of the live browser MVP review panel with a sample lead

**Speaker notes:**
PropLead AI solves a practical agency problem. A small Mallorca team receives enquiries in English, German and Spanish, often with incomplete details. The workflow helps the agent understand the request, check if the lead is ready, and prepare a safer reply. The important point is that the system supports the agent. It does not replace the agent.

**What to show on screen:**
- The browser MVP home screen or a filled lead review example

**Approx. speaking time:** 45–55 seconds

## 2) Round 1 feedback and what changed

**Slide title:** What changed after Round 1

**On-slide content:**
- Kept the same real-estate lead use case
- Narrowed the scope to multilingual intake, qualification and controlled matching
- Added clearer channels, stricter gates and stronger documentation
- Preserved mandatory human review

**Recommended visual or screenshot:**
- `use_case_definition.md` or a short before/after summary slide

**Speaker notes:**
Round 1 feedback did not kill the idea. It sharpened it. The project kept the same use case, but narrowed the scope so the evidence is clearer and the risks are lower. The biggest changes were stronger intake rules, clearer qualification logic, synthetic data documentation and a human approval gate on every response.

**What to show on screen:**
- `use_case_definition.md` open beside `round2_project_plan.md`

**Approx. speaking time:** 50–60 seconds

## 3) Final MVP scope

**Slide title:** What the final MVP actually does

**On-slide content:**
- Accepts simulated, standardised lead sources
- Detects English, German or Spanish
- Extracts budget, location, property type, bedrooms and key preferences
- Matches only against the fixed catalogue
- Prepares a draft for agent approval; no automatic sending

**Recommended visual or screenshot:**
- `presentation/assets/mvp_live_demo.png` placed on the MVP slide, plus the review panel and approval controls

**Speaker notes:**
The browser MVP is deterministic and local. It uses synthetic property data and a fixed catalogue. Its job is to structure the lead, identify missing information, and suggest catalogue-bound matches. It does not send customer messages automatically. That final approval always stays with the agent.

**What to show on screen:**
- Browser MVP with a selected multilingual enquiry and the review panel

**Approx. speaking time:** 55–65 seconds

## 4) Lead-intake and decision-support workflow

**Slide title:** Lead intake, matching and review

**On-slide content:**
- Simulated intake sources: web form, email, WhatsApp, portal, social and manual
- Qualification gate before matching
- Catalogue-bound matching with availability checks
- Draft response stays in the lead language
- Every case ends in human review

**Recommended visual or screenshot:**
- Workflow diagram from `mvp_documentation.md` or `architecture/mvp_architecture.md`

**Speaker notes:**
The workflow is built around decision support. It normalises the incoming message, extracts only supported facts and applies a qualification gate. If the lead is not ready, the system asks for the missing information. If the lead is ready, it uses controlled catalogue matching. The reply is drafted in the same language as the lead and then waits for approval.

**What to show on screen:**
- The browser MVP fields and the approval buttons

**Approx. speaking time:** 60–70 seconds

## 5) Live MVP demonstration

**Slide title:** Browser MVP demo

**On-slide content:**
- Realistic synthetic enquiry
- Deterministic extraction
- Catalogue-bound matches
- Human approval required
- No automatic customer message

**Recommended visual or screenshot:**
- Live `https://proplead-ai-round2-mvp.vercel.app/`

**Speaker notes:**
This is the public MVP demo. It shows the practical workflow without any live API dependency in the browser experience. The data is documented synthetic data, so the demo is safe for the capstone. I will enter one multilingual enquiry, show the extracted fields, the match result and the review state.

**What to show on screen:**
- The deployed MVP URL, then the matched lead panel

**Approx. speaking time:** 75–90 seconds

## 6) Browser MVP

**Slide title:** Browser MVP

**On-slide content:**
- Deterministic public browser MVP
- Catalogued matches only from the synthetic property set
- Human review required before any reply is sent
- Uses the same multilingual lead structure as the rest of the project

**Recommended visual or screenshot:**
- `presentation/assets/mvp_live_demo.png` showing the live browser interface

**Speaker notes:**
This is the public browser MVP. It is deterministic, catalogue-bound and review-gated. It does not call OpenAI in the browser flow. The goal is to show the safe end-user experience: standardised intake, structured lead handling, a controlled property match and mandatory human approval.

**What to show on screen:**
- The live MVP URL and the browser review panel

**Approx. speaking time:** 45?55 seconds

## 7) n8n operational POC

**Slide title:** n8n operational POC

**On-slide content:**
- Imported eight-node workflow, including the Manual Trigger
- Executed successfully in the target n8n environment
- Demonstrates the operational path with simulated inputs
- Preserves both Spanish and German test cases end to end

**Recommended visual or screenshot:**
- `presentation/assets/n8n_workflow_success.png` with the Spanish and German result screenshots beside it

**Speaker notes:**
The n8n proof of concept shows the operational flow. It is separate from the browser MVP and separate from the LangSmith extractor evaluation. It demonstrates that the eight-node workflow can run in n8n, but it does not mean live integrations are finished.

**What to show on screen:**
- `presentation/assets/n8n_workflow_success.png`, `presentation/assets/n8n_spanish_result.png`, and `presentation/assets/n8n_german_escalation.png`

**Approx. speaking time:** 55?65 seconds

## 8) Hybrid v2 evaluation results

**Slide title:** Hybrid v2 evaluation results

**On-slide content:**
- Baseline v1: `structured_extractor_v1-fd0b3bae`
- Final hybrid v2: `structured_extractor_v2-d2454c34`
- 18/18 successful runs
- v1 exposed escalation weakness
- v2 achieved 100% matching, 100% escalation, 100% human gate and 100% language correctness
- v2 also records 93.0556% explicit-field accuracy and 94.4444% no-critical-fabrication

**Recommended visual or screenshot:**
- `evaluation/langsmith.md` and `presentation/assets/langsmith_v2_results.png`

**Speaker notes:**
The LangSmith evidence matters because it separates the extraction experiment from the browser MVP. The v1 run was useful as a baseline, but it showed weak escalation. The final hybrid v2 run fixed the matching path and delivered the best documented result in the repository: perfect matching, perfect escalation, perfect human-review gating and perfect language correctness. The run also records 93.0556% explicit-field accuracy and 94.4444% no-critical-fabrication. The remaining gap is explicit-field accuracy, which is good but not perfect.

**What to show on screen:**
- `evaluation/langsmith.md` with the final structured v2 section visible

**Approx. speaking time:** 75?90 seconds

## 9) Value case for a microagency

**Slide title:** Value case for a microagency

**On-slide content:**
- Assumption: 1?9 employees, about 60 enquiries/month
- Loaded labour cost: ?25/hour
- Implementation: ?4,200; operating cost: ?240/month
- ROI depends on measured time saved per lead
- Human review, logging and data controls reduce operational and compliance risk

**Recommended visual or screenshot:**
- `roi_risk_assessment.md` scenario table and control sections

**Speaker notes:**
The ROI section is a planning model, not a measured business result. It assumes a small agency and compares conservative, expected and optimistic scenarios. The key point is that the system only makes sense if it saves real agent time. The repository explicitly keeps assumptions separate from measured results.

**What to show on screen:**
- The monthly lead-volume scenario table and risk/control sections in `roi_risk_assessment.md`

**Approx. speaking time:** 50?60 seconds

## 10) Four-week pilot and final roadmap

**Slide title:** Four-week pilot and next steps

**On-slide content:**
- One agency, 2–3 agents, limited channels
- Four-week pilot with weekly review
- No automatic customer messaging during the pilot
- Rollback/stop criteria defined
- Scale only if safety, usability and ROI support it

**Recommended visual or screenshot:**
- `strategic_plan.md` pilot section and `round2_project_plan.md` checklist

**Speaker notes:**
The roadmap is intentionally conservative. The repository plans a four-week pilot with a small agent group and limited channels. The project only scales if the evidence supports it. If not, the scope can stay narrowed to multilingual intake and clarification. That is the safest way to move from capstone to real deployment.

**What to show on screen:**
- The strategic plan pilot section and the completion checklist

**Approx. speaking time:** 55–65 seconds

## Closing line

PropLead AI is a small, controlled, multilingual real-estate assistant for a Mallorca agency: useful enough to save agent time, narrow enough to stay review-gated, and documented enough to support a safe pilot.
