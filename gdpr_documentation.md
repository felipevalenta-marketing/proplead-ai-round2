# PropLead GDPR documentation — draft

> Planning document for the capstone, not legal advice. A real deployment requires review by the agency's data-protection adviser.

## Roles

- **Controller:** the deploying real-estate agency.
- **Processors:** hosting, automation, model and CRM providers that process data on the agency's instructions.
- **Authorised users:** trained sales agents and the minimum necessary administrator.

## Purpose and proposed lawful basis

The primary purpose is to respond to an incoming property enquiry, structure the buyer's stated requirements and support an agent's first response. The agency should document the appropriate lawful basis before launch; legitimate interests or pre-contractual steps may be relevant depending on the exact interaction. Separate consent is required where the agency relies on consent for optional marketing communications.

## Data inventory

| Data | Need | MVP treatment |
|---|---|---|
| Original enquiry text | Understand the request and provide evidence | Preserved with access restrictions |
| Contact details | Reply to the buyer | Not required in the synthetic MVP; minimise in pilot |
| Budget and property preferences | Qualify and match the enquiry | Extract only when explicitly stated |
| Source channel and timestamp | Context, audit and deduplication | Stored in normalised metadata |
| Language | Prepare a suitable response | Derived from the message |
| Workflow outputs and agent decision | Accountability and correction | Logged for the pilot |
| Protected attributes | Not needed | Must not be extracted, scored or matched |

## Data-flow controls

1. Inform the buyer how their enquiry will be processed.
2. Collect only fields necessary to answer the property request.
3. Encrypt data in transit and at rest in a real deployment.
4. Use role-based access for agents and administrators.
5. Keep the original text so the agent can verify extracted facts.
6. Do not use enquiry data to train a model without a separate documented basis and controls.
7. Do not send data outside approved processors or regions without transfer safeguards.

## Automated decision-making and profiling

PropLead creates a completeness/readiness score, but it does not accept or reject a buyer, determine creditworthiness or make a decision with legal or similarly significant effect. Every output requires human review. The score must not use protected characteristics and must be described as decision support, not buyer quality.

If the scope changes toward autonomous eligibility, financing, tenant screening or materially significant ranking, the agency must stop and reassess GDPR Article 22, profiling transparency and DPIA requirements.

## Retention proposal for a pilot

| Record | Proposed retention | Action |
|---|---:|---|
| Failed or test payload | 30 days | Delete or anonymise |
| Inactive raw enquiry | 90 days | Delete unless needed for an active request or legal obligation |
| Active lead record | Up to 12 months | Review and delete when no longer necessary |
| Evaluation trace | 90 days | Anonymise before longer analytical use |
| Security and access log | 6 months | Restrict access and rotate |

These periods are planning defaults and require controller approval.

## Data-subject rights process

- Identify records linked to the requester.
- Support access, correction, deletion, restriction, objection and portability where applicable.
- Record the request and response deadline.
- Propagate approved deletion or correction to processors and connected systems.
- Provide a human contact for objections to profiling or scoring.

## Security and incident controls

- Named user accounts; no shared agent login.
- Least-privilege access.
- Secrets stored outside workflows.
- Audit logs for access, edits and approvals.
- Processor agreements and approved subprocessor list.
- Incident escalation to the controller's privacy lead.
- Breach assessment and notification procedure.

## DPIA screening

A DPIA screening should be completed before a real pilot because the system processes personal messages and produces profiling-like scores. The current small-scale, human-reviewed design reduces risk, but does not remove the need to document the assessment.

## Official reference

- European Data Protection Board, *Guidelines on Automated individual decision-making and Profiling*: https://www.edpb.europa.eu/documents/guideline/automated-decision-making-and-profiling_en

