# PropLead AI Demo Runbook

## Files/tabs to open before presenting

1. `presentation/final_presentation_content.md`
2. `presentation/demo_runbook.md`
3. `mvp/index.html`
4. `mvp/app.js`
5. `evaluation/langsmith.md`
6. `roi_risk_assessment.md`
7. `eu_ai_act_compliance.md`
8. `gdpr_documentation.md`
9. `strategic_plan.md`
10. `n8n/execution_evidence_2026-10-03.md`

## Exact demonstration order

1. Start with slide 1 and introduce PropLead AI for a Mallorca microagency.
2. Move to slide 2 and explain the business problem: multilingual enquiries, manual qualification, missing data and safe catalogue matching.
3. Use slide 3 to explain Round 1 feedback and how Round 2 narrowed the scope.
4. Use slide 4 to separate the browser MVP, the n8n POC and the LangSmith hybrid extractor.
5. On slide 5, explain the workflow diagram first, then switch to the deployed browser MVP.
6. Run one multilingual enquiry through the browser MVP and show the extracted fields, the matched property and the review state.
7. Point out that no customer message is sent automatically.
8. Switch to `evaluation/langsmith.md` and show v1 versus final hybrid v2.
9. Show the n8n proof-of-concept evidence.
10. End on `strategic_plan.md` and the four-week pilot.

## Recommended multilingual test inquiry

Use this as the live demo input:

> Busco una vivienda en Port de Sóller con dos dormitorios, vistas al mar y presupuesto de 1,4 millones. Preferiría balcón si es posible.

## Expected extracted fields

- Language: Spanish
- Budget: €1,400,000
- Location: Port de Sóller / Sóller canonicalised for matching
- Property type: housing/apartment category consistent with the catalogue
- Bedrooms: 2
- Preferred feature: sea view
- Preferred feature: balcony
- Must-have features: none unless the user states one explicitly
- Qualification status: ready for matching if the rest of the gate is met
- Human review: required

## Expected property match

- Expected property ID: `PM-103`
- Reason: matches Port de Sóller/Sóller canonical location, two bedrooms and sea-view preference within budget, subject to the catalogue rules

## Expected response language

- Spanish
- Preserve accents in the rendered text

## Expected human-review status

- `human_review_required: true`
- No automatic customer sending
- Agent must approve, edit, reject or escalate

## n8n execution to show

Show the imported eight-node workflow evidence:

- `n8n/proplead_round2_poc.json`
- `presentation/assets/n8n_workflow_success.png`
- `presentation/assets/n8n_spanish_result.png`
- `presentation/assets/n8n_german_escalation.png`

Point out that the workflow ran successfully in the target n8n environment and that it is separate from the browser MVP.

## LangSmith experiment and metric columns to show

Open `evaluation/langsmith.md` and show:

- `structured_extractor_v1-fd0b3bae`
- `structured_extractor_v2-d2454c34`
- Matching correctness
- Escalation correctness
- Human-review gate
- Language correctness
- Explicit-field accuracy
- No-critical-fabrication
- Average latency
- Total tokens
- Total cost

## Backup plan if something fails

### If the live MVP fails
- Open `mvp/index.html` locally.
- Use the same demo enquiry.
- Explain that the browser demo is deterministic and offline.

### If n8n evidence is unavailable
- Show `poc_documentation.md` and the workflow JSON import section, then note the eight-node layout.
- Explain the eight-node flow verbally.

### If LangSmith cannot be opened live
- Show `evaluation/langsmith.md` as the authoritative offline record.
- Read the final v2 metrics directly from the file.

## Final pre-presentation checklist

- Browser open on the deployed MVP URL.
- Presentation content file open.
- Demo enquiry copied to clipboard.
- `evaluation/langsmith.md` visible on the final v2 section.
- The final n8n evidence screenshots are available.
- `presentation/assets/n8n_workflow_success.png` and the Spanish/German screenshots are ready.
- `roi_risk_assessment.md`, `eu_ai_act_compliance.md` and `gdpr_documentation.md` open for backup references.
- Internet connection verified for the hosted MVP.
- Local copy of `mvp/index.html` ready as fallback.
- Audio/mic and screen-sharing permissions tested.
- The first sentence ready: this is a review-gated decision-support system, not an automatic sender.
