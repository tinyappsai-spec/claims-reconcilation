from typing import List

CLAIMS_REQUIRED_COLUMNS = {"claim_id", "patient_id", "date_of_service", "charges_amount"}
INVOICES_REQUIRED_COLUMNS = {"invoice_id", "claim_id", "transaction_value"}

# allowed CORS origins while developing (update for production)
CORS_ORIGINS: List[str] = ["*"]
