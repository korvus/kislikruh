// PieChartComponent.js
import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip" style={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px',
                width: 'auto'
            }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{`${payload[0].name}`}</p>
                <p style={{ margin: 0 }}>{`Valeur : ${payload[0].value}`}</p>
            </div>
        );
    }

    return null;
};

/*
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

*/

const PieChartComponent = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    nameKey="name"
                    cx="50%"
                    cy="100%"
                    fill="#8884d8"
                    outerRadius="180%"
                    label={({ name, percent, x, y, cx }) => {
                        const displayPercent = percent * 100 < 1 ? "(<1%)" : `(${(percent * 100).toFixed(0)}%)`;

                        return (
                            <text
                                x={x}
                                y={y}
                                textAnchor={x > cx ? "start" : "end"}
                                style={{
                                    fill: "#000",
                                    fontSize: "12px"
                                }}
                            >
                                {`${name} ${displayPercent}`}
                            </text>
                        );
                    }}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default PieChartComponent;