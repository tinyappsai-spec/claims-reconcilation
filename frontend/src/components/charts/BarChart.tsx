import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Props {
  data: { status: string; count: number }[];
  selectedStatus: string | null;
  onSelectStatus: (status: string | null) => void;
}

const STATUS_COLORS: Record<string, string> = {
  BALANCED: "#4caf50",
  OVERPAID: "#f44336",
  UNDERPAID: "#ff9800",
  "N/A": "#9e9e9e",
};

const BarReconciliationChart: React.FC<Props> = ({
  data,
  selectedStatus,
  onSelectStatus,
}) => {
  return (
    <ResponsiveContainer width="50%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="status" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count">
          {data.map((entry) => (
            <Cell
              key={entry.status}
              fill={
                selectedStatus === entry.status
                  ? "#1976d2"
                  : STATUS_COLORS[entry.status]
              }
              onClick={() =>
                onSelectStatus(
                  selectedStatus === entry.status ? null : entry.status
                )
              }
              style={{ cursor: "pointer" }}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarReconciliationChart;
