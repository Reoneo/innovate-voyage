
import React from 'react';
import * as d3 from 'd3';
import { NetworkNode } from '../../hooks/useIdNetworkData';
import { getNodeColor, getNodeStrokeColor } from '../../utils/idNetworkUtils';

interface NodeElementsProps {
  node: d3.Selection<any, any, any, any>;
  avatarUrl?: string;
  setSelectedNode: (node: string | null) => void;
  selectedNode: string | null;
}

/**
 * Component to render the visual elements of network nodes
 */
export const renderNodeElements = ({
  node,
  avatarUrl,
  setSelectedNode,
  selectedNode
}: NodeElementsProps) => {
  // Add circles to nodes with styling based on node type
  node.append("circle")
    .attr("r", (d: any) => {
      if (d.type === "user") return 30;
      if (d.type === "ens-domain") return 22;
      if (d.type === "identity-nft") return 18;
      return 18;
    })
    .attr("fill", (d: any) => {
      if (d.type === "user") {
        if (d.avatar) return `url(#user-avatar)`;
        return "#3b82f6"; 
      }
      return getNodeColor(d.type, d.isDotBox);
    })
    .attr("stroke", (d: any) => getNodeStrokeColor(d.type, d.isDotBox))
    .attr("stroke-width", 1.5);

  // Add text labels to nodes
  node.append("text")
    .attr("dy", (d: any) => d.type === "user" ? 0 : 0)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", (d: any) => {
      if (d.type === "user") return avatarUrl ? "#ffffff" : "#ffffff";
      if (d.type.includes("ens")) return "#ffffff";
      return "#ffffff";
    })
    .attr("font-weight", (d: any) => {
      if (d.type === "user" || d.type === "ens-domain") return "bold"; 
      return "normal";
    })
    .attr("font-size", (d: any) => {
      if (d.type === "user") return "12px";
      if (d.type === "ens-domain") return "11px";
      return "10px";
    })
    .text((d: any) => {
      const displayName = d.name;
      if (d.type === "user") {
        return displayName.length > 12 ? displayName.substring(0, 12) + "..." : displayName;
      } else if (d.type === "ens-domain") {
        return displayName.length > 12 ? displayName.substring(0, 12) + "..." : displayName;
      } else {
        return displayName.length > 10 ? displayName.substring(0, 10) + "..." : displayName;
      }
    });

  // Add background circle for better text visibility
  node.insert("circle", "text")
    .attr("r", (d: any) => {
      if (d.type === "user") return 25;
      if (d.type === "ens-domain") return 20;
      return 16;
    })
    .attr("fill", (d: any) => {
      if (d.type === "user") return avatarUrl ? "transparent" : "#3b82f6";
      return getNodeColor(d.type, d.isDotBox);
    })
    .attr("opacity", (d: any) => d.type === "user" && avatarUrl ? 0 : 0.9);

  // Add type indicators for ENS domains
  node.filter((d: any) => d.type === "ens-domain")
    .append("text")
    .attr("x", 12)
    .attr("y", -12)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "10px")
    .text((d: any) => d.isDotBox ? "BOX" : "ENS");
};
