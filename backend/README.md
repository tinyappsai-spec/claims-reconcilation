# Claims Reconciliation Backend

Backend service for the **Claims Reconciliation System** built with **FastAPI**.  
It supports uploading CSV files, reconciling claims with invoices, and returning summary statistics.  
All operations are **in-memory**, making it lightweight and ideal for local testing.

---

## Requirements

- Python 3.11+
- pip
- Docker (optional, for containerized setup)

---

## Setup & Run Locally

1. Clone the repository:

```bash
git clone <repo-url>
cd claims-reconciliation/backend
Create and activate a virtual environment:

bash
Copy code
python -m venv .venv
# macOS/Linux
source .venv/bin/activate
# Windows PowerShell
.venv\Scripts\activate
Install dependencies:

bash
Copy code
pip install -r requirements.txt
Start the server:

bash
Copy code
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
Open your browser at http://localhost:8000

Run with Docker
Build and run backend container:

docker-compose up --build
Backend available at http://localhost:8000

Generate Sample CSVs
Windows:

powershell

mkdir C:\docker-output
docker run --rm -e HOST_OUTPUT_DIR=/host -v C:\docker-output:/host claims-reconciliation-backend python /app/data/generate_data.py

Mac/Linux:

mkdir -p ~/docker-output
docker run --rm -e HOST_OUTPUT_DIR=/host -v ~/docker-output:/host claims-reconciliation-backend python /app/data/generate_data.py
CSV files will be saved to the mapped host folder.

API Endpoints
Endpoint	Method	Description
/health	GET	Service health check, returns {"status": "ok"}
/api/upload/	POST	Upload claims and invoice CSV files
/api/reconciliation	GET	Returns reconciliation results
/api/summary	GET	Returns summary statistics

CSV File Requirements
Claims CSV (claims.csv):

csv

claim_id,patient_id,date_of_service,charges_amount
c1,1,2023-01-01,100
c2,2,2023-02-15,250
Invoices CSV (invoices.csv):

csv

invoice_id,claim_id,transaction_value
i1,c1,100
i2,c2,200
i3,c2,50

Testing
Run all tests:


pytest -q
Covers reconciliation logic, CSV validation, and end-to-end API flows using FastAPI TestClient.
```
