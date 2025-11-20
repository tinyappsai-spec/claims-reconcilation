import os
import io
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}

def test_upload_and_reconcile_flow():
    claims_csv = (
        "claim_id,patient_id,date_of_service,charges_amount\n"
        "c1,1,2023-01-01,100\n"
    )

    invoices_csv = (
        "invoice_id,claim_id,transaction_value\n"
        "i1,c1,100\n"
    )

    # ---- Upload both files in a single request ----
    files = {
        "claims": ("claims.csv", claims_csv, "text/csv"),
        "invoices": ("invoices.csv", invoices_csv, "text/csv"),
    }

    r = client.post("/api/upload", files=files)
    assert r.status_code == 200

    data = r.json()

    # Upload responses
    assert data["claims"] == "1 claims loaded"
    assert data["invoices"] == "1 invoices loaded"
    assert "reconciliation" in data
    assert isinstance(data["reconciliation"], list)

    # Check reconciliation result
    rec_row = data["reconciliation"][0]
    assert rec_row["status"] == "BALANCED"

    # ---- Call reconciliation endpoint ----
    r = client.get("/api/reconciliation")
    assert r.status_code == 200
    rec = r.json()
    assert isinstance(rec, list)
    assert rec[0]["status"] == "BALANCED"

    # ---- Call summary endpoint ----
    r = client.get("/api/summary")
    assert r.status_code == 200
    summary = r.json()

    assert summary["total_claims"] == 1
    assert summary["balanced"] == 1
