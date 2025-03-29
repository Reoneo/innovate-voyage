
import React from 'react';

interface SkillNodeTooltipProps {
  data: {
    name: string;
    verified: boolean;
    issuer?: string;
    projectMetadata: {
      project: string;
      description: string;
      role: string;
      timeframe: string;
      status: string;
      connections: number;
    };
  };
  position: { x: number; y: number };
}

/**
 * Tooltip component for skill nodes
 */
const SkillNodeTooltip: React.FC<SkillNodeTooltipProps> = ({ data, position }) => {
  const tooltipHeight = data.issuer ? 150 : 130;

  return (
    <g className="tooltip" transform={`translate(${position.x + 10},${position.y - 10})`}>
      {/* Tooltip background */}
      <rect
        width={200}
        height={tooltipHeight}
        rx={5}
        ry={5}
        fill="rgba(0,0,0,0.8)"
      />
      
      {/* Skill name */}
      <text
        x={10}
        y={20}
        fill="white"
        fontWeight="bold"
        fontSize="12px"
        textAnchor="start"
      >
        {data.name}
      </text>
      
      {/* Project details */}
      <text
        x={10}
        y={40}
        fill="#10b981"
        fontSize="10px"
        textAnchor="start"
      >
        {`Project: ${data.projectMetadata.project}`}
      </text>
      
      <text
        x={10}
        y={60}
        fill="white"
        fontSize="10px"
        textAnchor="start"
      >
        {`Role: ${data.projectMetadata.role}`}
      </text>
      
      <text
        x={10}
        y={80}
        fill="white"
        fontSize="10px"
        textAnchor="start"
      >
        {`Period: ${data.projectMetadata.timeframe}`}
      </text>
      
      <text
        x={10}
        y={100}
        fill="white"
        fontSize="10px"
        textAnchor="start"
      >
        {`Status: ${data.projectMetadata.status}`}
      </text>
      
      <text
        x={10}
        y={120}
        fill="white"
        fontSize="10px"
        textAnchor="start"
      >
        {`Connections: ${data.projectMetadata.connections}`}
      </text>
      
      {/* Issuer information if available */}
      {data.issuer && (
        <text
          x={10}
          y={140}
          fill="#3b82f6"
          fontSize="10px"
          textAnchor="start"
        >
          {`Verified by: ${data.issuer}`}
        </text>
      )}
    </g>
  );
};

export default SkillNodeTooltip;
