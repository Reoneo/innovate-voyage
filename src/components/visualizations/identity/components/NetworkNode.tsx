
import React from 'react';
import * as d3 from 'd3';
import { NetworkNode as NetworkNodeType } from '../hooks/useIdNetworkData';
import { getNodeColor, getNodeStrokeColor } from '../utils/idNetworkUtils';

interface NetworkNodeProps {
  node: NetworkNodeType;
  simulation: d3.ForceSimulation<any, any>;
  selectedNode: string | null;
  setSelectedNode: (node: string | null) => void;
  getTooltipContent: (node: NetworkNodeType) => string;
  tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>;
}

const NetworkNode: React.FC<NetworkNodeProps> = ({
  node,
  simulation,
  selectedNode,
  setSelectedNode,
  getTooltipContent,
  tooltip
}) => {
  // Create a D3 drag behavior
  const dragBehavior = d3.drag()
    .on("start", (event) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    })
    .on("drag", (event) => {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    })
    .on("end", (event) => {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    });

  const handleMouseOver = (event: React.MouseEvent) => {
    tooltip.style("visibility", "visible")
      .html(getTooltipContent(node))
      .style("top", (event.pageY - 10) + "px")
      .style("left", (event.pageX + 10) + "px");
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    tooltip.style("top", (event.pageY - 10) + "px")
      .style("left", (event.pageX + 10) + "px");
  };

  const handleMouseOut = () => {
    tooltip.style("visibility", "hidden");
  };

  return (
    <g
      className="node"
      data-id={node.id}
      data-name={node.name}
      onClick={() => {
        setSelectedNode(selectedNode === node.name ? null : node.name);
      }}
      onMouseOver={handleMouseOver}
      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseOut}
    >
      {/* Background circle for text visibility */}
      <circle
        r={node.type === "user" ? 25 : 20}
        fill={node.type === "user" && node.avatar ? "transparent" : getNodeColor(node.type, node.isDotBox)}
        opacity={node.type === "user" && node.avatar ? 0 : 0.9}
      />
      
      {/* Main node circle */}
      <circle
        r={node.type === "user" ? 30 : 22}
        fill={node.type === "user" && node.avatar ? `url(#user-avatar)` : getNodeColor(node.type, node.isDotBox)}
        stroke={getNodeStrokeColor(node.type, node.isDotBox)}
        strokeWidth={selectedNode === node.name ? 3 : 1.5}
      />
      
      {/* Node label */}
      <text
        dy={0}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={node.type === "user" && !node.avatar ? "#ffffff" : "#ffffff"}
        fontWeight={node.type === "user" || node.type === "ens-domain" ? "bold" : "normal"}
        fontSize={node.type === "user" ? "12px" : "11px"}
      >
        {node.name.length > 12 ? node.name.substring(0, 12) + "..." : node.name}
      </text>
      
      {/* ENS/BOX labels for domain nodes */}
      {node.type === "ens-domain" && (
        <text
          x={12}
          y={-12}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontWeight="bold"
          fontSize="10px"
        >
          {node.isDotBox ? "BOX" : "ENS"}
        </text>
      )}
    </g>
  );
};

export default NetworkNode;
