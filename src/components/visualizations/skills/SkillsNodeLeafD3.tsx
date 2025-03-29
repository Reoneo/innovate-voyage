
import React, { useEffect, useRef } from 'react';
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
          issuer: skill.issued_by,
          proof: skill.proof,
          // Generate some additional project metadata for tooltips
          projectMetadata: {
            project: `${skill.name} Project`,
            description: `A project related to ${skill.name}`,
            role: getRandomRole(),
            timeframe: `${getRandomDate()} - ${getRandomDate()}`,
            status: getRandomStatus(),
            connections: Math.floor(Math.random() * 20) + 1
          }
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

      // Add invisible larger circle to enhance hover area
      node.filter(d => d.depth > 0)
        .append("circle")
        .attr("r", d => d.r + 5)
        .attr("fill", "transparent")
        .style("cursor", "pointer");

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
          
          // Show enhanced tooltip for skills with more details
          if (d.depth > 0) {
            const data = d.data as any;
            
            // Create tooltip group
            const tooltip = svg.append("g")
              .attr("class", "tooltip")
              .attr("transform", `translate(${d.x + 10},${d.y - 10})`);
            
            // Add tooltip background
            tooltip.append("rect")
              .attr("width", 200)
              .attr("height", data.issuer ? 150 : 130)
              .attr("rx", 5)
              .attr("ry", 5)
              .attr("fill", "rgba(0,0,0,0.8)");
            
            // Add skill name with appropriate styling
            tooltip.append("text")
              .attr("x", 10)
              .attr("y", 20)
              .attr("fill", "white")
              .attr("font-weight", "bold")
              .attr("font-size", "12px")
              .text(data.name);
            
            // Add project details
            tooltip.append("text")
              .attr("x", 10)
              .attr("y", 40)
              .attr("fill", "#10b981")
              .attr("font-size", "10px")
              .text(`Project: ${data.projectMetadata.project}`);
            
            tooltip.append("text")
              .attr("x", 10)
              .attr("y", 60)
              .attr("fill", "white")
              .attr("font-size", "10px")
              .text(`Role: ${data.projectMetadata.role}`);
            
            tooltip.append("text")
              .attr("x", 10)
              .attr("y", 80)
              .attr("fill", "white")
              .attr("font-size", "10px")
              .text(`Period: ${data.projectMetadata.timeframe}`);
            
            tooltip.append("text")
              .attr("x", 10)
              .attr("y", 100)
              .attr("fill", "white")
              .attr("font-size", "10px")
              .text(`Status: ${data.projectMetadata.status}`);
            
            tooltip.append("text")
              .attr("x", 10)
              .attr("y", 120)
              .attr("fill", "white")
              .attr("font-size", "10px")
              .text(`Connections: ${data.projectMetadata.connections}`);
            
            // Add issuer information if available
            if (data.issuer) {
              tooltip.append("text")
                .attr("x", 10)
                .attr("y", 140)
                .attr("fill", "#3b82f6")
                .attr("font-size", "10px")
                .text(`Verified by: ${data.issuer}`);
            }
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

      // Add connections between nodes (lines between root and skills)
      const links = nodes.descendants().slice(1).map(d => ({
        source: { x: 0, y: 0 }, // Root node position (centered)
        target: { x: d.x - width / 2, y: d.y - height / 2 } // Skill node position
      }));

      // Add connection lines
      g.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
        .attr("stroke", "#9ca3af")
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.6)
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
          d3.select(this)
            .attr("stroke-width", 2)
            .attr("stroke", "#3b82f6")
            .attr("stroke-opacity", 1);
          
          // Create connection tooltip
          const midX = (d.source.x + d.target.x) / 2;
          const midY = (d.source.y + d.target.y) / 2;
          
          const tooltip = svg.append("g")
            .attr("class", "connection-tooltip")
            .attr("transform", `translate(${midX + width/2 + 10},${midY + height/2})`);
          
          tooltip.append("rect")
            .attr("width", 160)
            .attr("height", 70)
            .attr("rx", 5)
            .attr("fill", "rgba(0,0,0,0.8)");
          
          tooltip.append("text")
            .attr("x", 10)
            .attr("y", 20)
            .attr("fill", "#3b82f6")
            .attr("font-weight", "bold")
            .attr("font-size", "10px")
            .text("Connection Details");
          
          tooltip.append("text")
            .attr("x", 10)
            .attr("y", 40)
            .attr("fill", "white")
            .attr("font-size", "10px")
            .text(`Strength: ${Math.floor(Math.random() * 100)}%`);
          
          tooltip.append("text")
            .attr("x", 10)
            .attr("y", 60)
            .attr("fill", "white")
            .attr("font-size", "10px")
            .text(`Duration: ${Math.floor(Math.random() * 24) + 1} months`);
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("stroke-width", 1)
            .attr("stroke", "#9ca3af")
            .attr("stroke-opacity", 0.6);
          
          svg.selectAll(".connection-tooltip").remove();
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

  // Helper functions to generate random data for visualizations
  function getRandomRole() {
    const roles = ["Developer", "Designer", "Project Manager", "Contributor", "Owner", "Creator", "Reviewer"];
    return roles[Math.floor(Math.random() * roles.length)];
  }

  function getRandomDate() {
    const year = 2020 + Math.floor(Math.random() * 4);
    const month = Math.floor(Math.random() * 12) + 1;
    return `${month}/${year}`;
  }

  function getRandomStatus() {
    const statuses = ["Active", "Completed", "Ongoing", "Planning", "On Hold"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

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
