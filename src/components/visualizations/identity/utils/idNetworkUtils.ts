
import * as d3 from 'd3';

// Network utilities for identity visualization
export function createNetworkData(identities: any[]) {
  // Create network data structure
  return {
    nodes: identities.map((identity, index) => ({
      id: identity.id || `node-${index}`,
      name: identity.name || identity.identity,
      type: identity.platform || 'ethereum'
    })),
    links: []
  };
}

export function processIdentityData(data: any) {
  // Process identity data for visualization
  if (!data) return null;
  
  return {
    identity: data.identity || '',
    platform: data.platform || 'ethereum',
    connections: data.connections || []
  };
}

export function calculateNodePositions(nodes: any[], width: number, height: number) {
  // Calculate positions for nodes in the network
  return nodes.map((node, index) => ({
    ...node,
    x: (width / nodes.length) * index + 50,
    y: height / 2
  }));
}

// Add missing color functions
export function getNodeColor(nodeType: string, isDotBox?: boolean): string {
  if (nodeType === "user") return "#3b82f6";
  if (nodeType === "ens-domain") {
    return isDotBox ? "#8b5cf6" : "#6366f1";
  }
  if (nodeType === "identity-nft") return "#10b981";
  if (nodeType === "platform") return "#f59e0b";
  return "#9ca3af";
}

export function getNodeStrokeColor(nodeType: string, isDotBox?: boolean): string {
  if (nodeType === "user") return "#1d4ed8";
  if (nodeType === "ens-domain") {
    return isDotBox ? "#7c3aed" : "#4f46e5";
  }
  if (nodeType === "identity-nft") return "#059669";
  if (nodeType === "platform") return "#b45309";
  return "#6b7280";
}

// Add missing tooltip functions
export function createTooltip(): d3.Selection<HTMLDivElement, unknown, null, undefined> {
  return d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "rgba(0, 0, 0, 0.8)")
    .style("color", "white")
    .style("padding", "8px")
    .style("border-radius", "4px")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("z-index", "1000");
}

export function getTooltipContent(node: any): string {
  let content = `<strong>${node.name}</strong><br/>`;
  content += `Type: ${node.type}<br/>`;
  if (node.address) content += `Address: ${node.address.substring(0, 10)}...<br/>`;
  if (node.platform) content += `Platform: ${node.platform}`;
  return content;
}
