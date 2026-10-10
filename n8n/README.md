# PropLead Round 2 n8n POC

## Quick start

1. Import `n8n/proplead_round2_poc.json` into n8n.
2. Run the `Manual trigger` entry point.
3. Review the final `Agent review queue` output.

## Included demo cases

- Spanish qualified lead with a catalogue match: returns `PM-101`, keeps `preferred_features` separate from `must_have_features`, and remains review-gated.
- German incomplete lead: triggers deterministic escalation because `budget_eur` is missing.

## Guardrails

- No external sending.
- No credentials required.
- Synthetic data only.
- UTF-8 Spanish and German characters are preserved.
- The workflow is separate from the deployed browser MVP and from the LangSmith OpenAI evaluation.

## Rebuild

```bash
node n8n/build_round2_poc.js
```
