import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

export interface ReconciliationResult {
  claim_id: string;
  patient_id: string;
  patient_name: string;
  date_of_service: string;
  charges_amount: number;
  invoice_total?: number | null;
  status: "BALANCED" | "OVERPAID" | "UNDERPAID" | "N/A";
}

export interface SummaryStats {
  total_claims: number;
  balanced: number;
  overpaid: number;
  underpaid: number;
  no_invoices: number;
}

interface ReconciliationContextType {
  reconciliation: ReconciliationResult[];
  filtered: ReconciliationResult[];
  setReconciliation: (data: ReconciliationResult[]) => void;
  setResults: (data: ReconciliationResult[]) => void;

  summary: SummaryStats | null;
  updateFilter: (patientName: string | null) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;
  error?: Error | null;
  setError: (error: Error | null) => void;

  clear: () => void;
}

const ReconciliationContext = createContext<ReconciliationContextType | null>(
  null
);

export const ReconciliationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [reconciliation, setReconciliation] = useState<ReconciliationResult[]>(
    []
  );
  const [filtered, setFiltered] = useState<ReconciliationResult[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const setResults = (data: ReconciliationResult[]) => {
    setReconciliation(data);
    setFiltered(data); // default: filtered = all results
  };

  // Summary always calculated from the *filtered* dataset
  const summary: SummaryStats | null = useMemo(() => {
    if (!filtered.length) return null;
    return filtered.reduce<SummaryStats>(
      (acc, r) => {
        acc.total_claims++;
        if (r.status === "BALANCED") acc.balanced++;
        if (r.status === "OVERPAID") acc.overpaid++;
        if (r.status === "UNDERPAID") acc.underpaid++;
        if (r.status === "N/A") acc.no_invoices++;
        return acc;
      },
      {
        total_claims: 0,
        balanced: 0,
        overpaid: 0,
        underpaid: 0,
        no_invoices: 0,
      }
    );
  }, [filtered]);

  // Called from UI to apply filter
  const updateFilter = (patientName: string | null) => {
    if (!patientName || patientName === "ALL") {
      setFiltered(reconciliation);
    } else {
      setFiltered(reconciliation.filter((r) => r.patient_name === patientName));
    }
  };

  const clear = () => {
    setReconciliation([]);
    setFiltered([]);
    setLoading(false);
    setError(null);
  };

  return (
    <ReconciliationContext.Provider
      value={{
        reconciliation,
        filtered,
        setReconciliation,
        setResults,
        summary,
        updateFilter,
        loading,
        setLoading,
        error,
        setError,
        clear,
      }}
    >
      {children}
    </ReconciliationContext.Provider>
  );
};

export const useReconciliationContext = () => {
  const context = useContext(ReconciliationContext);
  if (!context) {
    throw new Error(
      "useReconciliationContext must be used within a ReconciliationProvider"
    );
  }
  return context;
};
