# PropLead AI — Round 1 pitch script

## Slide 1 — PropLead AI

Good evening. My project is PropLead AI, a multilingual lead qualification and property matching assistant for a small real estate agency in Mallorca. Today I will present the business case, the initial evidence, a working prototype and a realistic pilot plan.

## Slide 2 — Client profile and business problem

I created a fictional client called Chleo Realty Mallorca so I can work without real personal data. It represents a five-person agency with around forty listings and sixty buyer enquiries per month. These are discovery assumptions. The core problem is the repeated manual work required to translate messages, collect missing information, search listings and prepare a response.

## Slide 3 — House-price growth

INE reported annual house-price growth of 13.6 percent in the Balearic Islands in the first quarter of 2026. This does not prove that faster responses cause sales, but it shows that the agency works in a market where prices, availability and buyer expectations can change quickly.

## Slide 4 — International demand

The international dimension is especially important. Foreign buyers represented 31.47 percent of registered home purchases in the Balearic Islands in the fourth quarter of 2025, compared with 13.5 percent across Spain. This supports a multilingual process instead of a Spanish-only solution.

## Slide 5 — AI adoption gap

AI adoption also changes significantly with company size. In Spain, 17.2 percent of small enterprises used AI in 2025, compared with 57.5 percent of large enterprises. Eurostat does not measure microenterprises in this survey, so I cannot claim a specific adoption rate for this client. A controlled pilot is therefore the safest way to create local evidence.

## Slide 6 — Language mix

For the first meeting I created a synthetic baseline of sixty monthly enquiries. Forty percent are in English, thirty percent in German and twenty percent in Spanish. The exact distribution must be validated. The chart shows why multilingual triage belongs in the first version of the workflow.

## Slide 7 — Missing information

Incoming enquiries often lack the information an agent needs to recommend a property. In the synthetic baseline, financing status and purchase timeline are missing most often. PropLead AI will never guess these values. It leaves them blank and prepares a clear follow-up question.

## Slide 8 — Use-case selection

I compared three use cases using business value, feasibility, data readiness and implementation risk. Follow-up reminders score slightly higher because they are simpler. I selected lead qualification and matching because it addresses the first bottleneck in the funnel and demonstrates one meaningful capability from intake to recommendation.

## Slide 9 — Opportunities and risks

The main opportunities are faster responses and consistent qualification. The main risks are incorrect extraction, privacy and outdated availability. The controls are visible to the agent: extracted fields, missing information, score and match reason. During the pilot, the system never sends a message without human approval.

## Slide 10 — POC demo

The n8n prototype accepts a free-text enquiry, detects the language, extracts requirements, calculates a transparent completeness score and searches a synthetic property catalogue. In this example, it identifies an English enquiry for a two-bedroom apartment in Palma with an eight-hundred-thousand-euro budget. It returns one compatible listing and places the response in the agent approval queue.

For Round 1, the extraction uses transparent rules so every result can be inspected. In Round 2, I will replace this component with an LLM structured-output node while preserving the same schema and human approval.

## Slide 11 — Evaluation

I defined five pass or fail criteria: correct language, accurate extraction, no fabricated information, compatible matching and human escalation. The baseline passes the five crafted test cases. This is not enough to claim production accuracy. Round 2 will require a larger dataset, LangSmith traces and at least one evaluated experiment.

## Slide 12 — Cost, timeline and decision

The estimated pilot costs 4,200 euros upfront and 240 euros per month after the pilot. The four-week plan covers discovery, workflow construction, testing and a controlled launch. Today I am asking whether this industry and use case are strong enough to keep for Round 2, and which assumptions the teaching staff want me to validate first.

## Short demo sequence

1. Open `poc/proplead_demo.html` or import the n8n workflow.
2. Run the English qualified-buyer example.
3. Point out the extracted fields, 100/100 score and PM-101 match.
4. Run the German example without a budget.
5. Show that the budget remains blank and human review is required.
6. Return to Slide 11 and connect the demo to the evaluation criteria.

## Likely questions

### Why did you choose a rules baseline instead of an LLM?

Round 1 tests the process and the success criteria. A transparent baseline gives me a reliable comparison for the LLM version in Round 2 and directly addresses the client's concern about explainability.

### Why does follow-up score higher but remain secondary?

Follow-up is easier to automate, but qualification and matching address the earlier bottleneck and provide a stronger end-to-end MVP capability.

### Are the internal figures real?

No. The company profile and operational metrics are synthetic discovery assumptions. The market context uses public sources. A real pilot would replace the assumptions with measured agency data.

### Is this high-risk under the EU AI Act?

The planned use does not make legal, employment, credit or access-to-essential-service decisions. It supports sales staff and keeps a human reviewer. I will document the formal classification and transparency obligations in Round 2.

### How will you protect personal data?

The pilot will minimise collected fields, define retention, restrict access and avoid sensitive characteristics in scoring. Development uses synthetic data only. Round 2 will include a data-flow map, lawful-basis analysis and short DPIA.
