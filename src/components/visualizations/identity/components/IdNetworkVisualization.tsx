
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { NetworkData, NetworkNode } from '../hooks/useIdNetworkData';
import { 
  createDragBehavior, 
  createTooltip, 
  getNodeColor, 
  getNodeStrokeColor, 
  getTooltipContent 
} from '../utils/idNetworkUtils';

interface IdNetworkVisualizationProps {
  networkData: NetworkData;
  selectedNode: string | null;
  setSelectedNode: (node: string | null) => void;
  avatarUrl?: string;
}

const IdNetworkVisualization: React.FC<IdNetworkVisualizationProps> = ({
  networkData,
  selectedNode,
  setSelectedNode,
  avatarUrl
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { nodes, links } = networkData;

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    // Full container size with margins
    const width = 400;
    const height = 300;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Add links with appropriate styling
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .join("line")
        .attr("stroke", (d: any) => {
          const target = nodes.find(n => n.id === d.target);
          if (target?.type === 'ens-main') return target.isDotBox ? "#8b5cf6" : "#6366f1";
          if (target?.type === 'ens-other') return target.isDotBox ? "#a78bfa" : "#818cf8"; 
          if (target?.type === 'identity-nft') return "#10b981";
          if (target?.type === 'platform') return "#f59e0b";
          return "#9ca3af";
        })
        .attr("stroke-opacity", 0.7)
        .attr("stroke-width", (d: any) => Math.sqrt(d.value) * 1.5);

    // Create node groups
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll(".node")
      .data(nodes)
      .join("g")
        .attr("class", "node")
        .attr("data-id", (d: any) => d.id)
        .attr("data-name", (d: any) => d.name)
        .call(createDragBehavior(simulation) as any)
        .on("click", (event, d: any) => {
          // Toggle node selection
          // Fix: We need to set the actual node name string, not use a function here
          const nodeName = d.name;
          setSelectedNode(selectedNode === nodeName ? null : nodeName);
          
          // Reset all nodes and links
          node.selectAll("circle").attr("stroke-width", 1.5);
          link.attr("stroke-opacity", 0.7).attr("stroke-width", (d: any) => Math.sqrt(d.value) * 1.5);
          
          // Highlight selected node and its connections
          if (selectedNode !== d.name) {
            // Highlight this node
            d3.select(event.currentTarget).select("circle").attr("stroke-width", 3);
            
            // Highlight connected links
            link.filter((l: any) => {
              const source = l.source.id !== undefined ? l.source.id : l.source;
              const target = l.target.id !== undefined ? l.target.id : l.target;
              return source === d.id || target === d.id;
            })
            .attr("stroke-opacity", 1)
            .attr("stroke-width", (l: any) => Math.sqrt(l.value) * 2);
          }
        });

    // Add circles to nodes with styling based on node type
    node.append("circle")
      .attr("r", (d: any) => {
        if (d.type === "user") return 30;
        if (d.type === "ens-main") return 25;
        if (d.type === "ens-other") return 20;
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

    // If we have an avatar URL, create pattern for the user node
    if (avatarUrl) {
      const defs = svg.append("defs");
      const pattern = defs.append("pattern")
        .attr("id", "user-avatar")
        .attr("width", 1)
        .attr("height", 1)
        .attr("patternUnits", "objectBoundingBox");
        
      pattern.append("image")
        .attr("xlink:href", avatarUrl)
        .attr("width", 60)
        .attr("height", 60)
        .attr("preserveAspectRatio", "xMidYMid slice");
    }

    // Add labels with appropriate styling
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
        if (d.type === "user" || d.type.includes("ens")) return "bold"; 
        return "normal";
      })
      .attr("font-size", (d: any) => {
        if (d.type === "user") return "12px";
        if (d.type.includes("ens")) return "11px";
        return "10px";
      })
      .text((d: any) => {
        const displayName = d.name;
        if (d.type === "user") {
          return displayName.length > 12 ? displayName.substring(0, 12) + "..." : displayName;
        } else if (d.type.includes("ens")) {
          return displayName.length > 12 ? displayName.substring(0, 12) + "..." : displayName;
        } else {
          return displayName.length > 10 ? displayName.substring(0, 10) + "..." : displayName;
        }
      });

    // Add background to text for better readability
    node.insert("circle", "text")
      .attr("r", (d: any) => {
        if (d.type === "user") return 25;
        if (d.type === "ens-main") return 22;
        if (d.type === "ens-other") return 18;
        return 16;
      })
      .attr("fill", (d: any) => {
        if (d.type === "user") return avatarUrl ? "transparent" : "#3b82f6";
        return getNodeColor(d.type, d.isDotBox);
      })
      .attr("opacity", (d: any) => d.type === "user" && avatarUrl ? 0 : 0.9);

    // Add icons or badges for special types
    node.filter((d: any) => d.type.includes("ens"))
      .append("text")
      .attr("x", 12)
      .attr("y", -12)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-weight", "bold")
      .attr("font-size", "10px")
      .text((d: any) => d.isDotBox ? "BOX" : "ENS");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => {
        // Keep nodes within boundaries
        d.x = Math.max(margin.left + 30, Math.min(width - margin.right - 30, d.x));
        d.y = Math.max(margin.top + 30, Math.min(height - margin.bottom - 30, d.y));
        return `translate(${d.x},${d.y})`;
      });
    });

    // Add tooltip
    const tooltip = createTooltip();

    // Add tooltip behavior
    node.on("mouseover", function(event, d: any) {
      tooltip.style("visibility", "visible")
        .html(() => getTooltipContent(d))
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mousemove", function(event) {
      tooltip.style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
      tooltip.style("visibility", "hidden");
    });

    // Cleanup on unmount
    return () => {
      tooltip.remove();
    };
  }, [nodes, links, selectedNode, avatarUrl, setSelectedNode]);

  return (
    <svg 
      ref={svgRef}
      className="w-full h-full"
      style={{ maxHeight: "100%", maxWidth: "100%", overflow: "visible" }}
    ></svg>
  );
};

export default IdNetworkVisualization;
