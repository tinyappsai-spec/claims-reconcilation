from typing import List, Dict
from app.models.claim import Claim
from app.models.invoice import Invoice
from app.models.schemas import ReconciliationResult, SummaryStats
from collections import defaultdict
import csv
from pathlib import Path

class ReconciliationService:
    def __init__(self):
        self.claims: List[Claim] = []
        self.invoices: List[Invoice] = []
        self.patient_map: Dict[str, str] = self._load_patients()
        self.results_cache: List[ReconciliationResult] = []

    def _load_patients(self) -> Dict[str, str]:
       
        patient_csv = Path(__file__).parent.parent / "data" / "patients.csv"
        mapping = {}
        if patient_csv.exists():
            with open(patient_csv, newline="", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    mapping[row["patient_id"]] = row["name"]
        return mapping

    def load_claims(self, claims: List[Claim]):
        self.claims = claims
        self.results_cache = [] # Clear cache on new data load

    def load_invoices(self, invoices: List[Invoice]):
        self.invoices = invoices
        self.results_cache = [] # Clear cache on new data load

    def reconcile(self) -> List[ReconciliationResult]:
        inv_map: Dict[str, List[Invoice]] = defaultdict(list)
        for inv in self.invoices:
            inv_map[inv.claim_id].append(inv)

        results: List[ReconciliationResult] = []

        for c in self.claims:
            related_invoices = inv_map.get(c.claim_id, [])
            invoice_total = sum(i.transaction_value for i in related_invoices)

            if not related_invoices:
                status = "N/A"
                invoice_total = None
                credit = None
            else:
                credit = invoice_total - c.charges_amount
                if credit == 0:
                    status = "BALANCED"
                elif credit > 0:
                    status = "OVERPAID"
                else:
                    status = "UNDERPAID"

            results.append(
                ReconciliationResult(
                    claim_id=c.claim_id,
                    patient_id=str(c.patient_id),
                    patient_name=self.patient_map.get(str(c.patient_id), f"Patient {c.patient_id}"),
                    date_of_service=c.date_of_service,
                    charges_amount=c.charges_amount,
                    invoice_total=invoice_total,
                    status=status,
                    credit=credit
                )
            )

        self.results_cache = results
        return results

    def get_results(self, skip: int = 0, limit: int = 100) -> List[ReconciliationResult]:
        return self.results_cache[skip: skip + limit]

    def summary(self, results: List[ReconciliationResult]) -> SummaryStats:
        return SummaryStats(
            total_claims=len(results),
            balanced=sum(r.status == "BALANCED" for r in results),
            overpaid=sum(r.status == "OVERPAID" for r in results),
            underpaid=sum(r.status == "UNDERPAID" for r in results),
            no_invoices=sum(r.status == "N/A" for r in results),
        )

    def get_analytics(self) -> Dict:
        if not self.results_cache:
            return {}

        # 1. Status Overview
        status_counts = defaultdict(int)
        # 2. Top Patients logic
        patient_stats = defaultdict(lambda: {"count": 0, "overpaid": 0, "underpaid": 0, "total_charges": 0})
        # 3. Trends logic
        daily_trends = defaultdict(lambda: {"count": 0, "charges": 0, "invoices": 0, "balanced": 0})
        # 4. Distribution
        charge_bins = defaultdict(int)

        for r in self.results_cache:
            status_counts[r.status] += 1
            
            p = patient_stats[r.patient_name]
            p["count"] += 1
            if r.status == "OVERPAID": p["overpaid"] += (r.credit or 0)
            if r.status == "UNDERPAID": p["underpaid"] += abs(r.credit or 0)
            p["total_charges"] += r.charges_amount

            ds = r.date_of_service or "Unknown"
            dt = daily_trends[ds]
            dt["count"] += 1
            dt["charges"] += r.charges_amount
            dt["invoices"] += (r.invoice_total or 0)
            if r.status == "BALANCED": dt["balanced"] += 1

            # Binning for distribution (e.g., bits of 100)
            bin_idx = int(r.charges_amount // 100) * 100
            charge_bins[bin_idx] += 1

        # Process results
        top_by_count = sorted(patient_stats.items(), key=lambda x: x[1]["count"], reverse=True)[:20]
        top_by_overpaid = sorted(patient_stats.items(), key=lambda x: x[1]["overpaid"], reverse=True)[:20]
        top_by_underpaid = sorted(patient_stats.items(), key=lambda x: x[1]["underpaid"], reverse=True)[:20]

        sorted_trends = sorted(daily_trends.items(), key=lambda x: x[0])

        return {
            "status_distribution": [
                {"status": "BALANCED", "count": status_counts["BALANCED"]},
                {"status": "OVERPAID", "count": status_counts["OVERPAID"]},
                {"status": "UNDERPAID", "count": status_counts["UNDERPAID"]},
                {"status": "N/A", "count": status_counts["N/A"]},
            ],
            "top_patients_volume": [
                {"name": name, "count": s["count"]} for name, s in top_by_count
            ],
            "top_patients_overpaid": [
                {"name": name, "amount": s["overpaid"]} for name, s in top_by_overpaid if s["overpaid"] > 0
            ],
            "top_patients_underpaid": [
                {"name": name, "amount": s["underpaid"]} for name, s in top_by_underpaid if s["underpaid"] > 0
            ],
            "daily_volume_trend": [
                {"date": d, "count": s["count"]} for d, s in sorted_trends
            ],
            "financial_trend": [
                {"date": d, "charges": s["charges"], "invoices": s["invoices"]} for d, s in sorted_trends
            ],
            "accuracy_trend": [
                {"date": d, "accuracy": (s["balanced"] / s["count"] * 100) if s["count"] > 0 else 0} for d, s in sorted_trends
            ],
            "status_area_trend": [
                {"date": d, "balanced": s["balanced"], "others": s["count"] - s["balanced"]} for d, s in sorted_trends
            ],
            "financial_impact_by_status": [
                {"status": "OVERPAID", "amount": sum(p["overpaid"] for p in patient_stats.values())},
                {"status": "UNDERPAID", "amount": sum(p["underpaid"] for p in patient_stats.values())},
            ],
            "charge_distribution": sorted([
                {"bin": b, "count": c} for b, c in charge_bins.items()
            ], key=lambda x: x["bin"]),
            "summary": {
                "total": len(self.results_cache),
                "balanced": status_counts["BALANCED"],
                "overpaid": status_counts["OVERPAID"],
                "underpaid": status_counts["UNDERPAID"],
                "no_invoices": status_counts["N/A"],
            }
        }
