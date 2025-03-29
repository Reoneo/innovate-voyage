
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { PassportSkill } from '@/lib/utils';

interface SkillsNetworkGraphProps {
  skills: PassportSkill[];
  name: string;
}

const SkillsNetworkGraph: React.FC<SkillsNetworkGraphProps> = ({ skills, name }) => {
  const networkRef = useRef<SVGSVGElement>(null);

  // Generate Sankey diagram
  useEffect(() => {
    if (!networkRef.current || skills.length === 0) return;

    const width = 220;
    const height = 150;
    const margin = { top: 10, right: 5, bottom: 5, left: 5 };

    // Clear previous visualization
    d3.select(networkRef.current).selectAll("*").remove();

    const svg = d3.select(networkRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create nodes for sankey
    const nodes = [
      { id: 0, name: name },
      ...skills.slice(0, 5).map((skill, idx) => ({ id: idx + 1, name: skill.name }))
    ];

    // Create links between central node and skills
    const links = skills.slice(0, 5).map((skill, idx) => ({
      source: 0,
      target: idx + 1,
      value: skill.proof ? 2 : 1
    }));

    // Create forceSimulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(50))
      .force("charge", d3.forceManyBody().strength(-50))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(20));

    // Add links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
        .attr("stroke", "#9ca3af")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", (d: any) => Math.sqrt(d.value) * 1.5);

    // Add nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
        .call(drag(simulation) as any);

    // Add circles to nodes
    node.append("circle")
      .attr("r", (d: any) => d.id === 0 ? 20 : 10)
      .attr("fill", (d: any) => d.id === 0 ? "#3b82f6" : "#9ca3af");

    // Add text labels to nodes
    node.append("text")
      .attr("x", 0)
      .attr("y", (d: any) => d.id === 0 ? 0 : 15)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", (d: any) => d.id === 0 ? "middle" : "hanging")
      .text((d: any) => d.id === 0 ? name.substring(0, 3) : d.name.substring(0, 5))
      .attr("font-size", (d: any) => d.id === 0 ? "8px" : "6px")
      .attr("fill", (d: any) => d.id === 0 ? "white" : "#374151");

    // Update simulation
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Define drag functions
    function drag(simulation: any) {
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
  }, [skills, name]);

  return <svg ref={networkRef} className="mx-auto"></svg>;
};

export default SkillsNetworkGraph;
