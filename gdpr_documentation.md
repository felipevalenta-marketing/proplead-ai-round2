# PropLead GDPR documentation — draft

> Planning document for the capstone, not legal advice. A real deployment requires review by the agency's data-protection adviser.

## Roles and responsibilities

- **Controller:** the deploying real-estate agency, which decides why and how enquiry data is processed.
- **Processors:** hosting, automation, model and CRM providers that process data on the agency's instructions.
- **Authorised users:** trained sales agents and the minimum necessary administrator.

Controller responsibilities include deciding the lawful basis, publishing the privacy notice, responding to data-subject requests, approving retention and choosing vendors. Processor responsibilities include processing only on documented instructions, protecting the data, supporting deletion/export requests and notifying the controller of incidents.

## Purpose and proposed lawful basis

The primary purpose is to respond to an incoming property enquiry, structure the buyer's stated requirements and support an agent's first response. The agency should document the appropriate lawful basis before launch; legitimate interests or pre-contractual steps may be relevant depending on the exact interaction. Separate consent is required where the agency relies on consent for optional marketing communications.

## Data categories

| Data category | Example | Need |
|---|---|---|
| Original enquiry text | Buyer message in English, German or Spanish | Understand the request and provide evidence |
| Contact details | Email, phone number or messaging handle | Reply to the buyer |
| Budget and property preferences | Budget, location, bedrooms, must-have features | Qualify and match the enquiry |
| Source channel and timestamp | Web form, WhatsApp, email, portal, manual entry | Context, audit and deduplication |
| Derived language and review flags | Detected language, ambiguity, escalation reasons | Prepare a suitable response |
| Workflow outputs and agent decision | Draft response, matches, approval choice | Accountability and correction |
| Protected attributes | N/A in the intended design | Must not be extracted, scored or matched |

## Data minimisation

1. Inform the buyer how their enquiry will be processed.
2. Collect only fields necessary to answer the property request.
3. Avoid capturing protected characteristics or unrelated personal data.
4. Keep the original text so the agent can verify extracted facts.
5. Limit access to the minimum number of trained users.
6. Do not use enquiry data to train a model without a separate documented basis and controls.
7. Do not send data outside approved processors or regions without transfer safeguards.

## Synthetic-data status of the current MVP

The current MVP is synthetic. It uses fabricated property data and synthetic benchmark enquiries for development, evaluation and demonstration. No real customer data should be entered into the current capstone environment unless the agency has approved the production controls, notices and legal basis.

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

## Production requirements for real enquiries

Before real enquiries are processed, the agency should have:

- a published privacy notice and internal record of processing;
- a confirmed lawful basis per channel or use case;
- vendor and transfer checks for every processor;
- retention and deletion automation;
- a documented DSAR workflow;
- role-based access control and audit logging;
- a completed DPIA or documented screening outcome.

## Official reference

- European Data Protection Board, *Guidelines on Automated individual decision-making and Profiling*: https://www.edpb.europa.eu/documents/guideline/automated-decision-making-and-profiling_en
