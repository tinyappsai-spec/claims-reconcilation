export interface Claim {
  claim_id: string;
  patient_id: number;
  date_of_service: string;
  charges_amount: number;
}

export interface Invoice {
  invoice_id: string;
  claim_id: string;
  transaction_value: number;
}

export interface ReconciliationResult {
  claim_id: string;
  patient_id: string;
  patient_name: string;
  charges_amount: number;
  date_of_service: string;
  invoice_total: number | null;
  status: "BALANCED" | "OVERPAID" | "UNDERPAID" | "N/A";
}

export interface SummaryStats {
  total_claims: number;
  balanced: number;
  overpaid: number;
  underpaid: number;
  no_invoices: number;
}
