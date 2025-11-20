import io
import pytest
from app.utils.csv_loader import load_claims, load_invoices
from fastapi import UploadFile

def make_upload_file(content: str, filename: str = "f.csv"):
    bytes_io = io.BytesIO(content.encode("utf-8"))
    upload = UploadFile(filename=filename, file=bytes_io)
    return upload

def test_load_claims_good():
    csv_text = "claim_id,patient_id,date_of_service,charges_amount\nc1,1,2023-01-01,100\n"
    upload = make_upload_file(csv_text)
    claims = load_claims(upload)
    assert len(claims) == 1
    assert claims[0].claim_id == "c1"

def test_load_invoices_good():
    csv_text = "invoice_id,claim_id,transaction_value\ni1,c1,100\n"
    upload = make_upload_file(csv_text)
    invoices = load_invoices(upload)
    assert len(invoices) == 1
    assert invoices[0].invoice_id == "i1"

def test_load_claims_missing_column():
    csv_text = "claim_id,patient_id,charges_amount\nc1,1,100\n"
    upload = make_upload_file(csv_text)
    with pytest.raises(Exception):
        load_claims(upload)
