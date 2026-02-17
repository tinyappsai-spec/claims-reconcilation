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
//import PieReconciliationChart from "./charts/PieChart";

type ChartType = "BAR" | "PIE";

const ReconciliationChart: React.FC = () => {
  const { analytics, totalRecords } = useReconciliationContext();
  const [chartType, setChartType] = useState<ChartType>("BAR");

  const chartData = useMemo(() => {
    return analytics?.status_distribution || [];
  }, [analytics]);

  return (
    <>
      {totalRecords > 0 && (
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
          </Stack>

          <Paper sx={{ p: 2 }}>
            <BarReconciliationChart data={chartData} />
          </Paper>
        </Box>
      )}
    </>
  );
};

export default ReconciliationChart;
