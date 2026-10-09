# LangSmith evaluation status

## Current status

The hosted LangSmith experiments are complete. The final hybrid structured-extraction run is the promoted MVP evaluation candidate, and mandatory human review remains in place.

## Baseline reference

- Configuration: `baseline_rules_v2-aa6c6b86`
- Dataset: `proplead_multilingual_v1`
- Languages: 6 English, 6 German, 6 Spanish
- Automated test suite: 27/27 passing
- Explicit-field accuracy: 100%
- Language accuracy: 100%
- Exact expected matching: 100%
- Escalation accuracy: 100%
- Human-review gate: 100%

Detailed results are available in `baseline_results.md` and `baseline_results.json`.

## Structured v1

- Experiment: `structured_extractor_v1-fd0b3bae`
- Runs: 18/18 successful
- Language accuracy: 100%
- Human-review gate: 100%
- No-critical-fabrication: 94.4444%
- Explicit-field accuracy: 92.4%
- Escalation accuracy: 61.1%

## Initial structured v2

- Experiment: `structured_extractor_v2-8f0933a1`
- Runs: 18/18 successful
- Matching correctness: 72.2% before the fix
- Five failed cases returned empty compatible IDs: EN-01, EN-03, ES-04, DE-01 and DE-02.
- Root cause: the Windows Python-to-Node boundary was not forcing UTF-8, which corrupted euro-formatted budget text on the baseline audit path; the deterministic matching output was lost before the policy merge.

## Reproducibility fix

- `evaluation/run_baseline_case.js` now passes the fixed reference date with the current option names: `reference_date` and `availability_freshness_days`.
- Python-to-Node subprocess calls in the structured-v2 pipeline now use UTF-8 explicitly.
- The budget parser in `mvp/app.js` uses euro-safe patterns so `?800,000`, `?1.5m`, `1,4 millones` and related formats remain reproducible.
- The v2 policy now consumes deterministic match IDs directly and preserves canonical location and property-type handling.

## Final structured v2

- Experiment: `structured_extractor_v2-d2454c34`
- Runs: 18/18 successful
- Matching correctness: 100%
- Escalation correctness: 100%
- Human-review gate: 100%
- Language correctness: 100%
- Explicit-field accuracy: 93.0556%
- No-critical-fabrication: 94.4444%
- Average latency: 1.5378 seconds
- Total tokens: 7,753
- Total cost: USD 0.01120725

## Remaining limitations

- The structured extractor still misses some explicit fields in a minority of cases, so the 93.0556% explicit-field result is not production-grade automation.
- Human review remains mandatory for every outgoing response.
- The current candidate is suitable for controlled evaluation and review-gated operations, not for unattended sending.

## Promotion decision

Promote `hybrid_policy_v2` as the final MVP evaluation candidate, while keeping mandatory human review for every response.

## Runner

The project includes a reproducible experiment runner:

- `structured_extractor_v1.py`: strict-schema LLM extraction target.
- `structured_extractor_v2.py`: hybrid LLM + deterministic policy target.
- `run_baseline_case.js`: adapter around the tested JavaScript baseline.
- `run_langsmith_experiment.py`: dataset creation, evaluators and experiment execution.
- `requirements-langsmith.txt`: isolated evaluation dependencies.

Local validation without credentials:

```bash
python evaluation/run_langsmith_experiment.py --validate-only
```

## Archived notes

- Trace URLs are intentionally omitted from this offline summary.
- The final run record above is the authoritative status for this capstone snapshot.
