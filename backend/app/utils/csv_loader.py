import csv
from io import StringIO
from typing import List
from app.models.claim import Claim
from app.models.invoice import Invoice

def load_claims(file) -> List[Claim]:
    text = file.file.read().decode("utf-8")
    reader = csv.DictReader(StringIO(text))

    return [
        Claim(
            claim_id=row["claim_id"],
            patient_id=int(row["patient_id"]),
            date_of_service=row["date_of_service"],
            charges_amount=float(row["charges_amount"])
        )
        for row in reader
    ]


def load_invoices(file) -> List[Invoice]:
    text = file.file.read().decode("utf-8")
    reader = csv.DictReader(StringIO(text))

    return [
        Invoice(
            invoice_id=row["invoice_id"],
            claim_id=row["claim_id"],
            transaction_value=float(row["transaction_value"])
        )
        for row in reader
    ]
