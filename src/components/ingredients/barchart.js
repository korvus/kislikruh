import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList
} from "recharts";

// ✅ Tooltip personnalisé
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip" style={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px'
            }}>
                <p style={{ fontWeight: 'bold', margin: 0 }}>{payload[0].name}</p>
                <p style={{ margin: 0 }}>Valeur : {payload[0].value}</p>
            </div>
        );
    }
    return null;
};

// ✅ Fonction pour normaliser en pourcentage
const processDataForPercentage = (data) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return data
        .map((item) => ({
            ...item,
            percentage: total > 0 ? (item.value / total) * 100 : 0
        }))
        .sort((a, b) => b.value - a.value); // 🔥 Tri décroissant des valeurs
};

// ✅ Composant BarChart
const BarChartComponent = ({ data }) => {
    const formattedData = processDataForPercentage(data);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                layout="vertical"
                data={formattedData}
                margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
            >
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#8884d8" stroke="#ccc">
                    {formattedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    {/* ✅ Labels bien positionnés grâce à LabelList */}
                    <LabelList
                        dataKey="percentage"
                        position="right"
                        formatter={(val) => (val < 1 ? "<1%" : `${val.toFixed(0)}%`)}
                        style={{ fill: "#000", fontSize: "12px" }}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarChartComponent;