import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ErrorIcon from "@mui/icons-material/Error";
import apiClient from "../api/apiClient";
import { useReconciliationContext } from "../context/Context";

const REQUIRED_CLAIMS_COLUMNS = [
  "claim_id",
  "patient_id",
  "date_of_service",
  "charges_amount",
];
const REQUIRED_INVOICE_COLUMNS = [
  "invoice_id",
  "claim_id",
  "transaction_value",
];

const CSVUploader: React.FC = () => {
  const [claimsFile, setClaimsFile] = useState<File | null>(null);
  const [invoicesFile, setInvoicesFile] = useState<File | null>(null);
  const [claimsValid, setClaimsValid] = useState<boolean | null>(null);
  const [invoicesValid, setInvoicesValid] = useState<boolean | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { reconciliation, setResults, clear } = useReconciliationContext();

  const claimsInputRef = useRef<HTMLInputElement>(null);
  const invoicesInputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setClaimsFile(null);
    setInvoicesFile(null);
    setClaimsValid(null);
    setInvoicesValid(null);
    setUploadError(null);

    if (claimsInputRef.current) claimsInputRef.current.value = "";
    if (invoicesInputRef.current) invoicesInputRef.current.value = "";

    clear();
    setLoading(false);
  };

  const validateCsv = async (file: File, requiredColumns: string[]) => {
    const text = await file.text();
    const headers = text
      .split("\n")[0]
      .split(",")
      .map((h) => h.trim());
    const missing = requiredColumns.filter((col) => !headers.includes(col));
    return { valid: missing.length === 0, missingColumns: missing };
  };

  const handleClaimsSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setClaimsFile(file);
    setClaimsValid(null);
    setUploadError(null);
    if (!file) return;

    const { valid, missingColumns } = await validateCsv(
      file,
      REQUIRED_CLAIMS_COLUMNS
    );
    setClaimsValid(valid);
    if (!valid)
      setUploadError(`Claims CSV missing: ${missingColumns.join(", ")}`);
  };

  const handleInvoicesSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    setInvoicesFile(file);
    setInvoicesValid(null);
    setUploadError(null);
    if (!file) return;

    const { valid, missingColumns } = await validateCsv(
      file,
      REQUIRED_INVOICE_COLUMNS
    );
    setInvoicesValid(valid);
    if (!valid)
      setUploadError(`Invoices CSV missing: ${missingColumns.join(", ")}`);
  };

  const handleUpload = async () => {
    if (!claimsFile || !invoicesFile || !claimsValid || !invoicesValid) return;
    setUploadError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("claims", claimsFile);
      formData.append("invoices", invoicesFile);

      const { data } = await apiClient.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload response data:", data);
      setResults(data.reconciliation || []);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setUploadError(
        Array.isArray(detail) ? detail.join(" | ") : detail || "Upload failed."
      );
      handleClear();
    } finally {
      setLoading(false);
    }
  };

  const isReadyToUpload = claimsValid && invoicesValid;

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Upload CSV Files
      </Typography>

      <Stack spacing={3} alignItems="start">
        {/* ====== TOP ROW: CLAIMS + INVOICES ====== */}
        <Stack direction="row" spacing={4} justifyContent="center">
          {/* CLAIMS */}
          <Box textAlign="center">
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              color={claimsValid ? "success" : "primary"}
            >
              Upload Claims CSV
              <input
                ref={claimsInputRef}
                hidden
                accept=".csv"
                type="file"
                onChange={handleClaimsSelect}
              />
            </Button>
            {claimsValid && <CheckCircleIcon sx={{ ml: 1, color: "green" }} />}
            {claimsValid === false && (
              <ErrorIcon sx={{ ml: 1, color: "red" }} />
            )}
          </Box>

          {/* INVOICES */}
          <Box textAlign="center">
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              color={invoicesValid ? "success" : "primary"}
            >
              Upload Invoices CSV
              <input
                ref={invoicesInputRef}
                hidden
                accept=".csv"
                type="file"
                onChange={handleInvoicesSelect}
              />
            </Button>
            {invoicesValid && (
              <CheckCircleIcon sx={{ ml: 1, color: "green" }} />
            )}
            {invoicesValid === false && (
              <ErrorIcon sx={{ ml: 1, color: "red" }} />
            )}
          </Box>
        </Stack>

        {/* ERROR */}
        {uploadError && <Typography color="error">{uploadError}</Typography>}

        {/* ====== BOTTOM ROW: UPLOAD + CLEAR ====== */}
        <Stack direction="row" spacing={3} justifyContent="center">
          <Button
            variant="contained"
            disabled={!isReadyToUpload || loading}
            onClick={handleUpload}
            startIcon={
              loading ? <CircularProgress size={20} /> : <CloudUploadIcon />
            }
          >
            {loading ? "Uploading..." : "Upload Files"}
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleClear}
            disabled={reconciliation.length === 0}
          >
            Clear Results
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default CSVUploader;
