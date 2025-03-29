
import * as d3 from 'd3';

/**
 * Function to create a D3 drag behavior
 */
export function createDragBehavior(simulation: any) {
  function dragstarted(event: any) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }
  
  function dragged(event: any) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }
  
  function dragended(event: any) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
  
  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

/**
 * Function to create a tooltip for the network graph
 */
export function createTooltip() {
  return d3.select("body")
    .append("div")
    .attr("class", "id-network-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "rgba(0,0,0,0.8)")
    .style("color", "white")
    .style("padding", "5px 10px")
    .style("border-radius", "4px")
    .style("font-size", "12px")
    .style("pointer-events", "none");
}

/**
 * Get color for a node based on its type
 */
export function getNodeColor(nodeType: string, isDotBox?: boolean) {
  if (nodeType === "user") return "#3b82f6";
  if (nodeType === "ens-domain") {
    // Updated color handling for all ENS domains (both main and others)
    return isDotBox ? "#8b5cf6" : "#6366f1";
  }
  if (nodeType === "identity-nft") return "#10b981";
  if (nodeType === "platform") return "#f59e0b";
  return "#9ca3af";
}

/**
 * Get stroke color for a node based on its type
 */
export function getNodeStrokeColor(nodeType: string, isDotBox?: boolean) {
  if (nodeType === "user") return "#1d4ed8";
  if (nodeType === "ens-domain") {
    // Updated stroke color handling for all ENS domains
    return isDotBox ? "#7c3aed" : "#4f46e5";
  }
  if (nodeType === "identity-nft") return "#059669";
  if (nodeType === "platform") return "#b45309";
  return "#6b7280";
}

/**
 * Get tooltip HTML content for a node
 */
export function getTooltipContent(node: any) {
  if (node.type === "user") {
    return `<strong>${node.name}</strong><br>Main profile`;
  } else if (node.type === "ens-domain") {
    // Updated tooltip for all ENS domains
    const domainType = node.isDotBox ? '.box' : '.eth';
    return `<strong>${node.name}</strong><br>${domainType} ENS Domain`;
  } else if (node.type === "identity-nft") {
    return `<strong>${node.name}</strong><br>Identity NFT`;
  } else if (node.type === "platform") {
    return `<strong>${node.name}</strong><br>Web3 Platform`;
  }
  return `<strong>${node.name}</strong>`;
}
