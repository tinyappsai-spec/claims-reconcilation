import React from "react";
import { Grid, Box, Paper, Typography } from "@mui/material";
import { useReconciliationContext } from "../context/Context";
import BaseBarChart from "./charts/BaseBarChart";
import BaseLineChart from "./charts/BaseLineChart";
import BaseAreaChart from "./charts/BaseAreaChart";
import PieReconciliationChart from "./charts/PieChart";

const DashboardAnalytics: React.FC = () => {
    const { analytics, totalRecords } = useReconciliationContext();

    if (!analytics || totalRecords === 0) return null;

    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
                Advanced Reconciliation Analytics
            </Typography>

            <Grid container spacing={3}>
                {/* 1. Status Overview */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>Status Distribution</Typography>
                        <PieReconciliationChart
                            data={analytics.status_distribution}
                            selectedStatus={null}
                            onSelectStatus={() => { }}
                        />
                    </Paper>
                </Grid>

                {/* 2. Top Patients by Volume */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>Top 20 Patients by Claims</Typography>
                        <BaseBarChart
                            data={analytics.top_patients_volume}
                            xKey="name"
                            layout="vertical"
                            bars={[{ key: "count", color: "#8884d8", name: "Claims Count" }]}
                            height={500}
                        />
                    </Paper>
                </Grid>

                {/* 3. Top Patients by Overpaid */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>Top 20 Overpaid Patients ($)</Typography>
                        <BaseBarChart
                            data={analytics.top_patients_overpaid}
                            xKey="name"
                            layout="vertical"
                            bars={[{ key: "amount", color: "#f44336", name: "Overpaid Amount" }]}
                            height={500}
                        />
                    </Paper>
                </Grid>

                {/* 4. Top Patients by Underpaid */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>Top 20 Underpaid Patients ($)</Typography>
                        <BaseBarChart
                            data={analytics.top_patients_underpaid}
                            xKey="name"
                            layout="vertical"
                            bars={[{ key: "amount", color: "#ff9800", name: "Underpaid Amount" }]}
                            height={500}
                        />
                    </Paper>
                </Grid>

                {/* 5. Daily Volume Trend */}
                <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>Daily Claim Volume Trend</Typography>
                        <BaseAreaChart
                            data={analytics.daily_volume_trend}
                            xKey="date"
                            areas={[{ key: "count", color: "#82ca9d", name: "Claims" }]}
                        />
                    </Paper>
                </Grid>

                {/* 6. Financial Trend */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>Charges vs Invoices Trend</Typography>
                        <BaseLineChart
                            data={analytics.financial_trend}
                            xKey="date"
                            lines={[
                                { key: "charges", color: "#d32f2f", name: "Total Charges" },
                                { key: "invoices", color: "#2e7d32", name: "Total Invoices" }
                            ]}
                        />
                    </Paper>
                </Grid>

                {/* 7. Accuracy Trend */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>Reconciliation Accuracy Rate (%)</Typography>
                        <BaseLineChart
                            data={analytics.accuracy_trend}
                            xKey="date"
                            lines={[{ key: "accuracy", color: "#1976d2", name: "Accuracy %" }]}
                        />
                    </Paper>
                </Grid>

                {/* 8. Status Area Trend */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>Status Balance Over Time</Typography>
                        <BaseAreaChart
                            data={analytics.status_area_trend}
                            xKey="date"
                            areas={[
                                { key: "balanced", color: "#4caf50", name: "Balanced", stackId: "1" },
                                { key: "others", color: "#757575", name: "Unbalanced", stackId: "1" }
                            ]}
                        />
                    </Paper>
                </Grid>

                {/* 9. Charge Distribution */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>Claim Charge Distribution ($)</Typography>
                        <BaseBarChart
                            data={analytics.charge_distribution}
                            xKey="bin"
                            bars={[{ key: "count", color: "#9c27b0", name: "Frequency" }]}
                        />
                    </Paper>
                </Grid>

                {/* 10. Financial Impact by Status */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>Financial Impact by Status ($)</Typography>
                        <BaseBarChart
                            data={analytics.financial_impact_by_status}
                            xKey="status"
                            bars={[{ key: "amount", color: "#607d8b", name: "Total Impact ($)" }]}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardAnalytics;
