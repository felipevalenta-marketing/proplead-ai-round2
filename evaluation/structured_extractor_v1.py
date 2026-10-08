"""Structured LLM extraction target for the PropLead LangSmith experiment."""

from __future__ import annotations

import json
import os
from typing import Any


EXTRACTION_SCHEMA: dict[str, Any] = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "language": {"type": "string", "enum": ["en", "de", "es"]},
        "budget_eur": {"type": ["integer", "null"]},
        "locations": {"type": "array", "items": {"type": "string"}},
        "property_type": {
            "type": ["string", "null"],
            "enum": ["apartment", "villa", "house", "townhouse", "finca", None],
        },
        "min_bedrooms": {"type": ["integer", "null"]},
        "timeline_months": {"type": ["integer", "null"]},
        "purpose": {
            "type": ["string", "null"],
            "enum": ["primary_residence", "second_home", "investment", None],
        },
        "financing_status": {
            "type": ["string", "null"],
            "enum": ["cash", "mortgage", "pre_approved", None],
        },
        "must_escalate": {"type": "boolean"},
        "risk_flags": {"type": "array", "items": {"type": "string"}},
        "human_review_required": {"type": "boolean", "enum": [True]},
    },
    "required": [
        "language",
        "budget_eur",
        "locations",
        "property_type",
        "min_bedrooms",
        "timeline_months",
        "purpose",
        "financing_status",
        "must_escalate",
        "risk_flags",
        "human_review_required",
    ],
}


SYSTEM_PROMPT = """You extract explicitly stated real-estate lead requirements.
Return only facts supported by the original message. Never infer missing preferences.
Normalise Mallorca place names while preserving their intended location.
Use null for unknown scalar values and [] for no explicit locations.
Set must_escalate=true for legal/tax/mortgage guarantees, conflicting values,
mixed-language ambiguity, vague requests that cannot be matched safely, or other
cases requiring specialist review. human_review_required must always be true.
Do not recommend properties and do not draft a customer response."""


def validate_extraction(output: dict[str, Any]) -> list[str]:
    """Return human-readable schema errors without third-party dependencies."""
    errors: list[str] = []
    required = EXTRACTION_SCHEMA["required"]
    missing = [key for key in required if key not in output]
    if missing:
        errors.append(f"missing keys: {', '.join(missing)}")
    if output.get("language") not in {"en", "de", "es"}:
        errors.append("language must be en, de or es")
    if not isinstance(output.get("locations"), list):
        errors.append("locations must be a list")
    if not isinstance(output.get("risk_flags"), list):
        errors.append("risk_flags must be a list")
    if output.get("human_review_required") is not True:
        errors.append("human_review_required must be true")
    for key in ("budget_eur", "min_bedrooms", "timeline_months"):
        value = output.get(key)
        if value is not None and (not isinstance(value, int) or value < 0):
            errors.append(f"{key} must be a non-negative integer or null")
    return errors


def extract_with_openai(inputs: dict[str, Any]) -> dict[str, Any]:
    """Run the versioned structured extractor. Requires OPENAI_API_KEY."""
    try:
        from openai import OpenAI
        from langsmith import wrappers
    except ImportError as exc:  # pragma: no cover - exercised in configured env
        raise RuntimeError(
            "Install evaluation/requirements-langsmith.txt before running the hosted experiment."
        ) from exc

    model = os.getenv("OPENAI_MODEL", "gpt-5.4-mini")
    client = wrappers.wrap_openai(OpenAI())
    response = client.chat.completions.create(
        model=model,
        temperature=0,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": json.dumps(
                    {
                        "source_channel": inputs["source_channel"],
                        "original_message": inputs["message"],
                    },
                    ensure_ascii=False,
                ),
            },
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "proplead_extraction",
                "strict": True,
                "schema": EXTRACTION_SCHEMA,
            },
        },
    )
    content = response.choices[0].message.content
    if not content:
        raise RuntimeError("The model returned no structured extraction.")
    output = json.loads(content)
    errors = validate_extraction(output)
    if errors:
        raise ValueError("Invalid structured output: " + "; ".join(errors))
    return output

