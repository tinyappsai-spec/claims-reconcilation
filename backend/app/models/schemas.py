from pydantic import BaseModel
from typing import Optional
from datetime import date


class ReconciliationResult(BaseModel):
    claim_id: str
    patient_id: str
    patient_name: str        
    date_of_service: date    
    charges_amount: float
    invoice_total: Optional[float]
    status: str  # BALANCED, OVERPAID, UNDERPAID, N/A

class SummaryStats(BaseModel):
    total_claims: int
    balanced: int
    overpaid: int
    underpaid: int
    no_invoices: int
