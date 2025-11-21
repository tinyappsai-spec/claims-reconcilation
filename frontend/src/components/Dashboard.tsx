import React from "react";
import { useReconciliationContext } from "../context/Context";
import { CircularProgress, Typography, Box, Grid, Paper } from "@mui/material";

const Dashboard: React.FC = () => {
  const { summary, loading } = useReconciliationContext();

  if (loading) return <CircularProgress />;

  if (!summary) return <Typography>No summary data available.</Typography>;

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
          <Grid key={key}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="subtitle2" color="textSecondary">
                {formatKey(key)}
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
