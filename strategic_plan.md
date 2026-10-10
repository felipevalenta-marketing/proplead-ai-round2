# PropLead strategic plan

## Objective

Validate whether PropLead can reduce multilingual lead-preparation time without increasing unsafe classification, unsuitable matching or compliance risk.

## Phase 0 — Readiness

**Duration:** 1 week

- Freeze the lead schema and permitted use.
- Complete GDPR and AI Act review.
- Confirm the authorised property catalogue owner.
- Import and validate n8n in the target workspace.
- Complete LangSmith baseline and structured-extractor experiments.
- Train participating agents on human oversight.

**Exit gate:** all critical evaluation thresholds pass and no unsupported automatic sending exists.

## Phase 1 — Four-week pilot

**Duration:** 4 weeks
**Scope:** one agency, 2–3 trained agents, limited lead channels
**Channels:** email copies, web-form copies and manual entry only

- Process English, German and Spanish enquiries.
- Require approval for every structured record, match and draft.
- Do not send customer messages automatically during the pilot.
- Reconfirm property availability before use.
- Log corrections, rejections and escalations.
- Hold a weekly review meeting.
- Maintain a rollback plan that disables matching or drafting if a stop condition appears.

## Pilot KPIs and thresholds

| KPI | Continue threshold |
|---|---:|
| Critical-field fabrication | 0 cases |
| Unavailable properties recommended | 0 cases |
| Human-review gate | 100% |
| Whole-draft language consistency | ≥98% |
| Field-level extraction accuracy | ≥90% |
| Mandatory escalation recall | 100% |
| Median preparation-time reduction | ≥15 minutes per lead |
| Major-edit rate | ≤20% |
| Agent usefulness rating | ≥4/5 |

## Stop conditions

- Repeated fabrication of budget, location, property type or bedrooms.
- Any automatic outbound message without approval.
- Protected attributes influence score or matching.
- Unavailable property reaches an approved response.
- Security incident or unapproved processor use.
- Agents cannot understand or correct the output.

## Phase 2 — Limited integration

Proceed only after the pilot gate passes.

- Add one channel integration first.
- Add CRM write access only with validation and rollback.
- Maintain human approval.
- Monitor drift and language-specific failures.
- Review retention, access and vendor controls quarterly.

## Phase 3 — Scale decision

Choose one outcome:

- **Scale:** measured safety, usability and ROI pass.
- **Narrow:** retain multilingual intake and clarification, remove matching.
- **Pause:** risk, accuracy or economics do not justify deployment.

Autonomous sending, credit decisions, negotiation and legal advice remain outside the strategy.
