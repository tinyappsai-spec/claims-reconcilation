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

    def _load_patients(self) -> Dict[str, str]:
        """
        Load patient_id -> patient_name mapping from CSV.
        patient_id is kept as string for consistency.
        """
        patient_csv = Path(__file__).parent.parent / "data" / "patients.csv"
        mapping = {}
        if patient_csv.exists():
            with open(patient_csv, newline="", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    # Keep patient_id as string
                    mapping[row["patient_id"]] = row["name"]
        return mapping

    def load_claims(self, claims: List[Claim]):
        self.claims = claims

    def load_invoices(self, invoices: List[Invoice]):
        self.invoices = invoices

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
            elif invoice_total == c.charges_amount:
                status = "BALANCED"
            elif invoice_total > c.charges_amount:
                status = "OVERPAID"
            else:
                status = "UNDERPAID"

            results.append(
                ReconciliationResult(
                    claim_id=c.claim_id,
                    patient_id=str(c.patient_id),  # ensure string
                    patient_name=self.patient_map.get(str(c.patient_id), f"Patient {c.patient_id}"),
                    date_of_service=c.date_of_service,
                    charges_amount=c.charges_amount,
                    invoice_total=invoice_total,
                    status=status
                )
            )

        return results

    def summary(self, results: List[ReconciliationResult]) -> SummaryStats:
        return SummaryStats(
            total_claims=len(results),
            balanced=sum(r.status == "BALANCED" for r in results),
            overpaid=sum(r.status == "OVERPAID" for r in results),
            underpaid=sum(r.status == "UNDERPAID" for r in results),
            no_invoices=sum(r.status == "N/A" for r in results),
        )
