import React from "react";
import { useReconciliationContext } from "../context/Context";
import { CircularProgress, Typography, Box, Grid, Paper } from "@mui/material";
import { useMutationState } from "@tanstack/react-query";

const Dashboard: React.FC = () => {
  const { analytics } = useReconciliationContext();

  const uploadStatus = useMutationState({
    filters: { mutationKey: ["uploadClaims"] },
    select: (mutation) => mutation.state.status,
  });

  const loading = uploadStatus.includes("pending");

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const summary = analytics?.summary;
  if (!summary) return <Typography sx={{ p: 2 }}>No summary data available.</Typography>;

  const summaryItems = Object.entries(summary);

  const formatKey = (key: string) =>
    key
      .replace(/_/g, " ") // replace underscores
      .replace(/([A-Z])/g, " $1") // spaces before capital letters
      .replace(/\s+/g, " ") // normalize spacing
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize words

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Summary
      </Typography>

      <Grid container spacing={2}>
        {summaryItems.map(([key, value]) => (
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={key}>
            <Paper sx={{ p: 2, textAlign: "center", height: '100%' }}>
              <Typography variant="subtitle2" color="textSecondary">
                {formatKey(key)}
              </Typography>
              <Typography variant="h6">{(value as any)}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
