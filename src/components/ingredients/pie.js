// PieChartComponent.js
import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
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

const PieChartComponent = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ name, percent, x, y, cx }) => (
                        <text
                            x={x}
                            y={y}
                            textAnchor={x > cx ? 'start' : 'end'}
                            style={{
                                fill: '#000',
                                fontSize: '12px'
                            }}
                        >
                            {`${name} (${(percent * 100).toFixed(0)}%)`}
                        </text>
                    )}
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