# Capstone Round 1 coverage

| Ironhack requirement | Evidence in this project | Status |
|---|---|---|
| Sector + company size | Chleo Realty Mallorca, real estate microbusiness, 1–9 employees | COMPLETE |
| Sector research | `research/sector_research.md` | COMPLETE |
| Opportunities and risks | `research/opportunities_risks.md` | COMPLETE |
| Two or three use cases | `research/use_cases.md` compares three cases | COMPLETE |
| Public dataset selected and justified | INE House Price Index and Spanish Land Registrars are the primary public datasets; Eurostat is supporting context. Selection rationale appears below. | COMPLETE |
| Four to six charts | Five editable charts in the presentation and definitions in `charts/charts_documentation.md` | COMPLETE |
| Simple n8n or equivalent POC | `n8n/proplead_round1_workflow.json`, documentation and browser demo | COMPLETE |
| Evaluation plan | Five criteria and five scored cases in `evaluation/eval_plan.md` | COMPLETE |
| Cost and timeline | `cost_estimation/cost_analysis.md` and `timeline_estimate.md` | COMPLETE |
| Staff presentation | Personalized English deck in `presentation/` | COMPLETE |
| Decision after presentation | `feedback/round1_decision.md` prepared for immediate completion | PENDING STAFF FEEDBACK |

## Public dataset selection and justification

### Primary dataset 1: INE House Price Index

Selected because it is an official, current and regionally comparable measure of market pressure. The project uses the Q1 2026 annual change for Illes Balears and selected Spanish regions.

### Primary dataset 2: Spanish Land Registrars

Selected because it provides regional evidence on foreign-buyer participation and registered prices. The foreign-buyer share directly supports the multilingual enquiry use case.

### Supporting dataset: Eurostat AI adoption

Used only to frame adoption risk by company size. Its survey excludes businesses with fewer than ten employees, so it cannot represent Chleo directly. The deck labels that limitation.

### Synthetic operational data

Language mix, incoming channels, missing fields and response time are discovery hypotheses. They enable the Round 1 charts and POC without exposing client data. Chleo would replace them with measured records during the pilot.

## Round 1 boundary

The current POC uses transparent rules. It does not claim production AI accuracy. Round 2 will add structured LLM extraction, LangSmith evaluation, GDPR and EU AI Act documentation, ROI analysis, an upgraded MVP and a recorded demo.
