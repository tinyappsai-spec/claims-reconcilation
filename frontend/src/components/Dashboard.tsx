import React from "react";
import { useReconciliationContext } from "../context/Context";
import { CircularProgress, Typography, Box, Grid, Paper } from "@mui/material";

const Dashboard: React.FC = () => {
  const { summary, loading } = useReconciliationContext();

  if (loading) return <CircularProgress />;

  if (!summary) return <Typography>No summary data available.</Typography>;

  // Convert summary object to entries for easier mapping
  const summaryItems = Object.entries(summary);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Summary
      </Typography>
      <Grid container spacing={2}>
        {summaryItems.map(([key, value]) => (
          <Grid>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="subtitle2" color="textSecondary">
                {key.replace(/([A-Z])/g, " $1")}
              </Typography>
              <Typography variant="h6">{value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
