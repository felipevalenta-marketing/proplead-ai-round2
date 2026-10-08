# PropLead MVP documentation

## MVP statement

PropLead is an offline browser MVP for a small Mallorca real-estate agency. It converts one English, German or Spanish enquiry into a structured lead, exposes missing or risky information, calculates a transparent score, gates property matching and prepares a same-language draft for mandatory human review.

## How to run

Open `mvp/index.html` in Chrome, Edge or Firefox. No installation, API key or internet connection is required.

For automated validation:

```bash
node --test tests/test_core.js
node evaluation/run_baseline.js
```

## Implemented capabilities

- Six simulated source channels with one normalised intake contract.
- English, German and Spanish detection.
- Extraction of budget, location, property type, bedrooms, timeline, purpose, financing and requested features.
- Unknown values remain null.
- Missing-information qualification gate.
- Confidence and ambiguity flags.
- Deterministic and inspectable score breakdown.
- Availability and verification-date catalogue controls.
- Maximum of three compatible properties.
- Same-language response or clarification drafting.
- Approve, edit, reject and escalate review outcomes.
- No automatic outbound sending.
- Deterministic multilingual matching normalises accents, apostrophes, location spellings, budget formats, bedroom phrasing and must-have feature concepts before filtering and ranking.
- `data/properties.csv` is the source of truth for the browser catalogue, and `mvp/sync_catalogue.js` validates `mvp/catalogue.js` against it.
- The hybrid structured-extraction path keeps OpenAI on multilingual extraction while a deterministic policy sets escalation, catalogue safety and human-review requirements.

## Minimum matching gate

Matching requires:

1. A stated maximum budget.
2. At least one specific location.
3. Property type or minimum bedrooms.
4. No unresolved conflicting values.

If the gate fails, the status becomes `needs_information`, matches remain empty and the system prepares a clarification question.

## Edge-case behaviour

The numeric score never acts as an autonomous acceptance decision. Ambiguous, contradictory, uncertain, mixed-language or policy-sensitive cases receive a visible review flag. Legal, tax, mortgage-guarantee and negotiation requests are not answered by the system.

## Property controls

A property can be returned only when:

- `status` is `available`;
- `last_verified_at` is inside the configured freshness window;
- price is within the stated budget;
- location and every explicit hard constraint match.

## Evaluation evidence

| Evidence | Result |
|---|---:|
| Multilingual synthetic cases | 18 |
| Languages | 3 |
| Automated tests | 57/57 passing |
| Explicit-field accuracy on current dataset | 100% |
| Language accuracy on current dataset | 100% |
| Exact expected matching on current dataset | 100% |
| Escalation accuracy on current dataset | 100% |
| Human-review gate | 100% |

These figures describe the documented synthetic benchmark only. They do not prove live accuracy or business impact.

## Feedback addressed

| Round 1 feedback | MVP response |
|---|---|
| Lead-entry channels unclear | Explicit channel selector and normalised contract |
| Spanish greeting switched to English | Whole-draft language regression test |
| Missing information could distort classification | Qualification gate and clarification draft |
| Preferences could be inferred | Unknown values remain null; vague-preference regression |
| Unsuitable or unavailable matches | Hard filters, availability status and verification date |
| Classification too binary | Confidence, flags and `review` override |
| Usability needs focus | One-screen agent review interface with visible controls |

## Not yet implemented

- LLM structured extraction
- LangSmith dataset upload and experiment
- Live WhatsApp, email, social or portal integrations
- CRM write access
- Real customer data
- Authentication and production hosting
- Sending approved messages

## Next technical step

Keep the deterministic browser MVP as the baseline while any future structured-LLM work stays behind the same qualification, matching and human-review controls.
