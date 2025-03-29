
import React from 'react';

interface ConnectionTooltipProps {
  position: { x: number; y: number };
}

/**
 * Tooltip component for skill connections
 */
const ConnectionTooltip: React.FC<ConnectionTooltipProps> = ({ position }) => {
  const strength = Math.floor(Math.random() * 100);
  const duration = Math.floor(Math.random() * 24) + 1;
  const xOffset = position.x > 200 ? -170 : 10; // Prevent tooltip from going off-screen

  return (
    <g className="connection-tooltip" transform={`translate(${position.x + xOffset},${position.y - 35})`}>
      <rect
        width={160}
        height={80}
        rx={6}
        ry={6}
        fill="rgba(15, 23, 42, 0.9)"
        stroke="#3b82f6"
        strokeWidth={2}
      />
      
      {/* Header background */}
      <rect
        width={160}
        height={30}
        rx={6}
        ry={6}
        fill="#3b82f6"
      />
      
      <text
        x={80}
        y={20}
        fill="white"
        fontWeight="bold"
        fontSize="12px"
        textAnchor="middle"
      >
        Connection Details
      </text>
      
      <line
        x1={10}
        y1={35}
        x2={150}
        y2={35}
        stroke="#475569"
        strokeWidth={1}
      />
      
      <text
        x={10}
        y={55}
        fill="white"
        fontSize="12px"
        textAnchor="start"
      >
        {`Strength: `}
        <tspan fill={strength > 75 ? "#10b981" : strength > 50 ? "#3b82f6" : strength > 25 ? "#f59e0b" : "#ef4444"}>
          {strength}%
        </tspan>
      </text>
      
      <text
        x={10}
        y={75}
        fill="white"
        fontSize="12px"
        textAnchor="start"
      >
        {`Duration: ${duration} ${duration === 1 ? 'month' : 'months'}`}
      </text>
    </g>
  );
};

export default ConnectionTooltip;
