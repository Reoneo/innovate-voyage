
import * as d3 from 'd3';

interface NodeElementsProps {
  node: d3.Selection<any, any, any, any>;
  avatarUrl?: string;
  setSelectedNode: (node: string | null) => void;
  selectedNode: string | null;
}

/**
 * Render node elements (circles, text, icons)
 */
export const renderNodeElements = ({
  node,
  avatarUrl,
  selectedNode
}: NodeElementsProps) => {
  // Add circles to nodes with appropriate styling
  node.append("circle")
    .attr("r", (d: any) => {
      // Larger radius for main user node
      if (d.type === "user") return 30;
      // Medium size for ENS domains
      if (d.type === "ens-domain") return 25;
      // Smaller for other nodes
      return 20;
    })
    .attr("fill", (d: any) => {
      // User avatar for central node if available
      if (d.type === "user" && avatarUrl) {
        return "url(#user-avatar)";
      }
      
      // Colors for different node types
      switch (d.type) {
        case "user": return "#3b82f6"; // Blue
        case "ens-domain": 
          return d.isDotBox ? "#8b5cf6" : "#6366f1"; // Purple for .box, Indigo for .eth
        case "identity-nft": return "#10b981"; // Green
        case "platform": return "#f59e0b"; // Amber
        default: return "#9ca3af"; // Gray
      }
    })
    .attr("stroke", (d: any) => {
      // Darker stroke colors
      switch (d.type) {
        case "user": return "#1d4ed8";
        case "ens-domain": 
          return d.isDotBox ? "#7c3aed" : "#4f46e5";
        case "identity-nft": return "#059669";
        case "platform": return "#d97706";
        default: return "#6b7280";
      }
    })
    .attr("stroke-width", (d: any) => {
      // Highlight selected node
      return d.name === selectedNode ? 3 : 1.5;
    })
    .attr("class", "node-circle");

  // Add background circle for text visibility
  node.append("circle")
    .attr("r", (d: any) => {
      if (d.type === "user") return 25;
      if (d.type === "ens-domain") return 22;
      return 18;
    })
    .attr("fill", (d: any) => {
      // Make transparent if user has avatar
      if (d.type === "user" && avatarUrl) return "transparent";
      
      // Colors matching outer circle
      switch (d.type) {
        case "user": return "#3b82f6";
        case "ens-domain": 
          return d.isDotBox ? "#8b5cf6" : "#6366f1";
        case "identity-nft": return "#10b981";
        case "platform": return "#f59e0b";
        default: return "#9ca3af";
      }
    })
    .attr("opacity", (d: any) => {
      // Full opacity unless user node with avatar
      return (d.type === "user" && avatarUrl) ? 0 : 0.9;
    })
    .attr("class", "node-background");

  // Add text labels for each node
  node.append("text")
    .attr("dy", (d: any) => {
      // Center text vertically
      return d.type === "user" ? 0 : 0;
    })
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", (d: any) => {
      // White text for all node types
      return "#ffffff";
    })
    .attr("font-weight", (d: any) => {
      // Bold text for user and ENS nodes
      return (d.type === "user" || d.type === "ens-domain") ? "bold" : "normal";
    })
    .attr("font-size", (d: any) => {
      // Larger font for user node
      return d.type === "user" ? "12px" : "11px";
    })
    .attr("class", "node-text")
    .text((d: any) => {
      // Truncate text if too long
      const text = d.name;
      const maxLength = d.type === "user" ? 12 : 10;
      return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    });

  // Add badges for ENS domains to distinguish them
  node.filter((d: any) => d.type === "ens-domain")
    .append("circle")
    .attr("cx", 12)
    .attr("cy", -12)
    .attr("r", 8)
    .attr("fill", (d: any) => d.isDotBox ? "#7c3aed" : "#4f46e5")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5)
    .attr("class", "badge-circle");

  node.filter((d: any) => d.type === "ens-domain")
    .append("text")
    .attr("x", 12)
    .attr("y", -12)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", "white")
    .attr("font-size", "10px")
    .attr("class", "badge-text")
    .text((d: any) => d.isDotBox ? "B" : "E");
};
