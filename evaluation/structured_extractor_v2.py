"""Hybrid structured extraction target for the PropLead LangSmith experiment."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path
from typing import Any

from structured_extractor_v1 import extract_with_openai as extract_with_openai_v1, validate_extraction


HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
BASELINE_CASE_SCRIPT = HERE / "run_baseline_case.js"
POLICY_VERSION = "hybrid_policy_v2"


def _run_policy_audit(inputs: dict[str, Any]) -> dict[str, Any]:
    completed = subprocess.run(
        ["node", str(BASELINE_CASE_SCRIPT)],
        input=json.dumps(inputs, ensure_ascii=False),
        text=True,
        encoding="utf-8",
        capture_output=True,
        cwd=ROOT,
        check=True,
    )
    audit = json.loads(completed.stdout)
    audit["policy_version"] = POLICY_VERSION
    return audit


def _extract_match_ids(audit: dict[str, Any]) -> list[str]:
    match_ids = audit.get("compatible_property_ids") or audit.get("match_ids") or []
    if match_ids:
        return list(match_ids)
    matches = audit.get("matches") or []
    if matches and isinstance(matches[0], dict):
        return [item["id"] for item in matches if item.get("id")]
    if matches and isinstance(matches[0], str):
        return list(matches)
    return []


def apply_deterministic_policy(
    inputs: dict[str, Any],
    extraction: dict[str, Any],
    policy_audit: dict[str, Any] | None = None,
) -> dict[str, Any]:
    audit = policy_audit or _run_policy_audit(inputs)
    audit_flags = set(audit.get("risk_flags", []))

    missing_fields: list[str] = []
    if extraction.get("budget_eur") is None:
        missing_fields.append("budget_eur")

    locations = extraction.get("locations") or []
    if not locations or locations == ["Mallorca"]:
        missing_fields.append("specific_location")

    if extraction.get("property_type") is None and extraction.get("min_bedrooms") is None:
        missing_fields.append("property_type_or_bedrooms")

    policy_sensitive_flags = {"mortgage_advice", "tax_or_legal_advice", "negotiation_or_contract"}
    ambiguity_flags = {"conflicting_budget", "ambiguous_property_type", "ambiguous_bedrooms", "mixed_language", "multiple_locations", "uncertain_requirements"}
    match_ids = _extract_match_ids(audit)
    matching_ready = not missing_fields and not audit_flags.intersection(ambiguity_flags)
    zero_safe_match = (
        matching_ready
        and not audit_flags.intersection(policy_sensitive_flags)
        and match_ids == []
        and not audit.get("missing_fields")
    )

    output = dict(extraction)
    output["must_escalate"] = bool(missing_fields or audit_flags.intersection(policy_sensitive_flags | ambiguity_flags) or zero_safe_match)
    output["human_review_required"] = True
    output["risk_flags"] = sorted(audit_flags.union(missing_fields))
    output["missing_fields"] = missing_fields
    output["qualification_status"] = "matching_ready" if matching_ready else "needs_information"
    output["compatible_property_ids"] = match_ids
    output["policy_version"] = audit.get("policy_version", POLICY_VERSION)
    return output


def extract_with_openai(inputs: dict[str, Any]) -> dict[str, Any]:
    """Run OpenAI extraction and then apply the deterministic v2 policy."""
    extraction = extract_with_openai_v1(inputs)
    errors = validate_extraction(extraction)
    if errors:
        raise ValueError("Invalid structured output: " + "; ".join(errors))
    policy_audit = _run_policy_audit(inputs)
    return apply_deterministic_policy(inputs, extraction, policy_audit)
