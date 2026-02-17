import React, { useMemo } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { useInfiniteReconciliation } from "../api/useReconciliation";
import { useReconciliationContext } from "../context/Context";
import { useMutationState } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Typography
} from "@mui/material";

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
  const { totalRecords } = useReconciliationContext();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteReconciliation();

  // Track upload mutation state
  const uploadStatus = useMutationState({
    filters: { mutationKey: ["uploadClaims"] },
    select: (mutation) => mutation.state.status,
  });

  const isUploading = uploadStatus.includes("pending");
  const uploadError = uploadStatus.length > 0 && uploadStatus[uploadStatus.length - 1] === "error";

  const allRows = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? [];
  }, [data]);

  if (isUploading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Processing records...</Typography>
      </Box>
    );
  }

  if (uploadError) {
    return (
      <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
        Error processing reconciliation data. Please try again.
      </Typography>
    );
  }

  if (totalRecords === 0) return null;

  return (
    <Paper style={{ height: 600, width: '100%', overflow: 'hidden' }}>
      <TableVirtuoso
        data={allRows}
        endReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        components={{
          Table: (props) => (
            <Table {...props} stickyHeader style={{ borderCollapse: 'separate' }} />
          ),
          TableHead: TableHead,
          TableRow: TableRow,
          TableBody: React.forwardRef((props, ref) => (
            <TableBody {...props} ref={ref} />
          )),
          Scroller: TableContainer,
        }}
        fixedHeaderContent={() => (
          <TableRow>
            <TableCell style={{ width: 150, background: 'white', fontWeight: 'bold' }}>Claim ID</TableCell>
            <TableCell style={{ width: 200, background: 'white', fontWeight: 'bold' }}>Patient Name</TableCell>
            <TableCell style={{ width: 150, background: 'white', fontWeight: 'bold' }}>Date of Service</TableCell>
            <TableCell style={{ width: 120, background: 'white', fontWeight: 'bold' }}>Charges</TableCell>
            <TableCell style={{ width: 150, background: 'white', fontWeight: 'bold' }}>Invoice Total</TableCell>
            <TableCell style={{ width: 150, background: 'white', fontWeight: 'bold' }}>Status</TableCell>
            <TableCell style={{ width: 150, background: 'white', fontWeight: 'bold' }}>Credit</TableCell>
          </TableRow>
        )}
        itemContent={(index, row: Row) => (
          <>
            <TableCell style={{ width: 150 }}>{row.claim_id}</TableCell>
            <TableCell style={{ width: 200 }}>{row.patient_name ?? `Patient ${row.patient_id}`}</TableCell>
            <TableCell style={{ width: 150 }}>{row.date_of_service}</TableCell>
            <TableCell style={{ width: 120 }}>{row.charges_amount}</TableCell>
            <TableCell style={{ width: 150 }}>{row.invoice_total ?? "N/A"}</TableCell>
            <TableCell style={{ width: 150 }}>
              <Typography
                sx={{
                  color: statusColors[row.status],
                  fontWeight: "normal",
                  fontSize: '0.875rem'
                }}
              >
                {row.status}
              </Typography>
            </TableCell>
            <TableCell style={{ width: 150 }}>{row.credit ?? "N/A"}</TableCell>
          </>
        )}
      />
      {isFetchingNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, background: '#f5f5f5' }}>
          <CircularProgress size={20} />
          <Typography variant="body2" sx={{ ml: 1 }}>Loading more...</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default React.memo(DataTable);
