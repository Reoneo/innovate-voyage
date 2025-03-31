import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { NetworkData } from '../hooks/useIdNetworkData';
import { createTooltip, getTooltipContent } from '../utils/idNetworkUtils';

interface UseNetworkVisualizationProps {
  networkData: NetworkData;
  selectedNode: string | null;
  setSelectedNode: (node: string | null) => void;
  avatarUrl?: string;
}

/**
 * Custom hook to handle the D3.js network visualization logic.
 */
export function useNetworkVisualization({
  networkData,
  selectedNode,
  setSelectedNode,
  avatarUrl
}: UseNetworkVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { nodes, links } = networkData;

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    const width = 400;
    const height = 300;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    // Initialize the SVG container
    const svg = initializeSvg(svgRef.current, width, height);

    // Define the force simulation
    const simulation = createForceSimulation(nodes, links, width, height);

    // Create and append links to the SVG
    const linkElements = createLinks(svg, links, nodes);

    // Add user avatar if available
    if (avatarUrl) {
      addUserAvatar(svg, avatarUrl);
    }

    // Create and append nodes to the SVG
    const nodeElements = createNodes(svg, nodes, simulation, selectedNode, setSelectedNode, avatarUrl);

    // Set up the simulation ticks
    simulation.on("tick", () => {
      updateLinkPositions(linkElements);
      updateNodePositions(nodeElements, margin, width, height);
    });

    // Add tooltips to nodes
    const tooltip = createTooltip();
    setupNodeTooltips(nodeElements, tooltip);

    // Cleanup function
    return () => {
      tooltip.remove();
    };
  }, [nodes, links, selectedNode, avatarUrl, setSelectedNode]);

  return svgRef;
}

/**
 * Initializes the SVG container.
 */
function initializeSvg(svgElement: SVGSVGElement, width: number, height: number) {
  const svg = d3.select(svgElement);
  svg.selectAll("*").remove(); // Clear previous contents

  svg.attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`);

  return svg;
}

/**
 * Creates the force simulation for the network graph.
 */
function createForceSimulation(nodes: any[], links: any[], width: number, height: number) {
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(30));

  return simulation;
}

/**
 * Creates and appends link elements to the SVG.
 */
function createLinks(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, links: any[], nodes: any[]) {
  return svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke", (d: any) => {
      const target = nodes.find(n => n.id === d.target);
      if (target?.type === 'ens-domain') return target.isDotBox ? "#8b5cf6" : "#6366f1";
      return "#9ca3af";
    })
    .attr("stroke-opacity", 0.7)
    .attr("stroke-width", (d: any) => Math.sqrt(d.value) * 1.5);
}

/**
 * Adds user avatar to the SVG defs.
 */
function addUserAvatar(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, avatarUrl: string) {
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

/**
 * Creates and appends node elements to the SVG.
 */
function createNodes(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  nodes: any[],
  simulation: d3.ForceSimulation<any, any>,
  selectedNode: string | null,
  setSelectedNode: (node: string | null) => void,
  avatarUrl?: string
) {
  const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll(".node")
    .data(nodes)
    .join("g")
    .attr("class", "node")
    .attr("data-id", (d: any) => d.id)
    .attr("data-name", (d: any) => d.name)
    .call(dragBehavior(simulation) as any)
    .on("click", (event: any, d: any) => {
      const nodeName = d.name;
      setSelectedNode(selectedNode === nodeName ? null : nodeName);

      node.selectAll("circle").attr("stroke-width", 1.5);
      svg.selectAll(".links line").attr("stroke-opacity", 0.7).attr("stroke-width", (d: any) => Math.sqrt(d.value) * 1.5);

      if (selectedNode !== d.name) {
        d3.select(event.currentTarget).select("circle").attr("stroke-width", 3);

        svg.selectAll(".links line").filter((l: any) => {
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
    .attr("r", (d: any) => d.type === "user" ? 30 : 22)
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
    .attr("dy", 0)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", (d: any) => {
      if (d.type === "user") return avatarUrl ? "#ffffff" : "#ffffff";
      return "#ffffff";
    })
    .attr("font-weight", (d: any) => {
      return d.type === "user" || d.type === "ens-domain" ? "bold" : "normal";
    })
    .attr("font-size", (d: any) => {
      return d.type === "user" ? "12px" : "11px";
    })
    .text((d: any) => {
      const displayName = d.name;
      if (d.type === "user") {
        return displayName.length > 12 ? displayName.substring(0, 12) + "..." : displayName;
      } else {
        return displayName.length > 12 ? displayName.substring(0, 12) + "..." : displayName;
      }
    });

  // Add background circle for text visibility
  node.insert("circle", "text")
    .attr("r", (d: any) => {
      return d.type === "user" ? 25 : 20;
    })
    .attr("fill", (d: any) => {
      if (d.type === "user") return avatarUrl ? "transparent" : "#3b82f6";
      return getNodeColor(d.type, d.isDotBox);
    })
    .attr("opacity", (d: any) => d.type === "user" && avatarUrl ? 0 : 0.9);

  // Add ENS/BOX labels to domain nodes
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

  return node;
}

/**
 * Defines the drag behavior for the nodes.
 */
function dragBehavior(simulation: d3.ForceSimulation<any, any>) {
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
 * Updates the positions of the links based on the simulation.
 */
function updateLinkPositions(linkElements: d3.Selection<any, unknown, null, undefined>) {
  linkElements
    .attr("x1", (d: any) => d.source.x)
    .attr("y1", (d: any) => d.source.y)
    .attr("x2", (d: any) => d.target.x)
    .attr("y2", (d: any) => d.target.y);
}

/**
 * Updates the positions of the nodes based on the simulation.
 */
function updateNodePositions(
  nodeElements: d3.Selection<any, unknown, null, undefined>,
  margin: { top: number; right: number; bottom: number; left: number },
  width: number,
  height: number
) {
  nodeElements.attr("transform", (d: any) => {
    d.x = Math.max(margin.left + 30, Math.min(width - margin.right - 30, d.x));
    d.y = Math.max(margin.top + 30, Math.min(height - margin.bottom - 30, d.y));
    return `translate(${d.x},${d.y})`;
  });
}

/**
 * Sets up the tooltips for the nodes.
 */
function setupNodeTooltips(
  nodeElements: d3.Selection<any, unknown, null, undefined>,
  tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>
) {
  nodeElements.on("mouseover", function (event: any, d: any) {
    tooltip.style("visibility", "visible")
      .html(() => getTooltipContent(d))
      .style("top", (event.pageY - 10) + "px")
      .style("left", (event.pageX + 10) + "px");
  })
    .on("mousemove", function (event: any) {
      tooltip.style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
    });
}

/**
 * Get color for a node based on its type
 */
function getNodeColor(nodeType: string, isDotBox?: boolean) {
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
function getNodeStrokeColor(nodeType: string, isDotBox?: boolean) {
  if (nodeType === "user") return "#1d4ed8";
  if (nodeType === "ens-domain") {
    // Updated stroke color handling for all ENS domains
    return isDotBox ? "#7c3aed" : "#4f46e5";
  }
  if (nodeType === "identity-nft") return "#059669";
  if (nodeType === "platform") return "#b45309";
  return "#6b7280";
}
