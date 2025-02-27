export const WaterPieChart = ({ percentage, size = 20 }) => {
    const radius = size / 2;
    const strokeWidth = 3;
    const circumference = 2 * Math.PI * (radius - strokeWidth);
    const dashOffset = circumference * (1 - percentage / 100);

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Cercle de fond (gris) */}
            <circle
                cx={radius}
                cy={radius}
                r={radius - strokeWidth}
                fill="none"
                stroke="#fff"
                strokeWidth={strokeWidth}
            />
            <circle
                cx={radius}
                cy={radius}
                r={radius - strokeWidth}
                fill="none"
                stroke="#508bfb"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${radius} ${radius})`}
            />
        </svg>
    );
};