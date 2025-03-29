
import { useEffect, RefObject } from 'react';
import * as d3 from 'd3';
import { generateProjectMetadata } from '../utils/skillsNodeUtils';

interface Skill {
  name: string;
  proof?: string;
  issued_by?: string;
}

interface SkillNode {
  id: number;
  name: string;
  value?: number;
  verified?: boolean;
  issuer?: string;
  proof?: string;
  projectMetadata?: any;
  x?: number;
  y?: number;
}

interface Link {
  source: { x: number; y: number } | number;
  target: { x: number; y: number } | number;
  value?: number;
}

/**
 * Hook for managing D3 rendering of skills visualization
 */
export const useSkillsD3 = (
  containerRef: RefObject<SVGSVGElement>,
  skills: Skill[],
  name: string
) => {
  useEffect(() => {
    if (!containerRef.current || skills.length === 0) return;

    const svg = d3.select(containerRef.current);
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
        projectMetadata: generateProjectMetadata(skill.name)
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
        
        // Dispatch custom event for tooltip
        const customEvent = new CustomEvent('skillnodemouseover', {
          detail: { 
            node: d, 
            event: event,
            x: d.x,
            y: d.y
          }
        });
        containerRef.current?.dispatchEvent(customEvent);
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("stroke-width", 1.5);
        
        // Dispatch custom event for tooltip removal
        const customEvent = new CustomEvent('skillnodemouseout');
        containerRef.current?.dispatchEvent(customEvent);
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
        
        // Dispatch custom event for connection tooltip
        const midX = (d.source.x + d.target.x) / 2;
        const midY = (d.source.y + d.target.y) / 2;
        
        const customEvent = new CustomEvent('connectionmouseover', {
          detail: { 
            event: event,
            x: midX + width/2,
            y: midY + height/2
          }
        });
        containerRef.current?.dispatchEvent(customEvent);
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("stroke-width", 1)
          .attr("stroke", "#9ca3af")
          .attr("stroke-opacity", 0.6);
        
        // Dispatch custom event for tooltip removal
        const customEvent = new CustomEvent('connectionmouseout');
        containerRef.current?.dispatchEvent(customEvent);
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

    return () => {
      // Cleanup
      svg.selectAll("*").remove();
    };
  }, [skills, name]);
};
