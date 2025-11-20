import random
import csv
import logging
import os
from faker import Faker

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

fake = Faker()

def generate_patients(n=2000):
    logging.info(f"Generating {n} patients...")
    patients = [{"patient_id": i, "name": fake.name()} for i in range(1, n+1)]
    logging.info(f"Generated {len(patients)} patients.")
    return patients

def generate_claims(patients):
    logging.info("Generating claims for patients...")
    claims = []
    for p in patients:
        for _ in range(random.randint(10, 100)):
            claims.append({
                "claim_id": fake.uuid4(),
                "patient_id": p["patient_id"],
                "date_of_service": fake.date_this_decade().isoformat(),
                "charges_amount": random.randint(100, 5000),
            })
    logging.info(f"Generated {len(claims)} claims.")
    return claims

def generate_invoices(claims, balance_ratio=0.25):
    logging.info("Generating invoices for claims...")
    invoices = []

    # Determine balanced claims
    num_balanced = int(len(claims) * balance_ratio)
    balanced_claim_ids = set(c["claim_id"] for c in random.sample(claims, num_balanced))
    logging.info(f"{num_balanced} claims will have balanced invoices.")

    for c in claims:
        num_invoices = random.randint(0, 5)
        for i in range(num_invoices):
            if c["claim_id"] in balanced_claim_ids and i == 0:
                invoices.append({
                    "invoice_id": fake.uuid4(),
                    "claim_id": c["claim_id"],
                    "transaction_value": c["charges_amount"],
                })
                balanced_claim_ids.remove(c["claim_id"])
            else:
                invoices.append({
                    "invoice_id": fake.uuid4(),
                    "claim_id": c["claim_id"],
                    "transaction_value": random.randint(-500, 5000),
                })

    logging.info(f"Generated {len(invoices)} invoices.")
    return invoices

def write_csv(filename, rows):
    if not rows:
        logging.warning(f"No rows to write for {filename}. Skipping.")
        return

    # Use host path if provided via environment variable, otherwise script folder
    host_output_dir = os.environ.get("HOST_OUTPUT_DIR")
    if host_output_dir:
        os.makedirs(host_output_dir, exist_ok=True)
        filepath = os.path.join(host_output_dir, filename)
    else:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        filepath = os.path.join(script_dir, filename)

    try:
        with open(filepath, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)
        logging.info(f"Wrote {len(rows)} rows to {filepath}.")
    except Exception as e:
        logging.error(f"Error writing {filename}: {e}")

if __name__ == "__main__":
    try:
        patients = generate_patients()
        claims = generate_claims(patients)
        invoices = generate_invoices(claims, balance_ratio=0.25)

        write_csv("claims.csv", claims)
        write_csv("invoices.csv", invoices)

        logging.info("Sample data generation complete.")
    except Exception as e:
        logging.exception(f"An error occurred: {e}")
