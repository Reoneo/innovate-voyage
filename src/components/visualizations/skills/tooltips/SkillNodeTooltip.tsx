
import React from 'react';

interface SkillNodeTooltipProps {
  data: {
    name: string;
    verified: boolean;
    issuer?: string;
    projectMetadata?: {
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
  // Determine tooltip height based on available data
  const hasIssuer = !!data.issuer;
  const hasProjectMetadata = !!data.projectMetadata;
  const tooltipHeight = hasIssuer ? (hasProjectMetadata ? 180 : 100) : (hasProjectMetadata ? 160 : 80);
  const xOffset = position.x > 200 ? -210 : 10; // Prevent tooltip from going off-screen

  return (
    <g className="tooltip" transform={`translate(${position.x + xOffset},${position.y - 90})`}>
      {/* Tooltip background */}
      <rect
        width={200}
        height={tooltipHeight}
        rx={6}
        ry={6}
        fill="rgba(15, 23, 42, 0.9)" // Darker background for better contrast
        stroke={data.verified ? "#10b981" : "#6b7280"}
        strokeWidth={2}
      />
      
      {/* Header background */}
      <rect
        width={200}
        height={32}
        rx={6}
        ry={6}
        fill={data.verified ? "#10b981" : "#6b7280"}
      />
      
      {/* Skill name */}
      <text
        x={10}
        y={20}
        fill="white"
        fontWeight="bold"
        fontSize="14px"
        textAnchor="start"
      >
        {data.name}
      </text>
      
      {/* Verification status */}
      <text
        x={190}
        y={20}
        fill="white"
        fontSize="12px"
        textAnchor="end"
      >
        {data.verified ? "✓ Verified" : "Unverified"}
      </text>
      
      {/* Project details - Only render if projectMetadata exists */}
      {data.projectMetadata && (
        <>
          <text
            x={10}
            y={50}
            fill="#a5f3fc" // Light blue for headers
            fontSize="12px"
            fontWeight="medium"
            textAnchor="start"
          >
            Project Information
          </text>
          
          <text
            x={10}
            y={70}
            fill="white"
            fontSize="12px"
            textAnchor="start"
          >
            {data.projectMetadata.project}
          </text>
          
          <line
            x1={10}
            y1={80}
            x2={190}
            y2={80}
            stroke="#475569"
            strokeWidth={1}
          />
          
          <text
            x={10}
            y={100}
            fill="white"
            fontSize="11px"
            textAnchor="start"
          >
            {`Role: ${data.projectMetadata.role}`}
          </text>
          
          <text
            x={10}
            y={120}
            fill="white"
            fontSize="11px"
            textAnchor="start"
          >
            {`Period: ${data.projectMetadata.timeframe}`}
          </text>
          
          <text
            x={10}
            y={140}
            fill="white"
            fontSize="11px"
            textAnchor="start"
          >
            {`Status: `}
            <tspan fill={data.projectMetadata.status === "Active" ? "#10b981" : 
                      data.projectMetadata.status === "Completed" ? "#3b82f6" : "#f59e0b"}>
              {data.projectMetadata.status}
            </tspan>
          </text>
        </>
      )}
      
      {/* Issuer information if available */}
      {data.issuer && (
        <text
          x={10}
          y={hasProjectMetadata ? 165 : 60}
          fill="#a5f3fc"
          fontSize="12px"
          fontWeight="medium"
          textAnchor="start"
        >
          {`Issued by: ${data.issuer}`}
        </text>
      )}

      {/* If neither project nor issuer info is available, show basic info */}
      {!data.projectMetadata && !data.issuer && (
        <text
          x={10}
          y={60}
          fill="white"
          fontSize="12px"
          textAnchor="start"
        >
          No additional information available
        </text>
      )}
    </g>
  );
};

export default SkillNodeTooltip;
