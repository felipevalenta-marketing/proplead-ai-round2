# PropLead Round 2 project plan

## Confirmed direction

- Decision: KEEP
- Industry: Real estate
- Company profile: Mallorca microagency, 1–9 employees
- Use case: Multilingual lead qualification and property matching
- Human approval: Mandatory
- Peer rating: 4.00 / 5.00
- Refined emphasis: multilingual intake and qualification first; matching only after a quality gate

## Workstreams

### 1. Use-case and architecture

- [x] Document Round 1 to Round 2 evolution
- [x] Define smallest viable MVP
- [x] Define lead schema and deterministic controls
- [x] Separate current baseline from planned features
- [x] Translate Round 1 peer feedback into scope and acceptance criteria
- [x] Define the normalised intake-channel contract

### 2. Stronger POC

- [x] Preserve Round 1 n8n baseline
- [x] Draft the POC upgrade plan
- [x] Implement validated structured extraction
- [x] Implement deterministic missing-information and qualification gates
- [x] Implement grounded deterministic multilingual drafting
- [x] Add a regression for the observed Spanish-to-English draft switch
- [x] Add explicit approve, edit, reject and escalate outcomes
- [x] Draft same-language missing-information questions for agent approval
- [x] Design and test the focused agent review screen
- [x] Record stable POC demo
- [x] Complete `poc_documentation.md`

### 3. Working MVP

- [x] Choose the minimal runtime and interface
- [x] Implement the lead data contract
- [x] Reuse deterministic scoring and catalogue matching
- [x] Add validation and failure states
- [x] Add confidence, ambiguity and score-boundary review overrides
- [x] Block unavailable or stale catalogue records
- [x] Test the complete workflow offline before external integrations
- [x] Complete `mvp_documentation.md`

### 4. LangSmith evaluation

- [x] Define evaluator design and thresholds
- [x] Create 18 synthetic seed cases
- [x] Confirm with teaching staff that documented synthetic data is acceptable
- [x] Create the LangSmith dataset
- [x] Run the deterministic offline baseline experiment
- [x] Run the hybrid structured_extractor_v2 experiment
- [x] Confirm the final hosted hybrid_policy_v2 candidate while keeping mandatory human review
- [x] Inspect failed traces and add regressions
- [x] Report classification, matching and language metrics separately by language
- [x] Run the feedback-driven regression cases locally
- [x] Complete `evaluation/langsmith.md` with real results

### 5. Business and compliance

- [x] Draft `roi_risk_assessment.md`
- [x] Draft `gdpr_documentation.md`
- [x] Draft `eu_ai_act_compliance.md`
- [x] Confirm data retention, deletion and access controls
- [x] Confirm authorised property catalogue process
- [ ] Define the permissioned real-data pilot and anonymisation process

### 6. Strategy and final presentation

- [x] Draft `strategic_plan.md` with an explicit four-week controlled pilot
- [x] Define pilot KPIs and stop conditions
- [ ] Prepare the final presentation
- [ ] Record a backup demonstration
- [ ] Rehearse the final pitch

## Evidence-based completion checklist

- [x] Required Round 2 documents exist in the repository.
- [x] Final LangSmith results are recorded in `evaluation/langsmith.md`.
- [x] The public MVP URL is documented in the MVP materials.
- [x] The strategic plan contains a four-week, single-agency pilot with weekly review and no automatic customer messaging.
- [x] Compliance drafts distinguish assumptions, controls and production requirements from measured results.
- [ ] Final presentation package still requires manual assembly.
- [ ] Live pilot setup still requires agency approval and real-data controls.

## Recommended delivery order

1. Freeze the normalised intake contract, lead schema and evaluation dataset.
2. Draft GDPR, EU AI Act and data-governance controls against that architecture.
3. Build the narrow intake-and-qualification MVP early.
4. Add gated catalogue matching and single-language drafting.
5. Run evaluation and fix failures.
6. Complete ROI, risk and the strategic pilot plan using measured results.
7. Prepare the presentation and recorded demo.

## Next working session

1. Prepare the final presentation and demo assets.
2. Keep the promoted `hybrid_policy_v2` candidate review-gated in every response path.
3. Validate compliance drafts and pilot assumptions with teaching staff.
