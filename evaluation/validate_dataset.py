"""Validate the synthetic PropLead evaluation dataset against the property catalogue."""

from __future__ import annotations

import csv
import json
from collections import Counter
from pathlib import Path


ROUND2_ROOT = Path(__file__).resolve().parents[1]
DATASET_PATH = ROUND2_ROOT / "evaluation" / "dataset_seed.jsonl"
CATALOGUE_PATH = ROUND2_ROOT / "data" / "properties.csv"


def load_catalogue() -> dict[str, dict]:
    catalogue: dict[str, dict] = {}
    with CATALOGUE_PATH.open(encoding="utf-8", newline="") as source:
        for row in csv.DictReader(source):
            row["price_eur"] = int(row["price_eur"])
            row["bedrooms"] = int(row["bedrooms"])
            catalogue[row["id"]] = row
    return catalogue


def load_cases() -> list[dict]:
    cases: list[dict] = []
    for line_number, line in enumerate(
        DATASET_PATH.read_text(encoding="utf-8").splitlines(), start=1
    ):
        try:
            cases.append(json.loads(line))
        except json.JSONDecodeError as error:
            raise ValueError(f"Invalid JSON on line {line_number}: {error}") from error
    return cases


def validate_case(case: dict, catalogue: dict[str, dict]) -> list[str]:
    errors: list[str] = []
    case_id = case.get("case_id", "unknown")
    expected = case.get("expected", {})

    required_expected_keys = {
        "language",
        "budget_eur",
        "locations",
        "property_type",
        "min_bedrooms",
        "timeline_months",
        "purpose",
        "financing_status",
        "must_escalate",
        "compatible_property_ids",
        "human_review_required",
    }
    missing_keys = required_expected_keys.difference(expected)
    if missing_keys:
        errors.append(f"{case_id}: missing expected keys {sorted(missing_keys)}")
        return errors

    if expected["language"] not in {"en", "de", "es"}:
        errors.append(f"{case_id}: unsupported language {expected['language']!r}")

    if expected["human_review_required"] is not True:
        errors.append(f"{case_id}: human_review_required must be true")

    for property_id in expected["compatible_property_ids"]:
        property_record = catalogue.get(property_id)
        if property_record is None:
            errors.append(f"{case_id}: unknown property {property_id}")
            continue

        if property_record["status"] != "available":
            errors.append(f"{case_id}: {property_id} is not available")

        if not property_record.get("last_verified_at"):
            errors.append(f"{case_id}: {property_id} has no availability verification date")

        budget = expected["budget_eur"]
        if budget is not None and property_record["price_eur"] > budget:
            errors.append(f"{case_id}: {property_id} exceeds the expected budget")

        locations = expected["locations"]
        if locations and locations != ["Mallorca"] and property_record["location"] not in locations:
            errors.append(f"{case_id}: {property_id} does not match the expected location")

        property_type = expected["property_type"]
        if property_type is not None and property_record["type"] != property_type:
            errors.append(f"{case_id}: {property_id} does not match the expected type")

        min_bedrooms = expected["min_bedrooms"]
        if min_bedrooms is not None and property_record["bedrooms"] < min_bedrooms:
            errors.append(f"{case_id}: {property_id} has too few bedrooms")

    return errors


def main() -> int:
    catalogue = load_catalogue()
    cases = load_cases()
    errors = [
        error
        for case in cases
        for error in validate_case(case, catalogue)
    ]
    languages = Counter(case["expected"]["language"] for case in cases)

    report = {
        "dataset": DATASET_PATH.name,
        "cases": len(cases),
        "languages": dict(sorted(languages.items())),
        "catalogue_properties": len(catalogue),
        "errors": errors,
        "status": "PASS" if not errors else "FAIL",
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
