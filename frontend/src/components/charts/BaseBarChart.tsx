import React from "react";
import {
    BarChart,
    Bar,
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
    bars: { key: string; color: string; name?: string }[];
    layout?: "horizontal" | "vertical";
    height?: number;
}

const BaseBarChart: React.FC<Props> = ({ data, xKey, bars, layout = "horizontal", height = 300 }) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart
                data={data}
                layout={layout}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                {layout === "horizontal" ? (
                    <>
                        <XAxis dataKey={xKey} />
                        <YAxis />
                    </>
                ) : (
                    <>
                        <XAxis type="number" />
                        <YAxis dataKey={xKey} type="category" width={150} />
                    </>
                )}
                <Tooltip />
                <Legend />
                {bars.map((bar) => (
                    <Bar key={bar.key} dataKey={bar.key} fill={bar.color} name={bar.name || bar.key} />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

export default React.memo(BaseBarChart);
