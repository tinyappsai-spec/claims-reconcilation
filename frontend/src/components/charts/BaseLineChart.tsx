import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

interface Props {
    data: any[];
    xKey: string;
    lines: { key: string; color: string; name?: string }[];
    height?: number;
}

const BaseLineChart: React.FC<Props> = ({ data, xKey, lines, height = 300 }) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                {lines.map((line) => (
                    <Line
                        key={line.key}
                        type="monotone"
                        dataKey={line.key}
                        stroke={line.color}
                        name={line.name || line.key}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default React.memo(BaseLineChart);
