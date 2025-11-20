import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

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

const PieReconciliationChart: React.FC<Props> = ({
  data,
  selectedStatus,
  onSelectStatus,
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          outerRadius={100}
          fill="#8884d8"
          onClick={(entry: any) =>
            onSelectStatus(
              selectedStatus === entry.status ? null : entry.status
            )
          }
        >
          {data.map((entry) => (
            <Cell
              key={entry.status}
              fill={
                selectedStatus === entry.status
                  ? "#1976d2"
                  : STATUS_COLORS[entry.status]
              }
              style={{ cursor: "pointer" }}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieReconciliationChart;
