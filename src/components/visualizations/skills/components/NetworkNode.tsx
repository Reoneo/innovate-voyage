
import React from 'react';
import { PassportSkill } from '@/lib/utils';

interface NetworkNodeProps {
  node: any;
  skills: PassportSkill[];
  onMouseOver: (event: React.MouseEvent, d: any) => void;
  onMouseMove: (event: React.MouseEvent) => void;
  onMouseOut: () => void;
}

const NetworkNode: React.FC<NetworkNodeProps> = ({ 
  node, 
  skills, 
  onMouseOver,
  onMouseMove,
  onMouseOut
}) => {
  // Create SVG elements for a node group
  return (
    <g 
      className="node"
      data-id={node.id}
      data-name={node.name}
      onMouseOver={(e) => onMouseOver(e, node)}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
    >
      <circle
        r={node.type === "user" ? 30 : node.type === "ens" ? 25 : 20}
        fill={getNodeFillColor(node)}
        stroke={getNodeStrokeColor(node)}
        strokeWidth={1.5}
      />
      
      {/* Background circle for text visibility */}
      <circle
        r={node.type === "user" ? 25 : node.type === "ens" ? 22 : 18}
        fill={getBackgroundFill(node)}
        opacity={node.type === "user" && node.avatarUrl ? 0 : 0.9}
      />
      
      {/* Node label text */}
      <text
        dy={node.type === "user" ? 0 : 0}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={getTextColor(node)}
        fontWeight={node.type === "user" || node.type === "ens" ? "bold" : "normal"}
        fontSize={node.type === "user" ? "12px" : "11px"}
      >
        {truncateText(node.name, node.type)}
      </text>
      
      {/* Verification badge */}
      {(node.type !== "user" && node.verified) || node.type === "ens" ? (
        <>
          <circle
            cx={12}
            cy={-12}
            r={8}
            fill={node.type === "ens" ? "#6366f1" : "#10b981"}
            stroke="white"
            strokeWidth={1.5}
          />
          <text
            x={12}
            y={-12}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="10px"
          >
            {node.type === "ens" ? "E" : "✓"}
          </text>
        </>
      ) : null}
    </g>
  );
};

// Helper functions for node styling
function getNodeFillColor(node: any): string {
  if (node.type === "user") {
    return node.avatarUrl ? `url(#user-avatar)` : "#3b82f6";
  }
  if (node.type === "ens") return "#6366f1";
  return node.verified ? "#10b981" : "#9ca3af";
}

function getNodeStrokeColor(node: any): string {
  if (node.type === "user") return "#1d4ed8";
  if (node.type === "ens") return "#4f46e5";
  return node.verified ? "#059669" : "#6b7280";
}

function getBackgroundFill(node: any): string {
  if (node.type === "user") return node.avatarUrl ? "transparent" : "#3b82f6";
  if (node.type === "ens") return "#6366f1";
  return node.verified ? "#10b981" : "#9ca3af";
}

function getTextColor(node: any): string {
  if (node.type === "user") return node.avatarUrl ? "#ffffff" : "#ffffff";
  if (node.type === "ens") return "#ffffff";
  return node.verified ? "white" : "#374151";
}

function truncateText(text: string, type: string): string {
  if (type === "user") {
    return text.length > 12 ? text.substring(0, 12) + "..." : text;
  } else if (type === "ens") {
    return text.length > 12 ? text.substring(0, 12) + "..." : text;
  } else {
    return text.length > 10 ? text.substring(0, 10) + "..." : text;
  }
}

export default NetworkNode;
