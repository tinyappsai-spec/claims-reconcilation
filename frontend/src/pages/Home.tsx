import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
import CSVUploader from "../components/CSVUploader";
import Dashboard from "../components/Dashboard";
import ReconciliationChart from "../components/ReconciliationChart";
import DataTable from "../components/DataTable";

const Home: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom mt={3}>
        Claims Reconciliation System
      </Typography>
      <CSVUploader />
      <Dashboard />
      <ReconciliationChart />
      {<DataTable />}
    </Container>
  );
};

export default Home;
