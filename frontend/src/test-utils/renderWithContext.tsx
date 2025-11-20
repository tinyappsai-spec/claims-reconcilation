import { render } from "@testing-library/react";
import { ReconciliationProvider } from "../context/Context";

export const renderWithContext = (ui: React.ReactElement) => {
  return render(<ReconciliationProvider>{ui}</ReconciliationProvider>);
};
