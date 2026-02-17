import React from "react";
import {
    AreaChart,
    Area,
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
    areas: { key: string; color: string; name?: string; stackId?: string }[];
    height?: number;
}

const BaseAreaChart: React.FC<Props> = ({ data, xKey, areas, height = 300 }) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                {areas.map((area) => (
                    <Area
                        key={area.key}
                        type="monotone"
                        dataKey={area.key}
                        stackId={area.stackId}
                        stroke={area.color}
                        fill={area.color}
                        name={area.name || area.key}
                        fillOpacity={0.6}
                    />
                ))}
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default React.memo(BaseAreaChart);
