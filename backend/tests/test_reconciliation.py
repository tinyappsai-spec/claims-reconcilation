from app.utils.reconciliation import ReconciliationService
from app.models.claim import Claim
from app.models.invoice import Invoice
from datetime import date
import csv
from pathlib import Path

# Ensure patients.csv exists with patient 1 as "Mark Mcdowell"
patient_csv_path = Path("./data/patients.csv")
patient_csv_path.parent.mkdir(parents=True, exist_ok=True)  # create folder if missing
if not patient_csv_path.exists():
    with open(patient_csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["patient_id", "name"])
        writer.writerow(["1", "Mark Mcdowell"])
        writer.writerow(["2", "William Fernandez"])

def test_reconcile_balanced():
    svc = ReconciliationService()

    # Load claims and invoices
    claims = [
        Claim(claim_id="c1", patient_id="1", date_of_service="2023-01-01", charges_amount=100.0)
    ]
    invoices = [
        Invoice(invoice_id="i1", claim_id="c1", transaction_value=100.0)
    ]

    svc.load_claims(claims)
    svc.load_invoices(invoices)

    results = svc.reconcile()

    assert len(results) == 1
    result = results[0]

    # Check reconciliation status
    assert result.status == "BALANCED"

    # Check patient_id is correct as string
    assert result.patient_id == "1"

    # Check patient_name matches CSV
    assert result.patient_name == "Mark Mcdowell"

    # Check date_of_service as date object
    assert result.date_of_service == date(2023, 1, 1)

    # Check invoice_total
    assert result.invoice_total == 100.0

    # Check charges_amount
    assert result.charges_amount == 100.0

    # Check credit (should be 0 for balanced)
    assert result.credit == 0