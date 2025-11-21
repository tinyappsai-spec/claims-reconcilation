import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useReconciliationContext } from "../context/Context";

interface Row {
  claim_id: string;
  patient_id: string;
  patient_name: string;
  date_of_service: string;
  charges_amount: number;
  invoice_total?: number | null;
  credit?: number | null;
  status: "BALANCED" | "OVERPAID" | "UNDERPAID" | "N/A";
}

const statusColors: Record<Row["status"], string> = {
  BALANCED: "green",
  UNDERPAID: "orange",
  OVERPAID: "red",
  "N/A": "grey",
};

const DataTable: React.FC = () => {
  const { reconciliation, loading, error } = useReconciliationContext();
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error">
        Error loading reconciliation data: {error.message}
      </Typography>
    );
  }

  const mappedRows: Row[] = (reconciliation ?? []).map((r) => ({
    claim_id: r.claim_id,
    patient_id: String(r.patient_id),
    patient_name: r.patient_name ?? `Patient ${r.patient_id}`,
    date_of_service: r.date_of_service ?? "",
    charges_amount: r.charges_amount,
    invoice_total: r.invoice_total ?? null,
    status: r.status,
    credit_total: r.credit ?? null,
  }));

  const filteredRows = filterStatus
    ? mappedRows.filter((r) => r.status === filterStatus)
    : mappedRows;

  const columns: GridColDef<Row>[] = [
    { field: "claim_id", headerName: "Claim ID", width: 150, filterable: true },
    {
      field: "patient_name",
      headerName: "Patient Name",
      width: 200,
      filterable: true,
    },
    {
      field: "date_of_service",
      headerName: "Date of Service",
      width: 150,
      filterable: true,
    },
    {
      field: "charges_amount",
      headerName: "Charges",
      width: 120,
      filterable: true,
    },
    {
      field: "invoice_total",
      headerName: "Invoice Total",
      width: 150,
      filterable: true,
      valueGetter: (params: any) => (params ? params : "N/A"),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      filterable: true,
      type: "singleSelect",
      valueOptions: ["BALANCED", "OVERPAID", "UNDERPAID", "N/A"],
      renderCell: (params) => (
        <Typography
          sx={{
            color: statusColors[params.value as Row["status"]],
            fontWeight: "normal",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "credit_total",
      headerName: "Credit",
      width: 150,
      filterable: true,
      valueGetter: (params: any) =>
        params !== null && params !== undefined ? params : "N/A",
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        getRowId={(row) => row.claim_id}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
        }}
        disableRowSelectionOnClick
        autoHeight
      />
    </Box>
  );
};

export default DataTable;
