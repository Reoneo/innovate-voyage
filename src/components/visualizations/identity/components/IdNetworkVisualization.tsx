
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export interface IdNetworkVisualizationProps {
  networkData: {
    nodes: Array<{
      id: string;
      group: number;
      name?: string;
      avatar?: string;
      type?: string;
    }>;
    links: Array<{
      source: string;
      target: string;
      value: number;
    }>;
  };
  selectedNode?: string;
  setSelectedNode?: (id: string) => void;
  avatarUrl?: string;
  name?: string;
  ensName?: string;
  address?: string;
}

const IdNetworkVisualization: React.FC<IdNetworkVisualizationProps> = ({
  networkData,
  selectedNode,
  setSelectedNode,
  avatarUrl
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // D3 visualization code for identity network
  useEffect(() => {
    if (!svgRef.current || !networkData || networkData.nodes.length === 0) return;

    const width = 600;
    const height = 400;

    // Clear existing content
    d3.select(svgRef.current).selectAll("*").remove();

    // Create the SVG container
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("style", "max-width: 100%; height: auto;");

    // Create a simulation with forces
    const simulation = d3.forceSimulation(networkData.nodes as any)
      .force("link", d3.forceLink(networkData.links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(40));

    // Define arrow markers for the links
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 23)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#999")
      .attr("d", "M0,-5L10,0L0,5");

    // Create the links
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(networkData.links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => Math.sqrt(d.value))
      .attr("marker-end", "url(#arrowhead)");

    // Create node groups
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll(".node")
      .data(networkData.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .on("click", (event, d: any) => {
        if (setSelectedNode) {
          setSelectedNode(d.id);
        }
      })
      .call(d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any
      );

    // Add circle to each node
    node.append("circle")
      .attr("r", 20)
      .attr("fill", (d) => {
        return d.id === selectedNode
          ? "#3b82f6"  // blue-500
          : d.group === 1
          ? "#8b5cf6"  // violet-500
          : "#10b981"; // emerald-500
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

    // Add avatar images to main node (if available)
    node.filter(d => d.group === 1)
      .append("clipPath")
      .attr("id", d => `clip-${d.id}`)
      .append("circle")
      .attr("r", 18);

    node.filter(d => d.group === 1)
      .append("image")
      .attr("clip-path", d => `url(#clip-${d.id})`)
      .attr("xlink:href", d => avatarUrl || d.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y")
      .attr("x", -18)
      .attr("y", -18)
      .attr("width", 36)
      .attr("height", 36);

    // Add text labels
    node.append("text")
      .attr("dy", 30)
      .attr("text-anchor", "middle")
      .text((d) => d.name || d.id.substring(0, 6))
      .attr("font-size", "10px")
      .attr("fill", "#4b5563"); // gray-600

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [networkData, selectedNode, setSelectedNode, avatarUrl]);

  return (
    <div className="w-full h-[400px] flex justify-center items-center">
      <svg ref={svgRef} className="identity-network"></svg>
    </div>
  );
};

export default IdNetworkVisualization;
