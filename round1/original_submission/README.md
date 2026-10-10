# PropLead AI — Ironhack Capstone Round 1

**Consultant:** Carlos Felipe Valencia  
**Scenario:** Chleo Realty Mallorca, a fictional micro real estate agency with 1–9 employees  
**Primary use case:** Multilingual lead qualification and property matching

## Business problem

Small real estate teams receive unstructured enquiries through WhatsApp, email and web forms. Agents repeatedly ask for missing requirements, translate messages, search listings and copy information into a CRM. Slow and inconsistent triage can reduce the chance of converting an enquiry into a viewing.

## Proposed solution

PropLead AI turns a free-text enquiry into a structured lead profile, assigns a transparent priority score, finds up to three compatible properties and prepares a reply for human approval.

## Round 1 scope

- Sector research using public sources
- Opportunity and risk analysis
- Three use cases with one selected for the POC
- Five stakeholder-focused charts
- Importable n8n workflow and browser demo
- Evaluation plan with five scored cases
- Four-week timeline and cost estimate
- Presentation for teaching staff
- Requirement-by-requirement audit in `Capstone_Round1_Coverage.md`

## Important data note

The client profile, operational baseline, enquiries and property catalogue are synthetic. Public market statistics come from INE, the Spanish Land Registrars and Eurostat. No personal data from real clients is used.

## Folder structure

```text
data/             Synthetic baseline and property catalogue
research/         Sector, opportunity, risk and use-case analysis
charts/           Chart definitions and source notes
n8n/              Importable workflow and instructions
poc/              Standalone browser demo
evaluation/       Pass/fail criteria and scored mini dataset
cost_estimation/  Upfront cost and delivery timeline
feedback/         Round 1 decision template
presentation/     Round 1 deck
Capstone_Round1_Coverage.md  Requirement audit and dataset rationale
```

## POC demo

Open `poc/proplead_demo.html` in a browser. Choose a sample enquiry or enter a new one, then select **Analyse lead**. The prototype returns extracted requirements, a lead score, matching properties and a draft reply.

The Round 1 prototype uses transparent rules so the team can inspect the logic. Round 2 will replace the extraction step with an LLM, preserve human approval and evaluate the system with LangSmith.
