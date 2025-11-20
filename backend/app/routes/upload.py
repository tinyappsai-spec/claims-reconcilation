from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Optional

from app.utils.csv_loader import load_claims, load_invoices
from app.utils.reconciliation import ReconciliationService

router = APIRouter()
service = ReconciliationService()


@router.post("/upload")
async def upload_files(
    claims: Optional[UploadFile] = File(None),
    invoices: Optional[UploadFile] = File(None),
):
    if not claims and not invoices:
        raise HTTPException(status_code=400, detail="Upload requires at least one CSV file.")

    errors = []
    response = {}

    # --- Process claims file if provided ---
    if claims:
        try:
            claims_data = load_claims(claims)
            service.load_claims(claims_data)
            response["claims"] = f"{len(claims_data)} claims loaded"
        except Exception as e:
            errors.append(f"Claims CSV error: {str(e)}")

    # --- Process invoices file if provided ---
    if invoices:
        try:
            invoices_data = load_invoices(invoices)
            service.load_invoices(invoices_data)
            response["invoices"] = f"{len(invoices_data)} invoices loaded"
        except Exception as e:
            errors.append(f"Invoices CSV error: {str(e)}")

    # Return *all* errors at once
    if errors:
        raise HTTPException(status_code=400, detail=errors)

    # --- Perform reconciliation if both datasets exist ---
    if service.claims is not None and service.invoices is not None:
        reconciliation_data = service.reconcile()
        response["reconciliation"] = reconciliation_data
    else:
        response["reconciliation"] = (
            "Not performed — both claims and invoices are required."
        )

    return response


def get_service():
    return service
