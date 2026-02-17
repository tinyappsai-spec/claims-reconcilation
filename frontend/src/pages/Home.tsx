import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
import CSVUploader from "../components/CSVUploader";
import Dashboard from "../components/Dashboard";
import DashboardAnalytics from "../components/DashboardAnalytics";
import DataTable from "../components/DataTable";

const Home: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom mt={3}>
        Claims Reconciliation System
      </Typography>
      <CSVUploader />
      <Dashboard />
      <DashboardAnalytics />
      {<DataTable />}
    </Container>
  );
};

export default Home;
