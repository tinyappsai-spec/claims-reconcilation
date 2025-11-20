from pydantic import BaseModel

class Invoice(BaseModel):
    invoice_id: str
    claim_id: str
    transaction_value: float
