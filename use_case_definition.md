# PropLead use case definition

## 1. Round 1 to Round 2 evolution

Round 1 tested the business logic with a transparent rules-based n8n workflow and a standalone browser demo. The baseline detects the language, extracts common fields from controlled examples, calculates a readiness score, matches a synthetic property catalogue and routes the result to an agent review queue.

The teaching-staff presentation resulted in a **KEEP** decision. Peer feedback supported the concept while identifying risks around channel definition, missing data, language consistency, synthetic evidence and unsafe matching. Round 2 therefore preserves the industry and use case but makes intake and qualification the core proof; matching becomes a gated secondary capability.

Round 2 will evolve the baseline in four areas:

1. Replace rule-based extraction with structured LLM extraction after the deterministic baseline is retained for comparison.
2. Expand evaluation from five crafted cases to a multilingual dataset with systematic evaluators.
3. Document ROI, risk, GDPR and EU AI Act implications before any live pilot.
4. Normalise simulated channel inputs and stop incomplete records at a missing-information gate.
5. Deliver a working MVP and recorded demonstration with a mandatory human approval gate.

## 2. Client scenario

Chleo Realty Mallorca represents a microagency with 1–9 employees. The working discovery profile assumes five employees, approximately 40 active listings and 60 buyer enquiries per month through WhatsApp, email and web forms.

These internal figures remain synthetic until the agency provides permissioned operational data. No real Chleo Realty customer or property data is used in the capstone.

### Dataset decision

On 29 September 2026, teaching staff confirmed that a well-documented synthetic dataset is sufficient for the capstone. PropLead will therefore use realistic synthetic buyer enquiries and a fictional property catalogue for development, LangSmith evaluation and demonstration. Every dataset artifact must clearly state its synthetic origin, intended coverage and limitations. Passing the synthetic evaluation will demonstrate controlled functional performance, not real-world accuracy, conversion impact or production readiness.

## 3. Business problem

Buyer enquiries arrive as unstructured messages in English, German and Spanish. Agents repeatedly translate messages, identify missing requirements, judge lead readiness, search listings and draft replies. The process is slow and inconsistent when workload is high.

## 4. Primary user

The primary user is a sales agent in a Mallorca real estate microagency. The agent needs one clear review screen with a fast summary of the buyer's stated requirements, visible missing information, relevant listings, supporting evidence and a draft response or clarification question that can be approved, edited or rejected.

## 5. Job to be done

When a buyer enquiry arrives, help the sales agent understand and qualify the request, identify compatible properties and prepare the first response without inventing information or removing human control.

## 6. Intake and input

A free-text buyer enquiry in English, German or Spanish enters through one controlled intake contract. Round 2 simulates the source rather than building live integrations.

Supported source labels:

- `web_form`
- `email`
- `whatsapp`
- `property_portal`
- `social`
- `manual`

Each source is normalised to `lead_id`, `source_channel`, `source_message_id`, `received_at`, `original_text`, `consent_status` and optional `source_metadata` before extraction begins. Live WhatsApp, email, portal and social connectors are out of scope for the MVP.

## 7. Required output

- Detected language
- Budget in euros, when stated
- Preferred location or locations
- Property type
- Minimum bedrooms
- Purchase purpose, when stated
- Purchase timeline, when stated
- Financing status, when stated
- Must-have features, when stated
- Missing critical fields
- Qualification status: `needs_information`, `qualified` or `matching_ready`
- Confidence and ambiguity flags
- Transparent readiness score and priority
- Up to three compatible properties
- Match reason for each property
- Draft response in the original language
- `human_review_required: true`
- Final workflow status

## 8. Business rules

- Unknown fields remain empty and are never inferred as facts.
- The minimum matching gate requires a stated budget, a specific location and at least one structural constraint: property type or minimum bedrooms. If this minimum is not met, the workflow asks for missing information and does not run property matching. Other unknown preferences remain null.
- Budget, location, property type and bedroom requirements act as hard matching filters when explicitly stated.
- Nationality, age, gender, ethnicity, religion, disability and other protected traits never affect scoring or matching.
- A zero-match, ambiguous, legal, mortgage-advice or negotiation request must be escalated.
- Only listings marked `available` with a current `last_verified_at` value can be returned. Availability must still be reconfirmed before an agent sends a recommendation.
- The complete draft, including greeting, body and closing, must use the detected response language.
- For `needs_information`, the assistant may draft one concise clarification question in the lead's language. It may not send it automatically.
- Borderline, contradictory or low-confidence cases receive `priority: review` regardless of their numeric score.
- Every outbound reply requires agent approval during the MVP and pilot.

## 9. Smallest viable MVP

The MVP proves one end-to-end path:

> One enquiry becomes one structured and reviewable lead record with visible missing data and a deterministic score. Only a sufficiently qualified record can receive zero to three current catalogue matches and a single-language response draft awaiting agent approval.

## 10. In scope

- English, German and Spanish enquiries
- Structured extraction into a fixed schema
- Deterministic readiness scoring
- Deterministic catalogue matching
- Missing-information detection
- Agent-approved clarification-question drafting
- Normalised metadata for simulated source channels
- Qualification gate before matching
- Multilingual response drafting
- Human approval, edit or rejection
- Trace and evaluation data suitable for LangSmith
- Synthetic data for development and testing
- Documented synthetic data for the LangSmith experiment, as confirmed by teaching staff

## 11. Out of scope

- Automatic sending through WhatsApp or email
- Direct CRM write access
- Property-price negotiation
- Legal, tax or mortgage advice
- Identity verification
- Buyer ranking using protected attributes
- Autonomous decisions about accepting or rejecting a customer
- Production deployment before GDPR controls and pilot approval
- Live WhatsApp, email, social-media or property-portal integration

## 12. Success criteria

| Area | MVP target |
|---|---:|
| Language identification | At least 95% of evaluation cases |
| Explicit-field extraction | At least 90% field-level accuracy |
| Critical-field fabrication | 0 fabricated budget, location, type or bedroom values |
| Hard-filter matching | 100% of returned properties respect explicit hard constraints |
| Required escalation | 100% for legal, ambiguous and zero-match cases |
| Borderline classification | 100% of contradictory or low-confidence cases routed to review |
| Reply language | At least 95% correct language |
| Whole-draft language consistency | 100%; no mid-message language switch |
| Missing critical data | 100% routed to `needs_information` before matching |
| Unsupported inference | 0 critical preferences invented |
| Catalogue availability | 0 unavailable or stale properties returned |
| Human approval gate | Present in 100% of outputs |
| Median processing time | Under 8 seconds in the controlled evaluation environment |

## 13. Pilot learning metrics

- Median first-response preparation time
- Manual minutes per lead
- Percentage of enquiries with all critical fields
- Percentage of suggested matches accepted by an agent
- Percentage of drafts approved with no or minor edits
- Zero-match and escalation rate
- Failed workflow rate
- Agent-reported usefulness
- Agent task-completion rate and usability issues

The MVP will not claim conversion, revenue improvement or live classification accuracy until a controlled pilot with anonymised or consented real enquiries and current catalogue constraints produces evidence.
