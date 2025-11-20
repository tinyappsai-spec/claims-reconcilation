import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  MenuItem,
  Select,
} from "@mui/material";
import { useReconciliationContext } from "../context/Context";
import BarReconciliationChart from "./charts/BarChart";
import PieReconciliationChart from "./charts/PieChart";

type ChartType = "BAR" | "PIE";

interface Props {
  onFilterChange: (status: string | null) => void;
}

const ReconciliationChart: React.FC<Props> = ({ onFilterChange }) => {
  const { reconciliation, filtered, updateFilter } = useReconciliationContext();

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [chartType, setChartType] = useState<ChartType>("BAR");
  const [selectedPatient, setSelectedPatient] = useState<string>("ALL");

  /** Build dropdown options */
  const patientOptions = useMemo(() => {
    const patients = Array.from(
      new Set(reconciliation.map((r) => r.patient_name))
    );
    return ["ALL", ...patients];
  }, [reconciliation]);

  /** When user selects patient → update global filter */
  const handlePatientChange = (name: string) => {
    setSelectedPatient(name);
    updateFilter(name === "ALL" ? null : name);
  };

  /** Status counts for charts (based on filtered list!) */
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {
      BALANCED: 0,
      OVERPAID: 0,
      UNDERPAID: 0,
      "N/A": 0,
    };

    filtered.forEach((r) => {
      counts[r.status]++;
    });

    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
    }));
  }, [filtered]);

  /** When clicking a bar/pie segment */
  const handleStatusSelect = (status: string | null) => {
    const newStatus = selectedStatus === status ? null : status;
    setSelectedStatus(newStatus);
    onFilterChange(newStatus);
  };

  return (
    <>
      {reconciliation.length > 0 && (
        <Box mb={3}>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Typography variant="h6">Reconciliation Chart</Typography>

            {/* CHART TYPE BUTTONS */}
            <Button
              variant={chartType === "BAR" ? "contained" : "outlined"}
              onClick={() => setChartType("BAR")}
            >
              Bar Chart
            </Button>

            {/* PATIENT DROPDOWN */}
            <Select
              data-testid="patient-select" // <- add this
              value={selectedPatient}
              onChange={(e) => handlePatientChange(e.target.value)}
              size="small"
            >
              {patientOptions.map((name) => (
                <MenuItem key={name} value={name}>
                  {name === "ALL" ? "All Patients" : name}
                </MenuItem>
              ))}
            </Select>
          </Stack>

          <Paper sx={{ p: 2 }}>
            {chartType === "BAR" ? (
              <BarReconciliationChart
                data={chartData}
                selectedStatus={selectedStatus}
                onSelectStatus={handleStatusSelect}
              />
            ) : (
              <PieReconciliationChart
                data={chartData}
                selectedStatus={selectedStatus}
                onSelectStatus={handleStatusSelect}
              />
            )}
          </Paper>
        </Box>
      )}
    </>
  );
};

export default ReconciliationChart;
