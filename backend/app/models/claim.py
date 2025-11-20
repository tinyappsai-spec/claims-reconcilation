from pydantic import BaseModel
from datetime import date

class Claim(BaseModel):
    claim_id: str
    patient_id: int
    date_of_service: date
    charges_amount: float
