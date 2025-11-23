import React, { useState, useMemo, useEffect } from "react";
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
//import PieReconciliationChart from "./charts/PieChart";

type ChartType = "BAR" | "PIE";

const ReconciliationChart: React.FC = () => {
  const { reconciliation, updateFilter, filtered, selectedPatient } =
    useReconciliationContext();
  const [chartType, setChartType] = useState<ChartType>("BAR");
  const [selectedPatientDropDown, setselectedPatientDropDown] =
    useState<string>("ALL");

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
    setselectedPatientDropDown(name);
    const rows = indexedByPatient[name] || [];

    updateFilter(name === "ALL" ? null : name, rows);
  };

  const chartData = useMemo(() => {
    console.log("Recalculating chart data…");
    const counts = { BALANCED: 0, OVERPAID: 0, UNDERPAID: 0, "N/A": 0 };

    for (const r of filtered) counts[r.status]++;

    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [filtered]);

  useEffect(() => {
    handlePatientChange(selectedPatient ?? "ALL");
  }, [selectedPatient]);

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

            <select
              data-testid="patient-select"
              value={selectedPatientDropDown}
              onChange={(e) => handlePatientChange(e.target.value)}
              style={{ padding: "6px 8px", borderRadius: 4 }}
            >
              {patientOptions.map((name) => (
                <option key={name} value={name}>
                  {name === "ALL" ? "All Patients" : name}
                </option>
              ))}
            </select>
          </Stack>

          <Paper sx={{ p: 2 }}>
            {chartType === "BAR" ? (
              <>
                <BarReconciliationChart data={chartData} />
              </>
            ) : (
              <>
                {/*
              <PieReconciliationChart
                data={chartData}
                selectedStatus={selectedStatus}
                onSelectStatus={handleStatusSelect}
              />
              */}
              </>
            )}
          </Paper>
        </Box>
      )}
    </>
  );
};

export default ReconciliationChart;
