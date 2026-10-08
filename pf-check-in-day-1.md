# PF check-in — Day 1

**Date:** 29 September 2026  
**Project:** PropLead  
**Round:** 2

## Today's goals

- Complete the first draft of `use_case_definition.md`.
- Define the scope, architecture and data flow of the MVP.
- Plan the evolution from the rules-based n8n POC to structured extraction.
- Define the LangSmith evaluation criteria and initial multilingual cases.
- Identify the next development tasks.

## Completed

- Confirmed the Round 1 decision as KEEP.
- Documented the Round 1 to Round 2 evolution.
- Defined the smallest end-to-end MVP.
- Defined the lead data contract, scoring weights and matching rules.
- Separated current capabilities from planned Round 2 capabilities.
- Created the POC upgrade plan.
- Designed the LangSmith experiment and evaluator thresholds.
- Created 18 synthetic cases: six English, six German and six Spanish.
- Validated all expected property IDs and hard-filter constraints against the eight-property catalogue.

## Key decisions

- Human approval remains mandatory for every outbound response.
- Scoring and property matching remain deterministic.
- The LLM is limited to structured language extraction and grounded reply drafting.
- Unknown values remain null.
- Legal, mortgage, negotiation, ambiguous and zero-match cases require escalation.
- Live WhatsApp, CRM writes and autonomous sending remain out of scope.
- PropLead Round 2 will be developed as an independent capstone project using only its own files, data, tests and implementation.
- Teaching staff confirmed that well-documented synthetic data is sufficient for the MVP and LangSmith evaluation.
- Peer feedback averaged 4.00 / 5.00 and supported keeping the project.
- Based on peer feedback, intake and qualification now precede gated property matching.
- Simulated lead sources will use one normalised contract; live integrations remain out of scope.
- A language-consistency regression will cover the observed Spanish-greeting/English-body failure.
- Missing critical data will produce `needs_information` and block matching.
- Only available, recently verified catalogue records can be suggested.
- The focused agent interface, clarification drafting and edge-case review override are now explicit Round 2 requirements.
- Real operational effectiveness remains a controlled-pilot question; the capstone benchmark stays synthetic and fully labelled.

## Evidence

- `use_case_definition.md`
- `architecture/mvp_architecture.md`
- `poc/poc_upgrade_plan.md`
- `evaluation/langsmith_plan.md`
- `evaluation/dataset_seed.jsonl`
- `evaluation/validate_dataset.py`
- `round2_project_plan.md`
- `feedback/round1_peer_feedback.md`

## Validation result

- Dataset cases: 18
- English: 6
- German: 6
- Spanish: 6
- Catalogue properties: 8
- Validation errors: 0
- Dataset approval: teaching staff accepted well-documented synthetic data

## Current blockers

- The minimal MVP runtime and interface have not yet been selected.
- LangSmith results do not exist yet because the experiment has not been executed.
- The current synthetic benchmark cannot prove real-world accuracy; that requires a permissioned pilot.

## Next session

1. Select the minimal PropLead MVP runtime and interface.
2. Implement the PropLead lead schema, deterministic scoring and catalogue matching from the project specifications.
3. Execute all 18 cases against the PropLead deterministic baseline.
4. Record baseline metrics before adding structured LLM extraction.
