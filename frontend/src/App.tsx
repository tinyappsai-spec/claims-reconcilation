import { ReconciliationProvider } from "./context/Context";

import Home from "./pages/Home";

function App() {
  return (
    <ReconciliationProvider>
      <Home />
    </ReconciliationProvider>
  );
}

export default App;
