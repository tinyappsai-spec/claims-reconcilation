import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

import { ReconciliationResult } from "../types";
import { SummaryStats } from "../types";

interface ReconciliationContextType {
  analytics: any | null; // Full analytics object from backend
  totalRecords: number;
  setAnalytics: (data: any) => void;
  setTotalRecords: (total: number) => void;
  clear: () => void;
}

const ReconciliationContext = createContext<ReconciliationContextType | null>(
  null
);

export const ReconciliationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const clear = () => {
    setAnalytics(null);
    setTotalRecords(0);
  };

  return (
    <ReconciliationContext.Provider
      value={{
        analytics,
        totalRecords,
        setAnalytics,
        setTotalRecords,
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
