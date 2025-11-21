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
  const { reconciliation, updateFilter, filtered } = useReconciliationContext();

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [chartType, setChartType] = useState<ChartType>("BAR");
  const [selectedPatient, setSelectedPatient] = useState<string>("ALL");

  const indexedByPatient = useMemo(() => {
    const map: Record<string, any[]> = { ALL: reconciliation };

    reconciliation.forEach((row) => {
      if (!map[row.patient_name]) map[row.patient_name] = [];
      map[row.patient_name].push(row);
    });

    return map;
  }, [reconciliation]);

  const patientOptions = useMemo(() => {
    return Object.keys(indexedByPatient);
  }, [indexedByPatient]);

  const handlePatientChange = (name: string) => {
    setSelectedPatient(name);

    const rows = indexedByPatient[name] || [];

    updateFilter(name === "ALL" ? null : name, rows);
  };

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

            {/* CHART TYPE BUTTON */}
            <Button
              variant={chartType === "BAR" ? "contained" : "outlined"}
              onClick={() => setChartType("BAR")}
            >
              Bar Chart
            </Button>

            {/* PATIENT DROPDOWN */}
            <Select
              data-testid="patient-select"
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
