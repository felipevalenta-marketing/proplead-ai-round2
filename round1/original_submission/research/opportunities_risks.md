# Opportunity and risk map

## Opportunities

| Opportunity | Business value | Round 1 response |
|---|---|---|
| Faster first response | Agents can review a prepared answer instead of starting from zero | Draft a reply after extraction and matching |
| Consistent qualification | Every enquiry uses the same required fields | Use a visible field checklist and score |
| Multilingual service | English, German and Spanish enquiries follow one process | Detect language and prepare the response in that language |
| Better listing relevance | Agents see the best candidates first | Match on budget, location, property type and bedrooms |
| Cleaner CRM records | Structured data reduces manual copying | Produce a standard JSON record for later CRM integration |

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Incorrect extraction | An agent could send irrelevant properties | Show extracted fields and require human approval |
| Fabricated information | Trust and legal exposure | Leave missing values blank and ask a follow-up question |
| Privacy breach | GDPR and reputational risk | Use synthetic data in development, minimise fields and define retention |
| Bias in lead scoring | Some buyers could receive lower priority unfairly | Score only business readiness fields and exclude nationality or protected traits |
| Outdated availability | The assistant could recommend unavailable listings | Use a controlled catalogue and confirm availability before sending |
| Automation dependence | Workflow failure could delay replies | Keep a manual queue and log failed runs |

## Design principle

The agent remains responsible for the final response. The system explains the score, displays missing information and never sends a property recommendation automatically during the pilot.
