"""Create the PropLead LangSmith dataset and run baseline/LLM experiments."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
from pathlib import Path
from typing import Any

from structured_extractor_v1 import EXTRACTION_SCHEMA, extract_with_openai


HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
DATASET_PATH = HERE / "dataset_seed.jsonl"
DATASET_NAME = os.getenv("LANGSMITH_DATASET", "proplead_multilingual_v1")


def load_cases() -> list[dict[str, Any]]:
    return [json.loads(line) for line in DATASET_PATH.read_text(encoding="utf-8").splitlines() if line.strip()]


def validate_local() -> dict[str, Any]:
    cases = load_cases()
    languages = {language: 0 for language in ("en", "de", "es")}
    errors: list[str] = []
    for case in cases:
        languages[case["expected"]["language"]] += 1
        if not case.get("case_id") or not case.get("message") or not case.get("source_channel"):
            errors.append(f"Incomplete input: {case.get('case_id', 'unknown')}")
        missing = set(EXTRACTION_SCHEMA["required"]) - set(case["expected"])
        # risk_flags are model outputs but are not gold labels in the seed dataset.
        missing.discard("risk_flags")
        if missing:
            errors.append(f"{case['case_id']} missing references: {sorted(missing)}")
    return {"cases": len(cases), "languages": languages, "errors": errors, "status": "PASS" if not errors else "FAIL"}


def baseline_target(inputs: dict[str, Any]) -> dict[str, Any]:
    """Call the already-tested JavaScript baseline without duplicating its logic."""
    command = ["node", str(HERE / "run_baseline_case.js")]
    completed = subprocess.run(
        command,
        input=json.dumps(inputs, ensure_ascii=False),
        text=True,
        capture_output=True,
        cwd=ROOT,
        check=True,
    )
    return json.loads(completed.stdout)


def exact_field_accuracy(inputs: dict, outputs: dict, reference_outputs: dict) -> dict:
    fields = ["language", "budget_eur", "locations", "property_type", "min_bedrooms", "timeline_months", "purpose", "financing_status"]
    correct = sum(outputs.get(field) == reference_outputs.get(field) for field in fields)
    return {"key": "explicit_field_accuracy", "score": correct / len(fields)}


def language_correct(inputs: dict, outputs: dict, reference_outputs: dict) -> bool:
    return outputs.get("language") == reference_outputs.get("language")


def escalation_correct(inputs: dict, outputs: dict, reference_outputs: dict) -> bool:
    return outputs.get("must_escalate") == reference_outputs.get("must_escalate")


def human_gate_correct(inputs: dict, outputs: dict, reference_outputs: dict) -> bool:
    return outputs.get("human_review_required") is True


def no_critical_fabrication(inputs: dict, outputs: dict, reference_outputs: dict) -> dict:
    critical = ["budget_eur", "locations", "property_type", "min_bedrooms"]
    fabricated = []
    for field in critical:
        expected = reference_outputs.get(field)
        actual = outputs.get(field)
        if expected in (None, []) and actual not in (None, []):
            fabricated.append(field)
    return {"key": "no_critical_fabrication", "score": 0 if fabricated else 1, "comment": ", ".join(fabricated) or "none"}


def ensure_dataset(client: Any) -> Any:
    try:
        return client.read_dataset(dataset_name=DATASET_NAME)
    except Exception as exc:
        # Only create after confirming that this is a not-found response.
        if "not found" not in str(exc).lower() and "404" not in str(exc):
            raise
    dataset = client.create_dataset(
        dataset_name=DATASET_NAME,
        description="PropLead v1: 18 documented synthetic multilingual real-estate enquiries.",
    )
    examples = [
        {
            "inputs": {
                "case_id": case["case_id"],
                "message": case["message"],
                "source_channel": case["source_channel"],
            },
            "outputs": case["expected"],
            "metadata": {"synthetic": True, "language": case["expected"]["language"], "version": "v1"},
        }
        for case in load_cases()
    ]
    client.create_examples(dataset_id=dataset.id, examples=examples)
    return dataset


def run_hosted(target_name: str) -> None:
    from langsmith import Client

    client = Client()
    dataset = ensure_dataset(client)
    target = baseline_target if target_name == "baseline" else extract_with_openai
    prefix = "baseline_rules_v2" if target_name == "baseline" else "structured_extractor_v1"
    metadata = {"models": [] if target_name == "baseline" else [f"openai:{os.getenv('OPENAI_MODEL', 'gpt-5.4-mini')}"]}
    client.evaluate(
        target,
        data=dataset.name,
        evaluators=[exact_field_accuracy, language_correct, escalation_correct, human_gate_correct, no_critical_fabrication],
        experiment_prefix=prefix,
        description="PropLead controlled synthetic benchmark; mandatory human review.",
        max_concurrency=1 if target_name == "baseline" else 2,
        metadata=metadata,
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--validate-only", action="store_true")
    parser.add_argument("--target", choices=["baseline", "structured"], default="baseline")
    args = parser.parse_args()
    validation = validate_local()
    print(json.dumps(validation, indent=2))
    if validation["status"] != "PASS":
        raise SystemExit(1)
    if args.validate_only:
        return
    required = ["LANGSMITH_API_KEY"] + ([] if args.target == "baseline" else ["OPENAI_API_KEY"])
    missing = [name for name in required if not os.getenv(name)]
    if missing:
        raise SystemExit("Missing environment variables: " + ", ".join(missing))
    run_hosted(args.target)


if __name__ == "__main__":
    main()

