# LangSmith evaluation status

## Current status

The LangSmith-hosted experiments have been executed. This file records the completed dataset, baseline and structured-extractor run for the Round 2 capstone.

## Completed offline baseline

- Configuration: `baseline_rules_v2-aa6c6b86`
- Dataset: `proplead_multilingual_v1`
- Languages: 6 English, 6 German, 6 Spanish
- Automated test suite: 27/27 passing
- Explicit-field accuracy: 100% on the current synthetic dataset
- Language accuracy: 100%
- Exact expected matching: 100%
- Escalation accuracy: 100%
- Human-review gate: 100%

Detailed results are available in `baseline_results.md` and `baseline_results.json`.

## Structured experiment

1. Dataset: `proplead_multilingual_v1`
2. Baseline: `baseline_rules_v2-aa6c6b86`
3. Structured experiment: `structured_extractor_v1-fd0b3bae`
4. Execution date: 2026-10-03
5. Model: `openai:gpt-5.4-mini`
6. Cases: 18 total — 6 English, 6 German and 6 Spanish
7. Decision: REVISE the structured extractor by adding deterministic escalation rules.

## Runner prepared

The project now includes a reproducible experiment runner:

- `structured_extractor_v1.py`: strict-schema LLM extraction target.
- `run_baseline_case.js`: adapter around the existing tested JavaScript baseline.
- `run_langsmith_experiment.py`: dataset creation, evaluators and experiment execution.
- `requirements-langsmith.txt`: isolated evaluation dependencies.

Local validation without credentials:

```bash
python evaluation/run_langsmith_experiment.py --validate-only
```

Hosted execution after configuring `LANGSMITH_API_KEY` and `OPENAI_API_KEY`:

```bash
python -m pip install -r evaluation/requirements-langsmith.txt
python evaluation/run_langsmith_experiment.py --target baseline
python evaluation/run_langsmith_experiment.py --target structured
```

Optional environment settings:

```text
LANGSMITH_DATASET=proplead_multilingual_v1
OPENAI_MODEL=gpt-5.4-mini
```

The runner is prepared and the hosted runs have completed; do not add new claims here unless the underlying execution changes.

## Promotion rule

The structured extractor cannot replace the baseline if it introduces any critical-field fabrication, availability violation or missed mandatory escalation, even if its average extraction score is higher.

## Archived notes

- Trace URLs are intentionally omitted from this offline summary.
- The completed run record above is the authoritative status for this capstone snapshot.
