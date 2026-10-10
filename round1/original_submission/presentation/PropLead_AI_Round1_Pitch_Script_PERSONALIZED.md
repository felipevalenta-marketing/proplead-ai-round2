# PropLead — Round 1 pitch script

## Slide 1 — PropLead

Good evening. This project starts with a situation I know from real estate work in Mallorca. A buyer writes in another language, shares only part of what the agent needs and expects a fast answer. PropLead helps a small agency turn that message into a structured, reviewable first response.

## Slide 2 — One enquiry, five tasks

This message looks simple, but it creates five tasks. The agent has to interpret the language, identify missing information, judge the buyer’s readiness, search the catalogue and write a relevant reply. In a small team, the speed and quality of that process depend on who is available.

## Slide 3 — Chleo’s operating context

Chleo represents a five-person Mallorca agency with around forty active listings and sixty buyer enquiries per month. The figures are synthetic discovery assumptions. Enquiries arrive through WhatsApp, web forms and email, and there is no dedicated qualification team.

## Slide 4 — Market pressure

INE reported annual house-price growth of 13.6 percent in Illes Balears in the first quarter of 2026. This does not prove that response speed creates sales. It shows that availability and buyer expectations can change quickly.

## Slide 5 — International buyers

Foreign buyers represented 31.47 percent of registered purchases in Illes Balears in the fourth quarter of 2025. That is more than twice the Spanish share. Multilingual intake therefore belongs in the first version of the workflow.

## Slide 6 — Adoption reality

Eurostat shows that AI adoption rises with company size, but its survey starts at ten employees. Chleo is smaller, so I do not use this dataset as direct evidence about microagencies. The practical response is a narrow workflow and a controlled four-week pilot.

## Slide 7 — Discovery hypotheses

These two charts are synthetic. They define what discovery must measure: the real language mix and the fields buyers most often leave out. The pilot will replace these assumptions with permissioned company data.

## Slide 8 — Dataset choice

The project separates public evidence from internal hypotheses. INE provides market pressure. The Spanish Land Registrars support the multilingual scope. Eurostat frames implementation risk. Synthetic operating data and eight fictional listings allow the POC to run without personal client data.

## Slide 9 — Use-case selection

I compared three use cases. Follow-up reminders score slightly higher because they are easier. I selected qualification and matching because it addresses the first bottleneck and proves one complete journey from message to agent decision.

## Slide 10 — Smallest MVP

The MVP takes one free-text enquiry, extracts only stated facts, calculates a transparent readiness score, returns up to three compatible properties and prepares a response. It stops at agent approval. No message is sent automatically during the pilot.

## Slide 11 — Working POC

In this tested case, the workflow detects English and extracts an eight-hundred-thousand-euro budget, Palma, apartment, two bedrooms and a three-month timeline. It returns PM-101 at 575,000 euros and marks the case as awaiting agent approval. The package includes the n8n workflow and a standalone browser demo.

## Slide 12 — Opportunities and controls

The controls are part of the solution. PropLead shows the extracted fields, keeps unknown values blank, explains the match and uses a controlled property catalogue. The agent approves every recommendation and every outbound reply.

## Slide 13 — Evaluation

The Round 1 plan uses five criteria and five scored cases. The transparent rules baseline passes all five crafted cases. This is not production accuracy. Round 2 needs a larger dataset and a LangSmith experiment covering extraction, hallucination, translation and matching behaviour.

## Slide 14 — Cost and timeline

The estimated upfront pilot cost is 4,200 euros. After the pilot, the estimated operating cost is 240 euros per month. The four weeks cover discovery, build, testing and a controlled launch. VAT, paid CRM licences and custom connectors are excluded.

## Slide 15 — Decision gate

My current recommendation is to keep the real-estate industry and this use case, subject to your feedback. After this presentation I will record the most repeated feedback, confirm KEEP or CHANGE and identify the highest-risk Round 2 work. My current risks are GDPR, ROI evidence and final EU AI Act classification.

## Closing question

Would you keep this direction for Round 2, and which assumption should I validate first?
