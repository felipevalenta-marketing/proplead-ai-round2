import json
import subprocess
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parent))

from structured_extractor_v2 import POLICY_VERSION, apply_deterministic_policy


ROOT = Path(__file__).resolve().parents[1]
DATASET_PATH = ROOT / "evaluation" / "dataset_seed.jsonl"
BASELINE_CASE = ROOT / "evaluation" / "run_baseline_case.js"


def load_cases():
    return [json.loads(line) for line in DATASET_PATH.read_text(encoding="utf-8").splitlines() if line.strip()]


def derive_policy(message, source_channel="web_form"):
    payload = json.dumps({"message": message, "source_channel": source_channel}, ensure_ascii=False)
    completed = subprocess.run(
        ["node", str(BASELINE_CASE)],
        input=payload,
        text=True,
        encoding="utf-8",
        capture_output=True,
        cwd=ROOT,
        check=True,
    )
    return json.loads(completed.stdout)


class StructuredExtractorV2Tests(unittest.TestCase):
    def test_policy_matches_documented_reference_decisions(self):
        for case in load_cases():
            with self.subTest(case_id=case["case_id"]):
                inputs = {
                    "case_id": case["case_id"],
                    "message": case["message"],
                    "source_channel": case["source_channel"],
                }
                mocked_extraction = dict(case["expected"])
                mocked_extraction.update(
                    {
                        "must_escalate": not case["expected"]["must_escalate"],
                        "human_review_required": False,
                        "risk_flags": ["mocked"],
                    }
                )
                policy = derive_policy(case["message"], case["source_channel"])
                result = apply_deterministic_policy(inputs, mocked_extraction, policy)
                self.assertEqual(result["must_escalate"], case["expected"]["must_escalate"])
                self.assertTrue(result["human_review_required"])
                for field in ("language", "budget_eur", "locations", "property_type", "min_bedrooms", "timeline_months", "purpose", "financing_status"):
                    self.assertEqual(result[field], mocked_extraction[field])

    def test_complete_arta_tourist_licence_enquiry_is_not_unnecessarily_escalated(self):
        inputs = {
            "case_id": "ARTA-01",
            "message": "Busco una finca en Artà con licencia turística, piscina, cuatro dormitorios y presupuesto de 1,4 millones.",
            "source_channel": "whatsapp",
        }
        mocked_extraction = {
            "language": "es",
            "budget_eur": 1400000,
            "locations": ["Artà"],
            "property_type": "finca",
            "min_bedrooms": 4,
            "timeline_months": None,
            "purpose": "investment",
            "financing_status": None,
            "must_escalate": True,
            "human_review_required": False,
            "risk_flags": ["mocked"],
        }
        result = apply_deterministic_policy(inputs, mocked_extraction, derive_policy(inputs["message"], inputs["source_channel"]))
        self.assertFalse(result["must_escalate"])
        self.assertTrue(result["human_review_required"])

    def test_hybrid_policy_versions_are_identified(self):
        self.assertEqual(POLICY_VERSION, "hybrid_policy_v2")

    def test_missing_budget_and_policy_sensitive_requests_escalate(self):
        cases = [
            {
                "message": "Ich suche eine Wohnung mit zwei Schlafzimmern in Palma.",
                "expected_escalation": True,
                "mocked_extraction": {
                    "language": "de",
                    "budget_eur": None,
                    "locations": ["Palma"],
                    "property_type": "apartment",
                    "min_bedrooms": 2,
                    "timeline_months": None,
                    "purpose": None,
                    "financing_status": None,
                },
            },
            {
                "message": "Can you guarantee a mortgage and tell me how to avoid property tax?",
                "expected_escalation": True,
                "mocked_extraction": {
                    "language": "en",
                    "budget_eur": None,
                    "locations": ["Mallorca"],
                    "property_type": None,
                    "min_bedrooms": None,
                    "timeline_months": None,
                    "purpose": None,
                    "financing_status": "mortgage",
                },
            },
            {
                "message": "We need a place in Palma and maybe Port de Soller.",
                "expected_escalation": True,
                "mocked_extraction": {
                    "language": "en",
                    "budget_eur": 800000,
                    "locations": ["Palma", "Sóller"],
                    "property_type": "apartment",
                    "min_bedrooms": 2,
                    "timeline_months": None,
                    "purpose": None,
                    "financing_status": None,
                },
            },
            {
                "message": "Looking for a 2-bedroom apartment in Palma with a budget of €800,000.",
                "expected_escalation": False,
                "mocked_extraction": {
                    "language": "en",
                    "budget_eur": 800000,
                    "locations": ["Palma"],
                    "property_type": "apartment",
                    "min_bedrooms": 2,
                    "timeline_months": None,
                    "purpose": None,
                    "financing_status": None,
                },
            },
            {
                "message": "Necesito algo en Mallorca.",
                "expected_escalation": True,
                "mocked_extraction": {
                    "language": "es",
                    "budget_eur": None,
                    "locations": ["Mallorca"],
                    "property_type": None,
                    "min_bedrooms": None,
                    "timeline_months": None,
                    "purpose": None,
                    "financing_status": None,
                },
            },
            {
                "message": "I am considering Palma or Santa Catalina or Port de Soller.",
                "expected_escalation": True,
                "mocked_extraction": {
                    "language": "en",
                    "budget_eur": None,
                    "locations": ["Palma", "Sóller"],
                    "property_type": "apartment",
                    "min_bedrooms": 2,
                    "timeline_months": None,
                    "purpose": None,
                    "financing_status": None,
                },
            },
            {
                "message": "Busco una vivienda en Artà con presupuesto de 1,4 millones.",
                "expected_escalation": True,
                "mocked_extraction": {
                    "language": "es",
                    "budget_eur": 1400000,
                    "locations": ["Artà"],
                    "property_type": None,
                    "min_bedrooms": None,
                    "timeline_months": None,
                    "purpose": None,
                    "financing_status": None,
                },
            },
        ]
        for case in cases:
            with self.subTest(message=case["message"]):
                policy = derive_policy(case["message"])
                mocked_extraction = {
                    **case["mocked_extraction"],
                    "must_escalate": not case["expected_escalation"],
                    "human_review_required": False,
                    "risk_flags": ["mocked"],
                }
                result = apply_deterministic_policy({"message": case["message"], "source_channel": "web_form"}, mocked_extraction, policy)
                self.assertEqual(result["must_escalate"], case["expected_escalation"])
                self.assertTrue(result["human_review_required"])

    def test_policy_never_overwrites_explicit_extraction_fields(self):
        message = "Necesito un piso en Cala d'Or para reformar, primera línea, hasta 320 mil."
        policy = derive_policy(message, "whatsapp")
        mocked_extraction = {
            "language": "es",
            "budget_eur": 320000,
            "locations": ["Cala d'Or"],
            "property_type": "apartment",
            "min_bedrooms": 2,
            "timeline_months": None,
            "purpose": "investment",
            "financing_status": None,
            "must_escalate": False,
            "human_review_required": False,
            "risk_flags": [],
        }
        result = apply_deterministic_policy({"message": message, "source_channel": "whatsapp"}, mocked_extraction, policy)
        for field in ("language", "budget_eur", "locations", "property_type", "min_bedrooms", "timeline_months", "purpose", "financing_status"):
            self.assertEqual(result[field], mocked_extraction[field])
        self.assertTrue(result["human_review_required"])

    def test_end_to_end_structured_v2_recovers_failed_matches(self):
        cases = [
            {
                "message": "Hi, I'm looking for a 2-bedroom apartment in Palma with a budget of €800,000. I would like to buy within the next three months.",
                "source_channel": "web_form",
                "extraction": {
                    "language": "en",
                    "budget_eur": 800000,
                    "locations": ["Palma"],
                    "property_type": "apartment",
                    "min_bedrooms": 2,
                    "timeline_months": 3,
                    "purpose": None,
                    "financing_status": None,
                    "must_escalate": False,
                    "human_review_required": True,
                    "risk_flags": [],
                },
                "expected_ids": ["PM-101"],
            },
            {
                "message": "I want a finca with a tourist rental licence in Artà. My budget is €1.5m and this is an investment purchase.",
                "source_channel": "whatsapp",
                "extraction": {
                    "language": "en",
                    "budget_eur": 1500000,
                    "locations": ["Artà"],
                    "property_type": "finca",
                    "min_bedrooms": None,
                    "timeline_months": None,
                    "purpose": "investment",
                    "financing_status": None,
                    "must_escalate": False,
                    "human_review_required": True,
                    "risk_flags": [],
                },
                "expected_ids": ["PM-104"],
            },
            {
                "message": "Quiero invertir hasta 1.500.000 euros en una finca con licencia turística en Artà.",
                "source_channel": "web_form",
                "extraction": {
                    "language": "es",
                    "budget_eur": 1500000,
                    "locations": ["Artà"],
                    "property_type": "finca",
                    "min_bedrooms": None,
                    "timeline_months": None,
                    "purpose": "investment",
                    "financing_status": None,
                    "must_escalate": False,
                    "human_review_required": True,
                    "risk_flags": [],
                },
                "expected_ids": ["PM-104"],
            },
            {
                "message": "Ich suche eine Wohnung mit Meerblick in Port de Soller, zwei Schlafzimmer, Budget 1,4 Millionen.",
                "source_channel": "email",
                "extraction": {
                    "language": "de",
                    "budget_eur": 1400000,
                    "locations": ["Söller"],
                    "property_type": "apartment",
                    "min_bedrooms": 2,
                    "timeline_months": None,
                    "purpose": None,
                    "financing_status": None,
                    "must_escalate": False,
                    "human_review_required": True,
                    "risk_flags": [],
                },
                "expected_ids": ["PM-103"],
            },
            {
                "message": "Wir suchen ein Haus in Sant Llorenc des Cardassar, zwei Schlafzimmer, bis 450.000 Euro. Ein Pool waere wichtig.",
                "source_channel": "web_form",
                "extraction": {
                    "language": "de",
                    "budget_eur": 450000,
                    "locations": ["Sant Llorenc des Cardassar"],
                    "property_type": "house",
                    "min_bedrooms": 2,
                    "timeline_months": None,
                    "purpose": None,
                    "financing_status": None,
                    "must_escalate": False,
                    "human_review_required": True,
                    "risk_flags": [],
                },
                "expected_ids": ["PM-105"],
            },
        ]
        from structured_extractor_v2 import extract_with_openai

        for case in cases:
            with self.subTest(message=case["message"]):
                with patch("structured_extractor_v2.extract_with_openai_v1", return_value=case["extraction"]):
                    result = extract_with_openai({"message": case["message"], "source_channel": case["source_channel"]})
                self.assertEqual(result["compatible_property_ids"], case["expected_ids"])
                self.assertTrue(result["human_review_required"])
                self.assertFalse(result["must_escalate"])


if __name__ == "__main__":
    unittest.main()

