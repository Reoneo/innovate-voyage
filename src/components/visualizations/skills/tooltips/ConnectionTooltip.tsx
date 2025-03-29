
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

  return (
    <g className="connection-tooltip" transform={`translate(${position.x + 10},${position.y})`}>
      <rect
        width={160}
        height={70}
        rx={5}
        fill="rgba(0,0,0,0.8)"
      />
      
      <text
        x={10}
        y={20}
        fill="#3b82f6"
        fontWeight="bold"
        fontSize="10px"
        textAnchor="start"
      >
        Connection Details
      </text>
      
      <text
        x={10}
        y={40}
        fill="white"
        fontSize="10px"
        textAnchor="start"
      >
        {`Strength: ${strength}%`}
      </text>
      
      <text
        x={10}
        y={60}
        fill="white"
        fontSize="10px"
        textAnchor="start"
      >
        {`Duration: ${duration} months`}
      </text>
    </g>
  );
};

export default ConnectionTooltip;
