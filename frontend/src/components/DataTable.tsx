import React, { useState, useMemo, useEffect } from "react";
import { DataGrid, GridColDef, GridFilterModel } from "@mui/x-data-grid";
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

const initialFilterModel: GridFilterModel = { items: [] };

const DataTable: React.FC = () => {
  const { reconciliation, loading, error, filtered, setSelectedPatient } =
    useReconciliationContext();
  const [filterModel, setFilterModel] = React.useState(initialFilterModel);

  const mappedRows: Row[] = useMemo(() => {
    return (reconciliation ?? []).map((r) => ({
      claim_id: r.claim_id,
      patient_id: String(r.patient_id),
      patient_name: r.patient_name ?? `Patient ${r.patient_id}`,
      date_of_service: r.date_of_service ?? "",
      charges_amount: r.charges_amount,
      invoice_total: r.invoice_total ?? null,
      status: r.status,
      credit_total: r.credit ?? null,
    }));
  }, [reconciliation]);

  const columns: GridColDef<Row>[] = useMemo(
    () => [
      { field: "claim_id", headerName: "Claim ID", width: 150 },
      { field: "patient_name", headerName: "Patient Name", width: 200 },
      { field: "date_of_service", headerName: "Date of Service", width: 150 },
      { field: "charges_amount", headerName: "Charges", width: 120 },
      {
        field: "invoice_total",
        headerName: "Invoice Total",
        width: 150,
        valueGetter: (params: any) => params ?? "N/A",
      },
      {
        field: "status",
        headerName: "Status",
        width: 150,
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
        valueGetter: (params: any) => params ?? "N/A",
      },
    ],
    []
  );

  useEffect(() => {
    let newFilterModel: GridFilterModel;
    console.log(filtered);
    if (filtered.length === 0) {
      newFilterModel = { items: [] };
      setFilterModel(newFilterModel);
      return;
    }
    if (
      filtered[0].patient_name !== filtered[filtered.length - 1].patient_name
    ) {
      newFilterModel = {
        items: filterModel.items.filter(
          (item) => item.field !== "patient_name"
        ),
      };
    } else {
      // 1. Get all current filters *except* the existing patient filter
      const existingFilters = filterModel.items.filter(
        (item) => item.field !== "patient_name"
      );

      // 2. Add the new patient filter
      newFilterModel = {
        items: [
          ...existingFilters,
          {
            field: "patient_name",
            operator: "equals",
            value: filtered[0].patient_name,
          },
        ],
      };
    }

    // Set the new model
    setFilterModel(newFilterModel);
  }, [filtered]);

  const handleCellClick = (params: any) => {
    console.log(params);
    if (params.field === "patient_name") {
      setSelectedPatient(params.value);
    }
  };
  const handleDataGridFilterChange = (newModel: GridFilterModel) => {
    // This function runs when the user changes filters using the column menus
    setFilterModel(newModel);
  };

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
  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={mappedRows}
        columns={columns}
        getRowId={(row) => row.claim_id}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
        }}
        filterModel={filterModel}
        disableRowSelectionOnClick
        autoHeight
        onFilterModelChange={handleDataGridFilterChange}
        onCellClick={handleCellClick}
      />
    </Box>
  );
};

export default React.memo(DataTable);
