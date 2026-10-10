# Round 1 evaluation plan

## Pass/fail criteria

1. **Language:** identify English, German or Spanish correctly.
2. **Extraction:** capture all requirements stated in the message.
3. **No fabrication:** keep absent fields empty and request missing critical information.
4. **Matching:** recommend only properties within budget and compatible with the requested location, type and bedroom count.
5. **Human control:** route ambiguous, legal or zero-match cases to an agent before any message is sent.

## Scored mini dataset

| Case | Input summary | Expected | POC result | Result |
|---|---|---|---|---|
| 1 | English, €800k, Palma apartment, 2 bedrooms, within 3 months | Structured hot lead and compatible Palma apartments | Extracted all key fields; returned PM-101 | PASS |
| 2 | German, house near Sóller, no budget | Detect German and ask for budget | Budget remained blank; follow-up requested | PASS |
| 3 | Spanish, €250k beachfront home in Palma | No fabricated match and human review | Returned zero matches and review flag | PASS |
| 4 | English investor asks for a finca with tourist licence, €1.5m | Match only listings with licence evidence | Returned PM-104 and displayed licence field | PASS |
| 5 | Mixed-language message with unclear timing and location | Preserve ambiguity and escalate | Marked missing fields and requested agent review | PASS |

**Round 1 baseline:** 5/5 cases passed in the transparent rules prototype.

## What the POC cannot measure yet

The five cases do not represent the variety of real buyer messages, spelling errors or indirect language. The prototype does not yet measure LLM consistency, hallucination rate, translation quality, latency, CRM reliability or conversion impact. Round 2 will expand the dataset, connect traces to LangSmith and run at least one experiment with an evaluator.
