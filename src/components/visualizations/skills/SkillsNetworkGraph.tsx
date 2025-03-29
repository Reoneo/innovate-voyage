import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { PassportSkill } from '@/lib/utils';

interface SkillsNetworkGraphProps {
  skills: PassportSkill[];
  name: string;
}

const SkillsNetworkGraph: React.FC<SkillsNetworkGraphProps> = ({ skills, name }) => {
  const networkRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Generate network graph
  useEffect(() => {
    if (!networkRef.current || skills.length === 0) return;

    // Full container size with margins
    const width = 400;
    const height = 300;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    // Clear previous visualization
    d3.select(networkRef.current).selectAll("*").remove();

    const svg = d3.select(networkRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    // Create nodes for sankey
    const nodes = [
      { id: 0, name, type: 'user' },
      ...skills.slice(0, Math.min(8, skills.length)).map((skill, idx) => ({
        id: idx + 1,
        name: skill.name,
        type: 'skill',
        verified: !!skill.proof
      }))
    ];

    // Create links between central node and skills
    const links = skills.slice(0, Math.min(8, skills.length)).map((skill, idx) => ({
      source: 0,
      target: idx + 1,
      value: skill.proof ? 3 : 1,
      verified: !!skill.proof
    }));

    // Create forceSimulation with more space between nodes
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Add links with gradient colors
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .join("line")
        .attr("stroke", (d: any) => d.verified ? "#10b981" : "#9ca3af")
        .attr("stroke-opacity", 0.7)
        .attr("stroke-width", (d: any) => Math.sqrt(d.value) * 1.5);

    // Create a group for nodes
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll(".node")
      .data(nodes)
      .join("g")
        .attr("class", "node")
        .attr("data-id", (d: any) => d.id)
        .attr("data-name", (d: any) => d.name)
        .call(drag(simulation) as any)
        .on("click", (event, d: any) => {
          // Toggle node selection
          setSelectedNode(prev => prev === d.name ? null : d.name);
          
          // Reset all nodes and links
          node.selectAll("circle").attr("stroke-width", 1.5);
          link.attr("stroke-opacity", 0.7).attr("stroke-width", (d: any) => Math.sqrt(d.value) * 1.5);
          
          // Highlight selected node and its connections
          if (selectedNode !== d.name) {
            // Highlight this node
            d3.select(event.currentTarget).select("circle").attr("stroke-width", 3);
            
            // Highlight connected links
            link.filter((l: any) => {
              const source = l.source.id || l.source;
              const target = l.target.id || l.target;
              return source === d.id || target === d.id;
            })
            .attr("stroke-opacity", 1)
            .attr("stroke-width", (l: any) => Math.sqrt(l.value) * 2);
          }
        });

    // Add circles to nodes with clearer visuals
    node.append("circle")
      .attr("r", (d: any) => d.type === "user" ? 30 : 20)
      .attr("fill", (d: any) => {
        if (d.type === "user") return "#3b82f6"; 
        return (d as any).verified ? "#10b981" : "#9ca3af";
      })
      .attr("stroke", (d: any) => d.type === "user" ? "#1d4ed8" : (d as any).verified ? "#059669" : "#6b7280")
      .attr("stroke-width", 1.5);

    // Add labels with better positioning and visibility
    node.append("text")
      .attr("dy", (d: any) => d.type === "user" ? 0 : 0)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", (d: any) => d.type === "user" ? "white" : (d as any).verified ? "white" : "#374151")
      .attr("font-weight", (d: any) => d.type === "user" ? "bold" : "normal")
      .attr("font-size", (d: any) => d.type === "user" ? "12px" : "11px")
      .text((d: any) => {
        const name = d.name;
        if (d.type === "user") {
          return name.length > 12 ? name.substring(0, 12) + "..." : name;
        } else {
          return name.length > 10 ? name.substring(0, 10) + "..." : name;
        }
      });

    // Add background to text for better readability
    node.insert("circle", "text")
      .attr("r", (d: any) => d.type === "user" ? 25 : 18)
      .attr("fill", (d: any) => {
        if (d.type === "user") return "#3b82f6";
        return (d as any).verified ? "#10b981" : "#9ca3af";
      })
      .attr("opacity", 0.9);

    // Add verification badges for verified skills
    node.filter((d: any) => d.type !== "user" && (d as any).verified)
      .append("circle")
      .attr("cx", 12)
      .attr("cy", -12)
      .attr("r", 8)
      .attr("fill", "#10b981")
      .attr("stroke", "white")
      .attr("stroke-width", 1.5);

    // Add checkmark to verification badges
    node.filter((d: any) => d.type !== "user" && (d as any).verified)
      .append("text")
      .attr("x", 12)
      .attr("y", -12)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-size", "10px")
      .text("✓");

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

    // Function to handle drag
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

    // Add tooltip for additional information
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "network-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(0,0,0,0.8)")
      .style("color", "white")
      .style("padding", "5px 10px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none");

    // Add tooltip behavior
    node.on("mouseover", function(event, d: any) {
      tooltip.style("visibility", "visible")
        .html(() => {
          if (d.type === "user") {
            return `<strong>${d.name}</strong><br>Main profile`;
          } else {
            const skill = skills.find(s => s.name === d.name);
            return `<strong>${d.name}</strong><br>
                   ${d.verified ? "Verified skill" : "Unverified skill"}
                   ${skill?.issued_by ? `<br>Issued by: ${skill.issued_by}` : ""}`;
          }
        })
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

    link.on("mouseover", function(event, d: any) {
      tooltip.style("visibility", "visible")
        .html(() => {
          const source = nodes.find(n => n.id === (d.source.id !== undefined ? d.source.id : d.source));
          const target = nodes.find(n => n.id === (d.target.id !== undefined ? d.target.id : d.target));
          return `<strong>Connection</strong><br>
                 ${source?.name} → ${target?.name}<br>
                 ${d.verified ? "Verified" : "Unverified"}`;
        })
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
  }, [skills, name, selectedNode]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <svg 
        ref={networkRef}
        className="w-full h-full"
        style={{ maxHeight: "100%", maxWidth: "100%", overflow: "visible" }}
      ></svg>
    </div>
  );
};

export default SkillsNetworkGraph;
