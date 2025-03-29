
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface SkillsNodeLeafD3Props {
  skills: Array<{ name: string; proof?: string; issued_by?: string }>;
  name: string;
}

const SkillsNodeLeafD3: React.FC<SkillsNodeLeafD3Props> = ({ skills, name }) => {
  const d3Container = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (d3Container.current && skills.length > 0) {
      const svg = d3.select(d3Container.current);
      svg.selectAll("*").remove(); // Clear previous visualization

      const width = 300;
      const height = 200;
      const radius = Math.min(width, height) / 2 - 20;

      // Create the root node data
      const root = {
        name: name,
        children: skills.map(skill => ({
          name: skill.name,
          value: skill.proof ? 100 : 50,
          verified: !!skill.proof,
          issuer: skill.issued_by
        }))
      };

      // Create the hierarchical data structure
      const hierarchy = d3.hierarchy(root)
        .sum(d => (d as any).value || 50);
      
      // Create the pack layout
      const pack = d3.pack()
        .size([width - 40, height - 40])
        .padding(3);
      
      const nodes = pack(hierarchy);

      // Create the container for the visualization
      const g = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      // Create the nodes
      const node = g.selectAll(".node")
        .data(nodes.descendants())
        .enter()
        .append("g")
        .attr("class", d => `node ${d.children ? "node--internal" : "node--leaf"}`)
        .attr("transform", d => `translate(${d.x - width / 2},${d.y - height / 2})`);

      // Add circles to nodes
      node.append("circle")
        .attr("r", d => d.r)
        .attr("fill", d => {
          if (d.depth === 0) return "#3b82f6"; // Root node (user)
          // Different colors for verified vs unverified skills
          return (d.data as any).verified ? "#10b981" : "#9ca3af";
        })
        .attr("stroke", d => d.depth === 0 ? "#1d4ed8" : (d.data as any).verified ? "#059669" : "#6b7280")
        .attr("stroke-width", 1.5)
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
          d3.select(this)
            .attr("stroke-width", 3);
          
          // Show tooltip for skill with issuer if available
          if (d.depth > 0 && (d.data as any).issuer) {
            const tooltip = svg.append("g")
              .attr("class", "tooltip")
              .attr("transform", `translate(${d.x + 10},${d.y - 10})`);
            
            tooltip.append("rect")
              .attr("width", 120)
              .attr("height", 30)
              .attr("rx", 5)
              .attr("ry", 5)
              .attr("fill", "rgba(0,0,0,0.7)");
            
            tooltip.append("text")
              .attr("x", 5)
              .attr("y", 15)
              .attr("fill", "white")
              .attr("font-size", "10px")
              .text(`Issued by: ${(d.data as any).issuer}`);
          }
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("stroke-width", 1.5);
          
          svg.selectAll(".tooltip").remove();
        });

      // Add text labels to nodes
      node.append("text")
        .attr("dy", d => d.depth === 0 ? 5 : 2)
        .attr("font-size", d => d.depth === 0 ? "12px" : "8px")
        .attr("text-anchor", "middle")
        .attr("fill", d => d.depth === 0 ? "white" : (d.data as any).verified ? "white" : "#374151")
        .text(d => {
          const name = d.data.name;
          if (d.depth === 0) {
            return name.length > 10 ? name.substring(0, 10) + "..." : name;
          } else {
            return name.length > 8 ? name.substring(0, 8) + "..." : name;
          }
        });

      // Add verification badge for verified skills
      node.filter(d => d.depth > 0 && (d.data as any).verified)
        .append("circle")
        .attr("r", 4)
        .attr("cx", d => d.r - 5)
        .attr("cy", d => -d.r + 5)
        .attr("fill", "#10b981")
        .attr("stroke", "white")
        .attr("stroke-width", 1);

      // Add the verification check mark
      node.filter(d => d.depth > 0 && (d.data as any).verified)
        .append("text")
        .attr("x", d => d.r - 5)
        .attr("y", d => -d.r + 8)
        .attr("font-size", "6px")
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text("✓");
    }
  }, [skills, name]);

  return (
    <div className="w-full h-full">
      <svg 
        className="w-full h-full" 
        ref={d3Container}
        width="100%"
        height="100%"
        viewBox="0 0 300 200"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
};

export default SkillsNodeLeafD3;
