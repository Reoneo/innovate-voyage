
import { useEffect, RefObject, useCallback } from 'react';
import * as d3 from 'd3';
import { PassportSkill } from '@/lib/utils';

export const useSkillsD3 = (
  containerRef: RefObject<SVGSVGElement>,
  skills: Array<{ name: string; proof?: string; issued_by?: string }>,
  name: string
): (() => void) => {
  // Memoize cleanup function to avoid unnecessary re-renders
  const cleanup = useCallback(() => {
    if (!containerRef.current) return;
    
    // Properly clean up all D3 elements and listeners
    const svg = d3.select(containerRef.current);
    
    // Remove all elements within the SVG
    svg.selectAll('*').remove();
    
    // Remove any tooltips that might have been created outside the SVG
    d3.selectAll('.d3-tooltip').remove();
  }, [containerRef]);

  useEffect(() => {
    if (!containerRef.current || skills.length === 0) return cleanup;

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Clear previous visualization
    cleanup();

    const svg = d3.select(containerRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create hierarchical data structure
    const root = {
      name: name,
      children: skills.map(skill => ({
        name: skill.name,
        value: skill.proof ? 2 : 1,
        verified: !!skill.proof,
        issued_by: skill.issued_by
      }))
    };

    const hierarchyData = d3.hierarchy(root)
      .sum(d => (d as any).value || 1);

    // Create pack layout
    const pack = d3.pack()
      .size([width, height])
      .padding(3);

    const packedData = pack(hierarchyData);

    // Create nodes
    const node = g.selectAll(".node")
      .data(packedData.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    // Add circles for nodes
    node.append("circle")
      .attr("r", d => d.r)
      .attr("fill", (d: any) => {
        if (d.depth === 0) return "#3b82f6";
        return d.data.verified ? "#10b981" : "#9ca3af";
      })
      .attr("opacity", d => d.depth === 0 ? 1 : 0.8)
      .attr("stroke", (d: any) => {
        if (d.depth === 0) return "#1d4ed8";
        return d.data.verified ? "#059669" : "#6b7280";
      })
      .attr("stroke-width", 1.5)
      .on("mouseover", function(event: MouseEvent, d: any) {
        d3.select(this)
          .attr("stroke-width", 2)
          .attr("opacity", 1);

        // Dispatch custom event for React component to handle
        const customEvent = new CustomEvent("skillnodemouseover", {
          detail: { node: d, x: event.offsetX, y: event.offsetY }
        });
        containerRef.current?.dispatchEvent(customEvent);
      })
      .on("mouseout", function(event: MouseEvent, d: any) {
        d3.select(this)
          .attr("stroke-width", 1.5)
          .attr("opacity", d.depth === 0 ? 1 : 0.8);

        // Dispatch custom event
        const customEvent = new CustomEvent("skillnodemouseout", {
          detail: { node: d }
        });
        containerRef.current?.dispatchEvent(customEvent);
      });

    // Add text labels
    node.append("text")
      .attr("dy", d => d.depth === 0 ? "0.35em" : "0.3em")
      .attr("text-anchor", "middle")
      .attr("font-size", d => d.depth === 0 ? "12px" : "10px")
      .attr("fill", d => d.depth === 0 ? "white" : "#374151")
      .attr("pointer-events", "none")
      .text(d => {
        if (d.depth === 0) {
          return d.data.name.length > 10 ? d.data.name.substring(0, 10) + "..." : d.data.name;
        }
        
        const skillName = d.data.name;
        if (skillName.length > 8) {
          return skillName.substring(0, 8) + "...";
        }
        return skillName;
      });

    // Draw connections between the main node and skill nodes
    const connections = g.selectAll(".connection")
      .data(packedData.descendants().filter(d => d.depth === 1))
      .enter()
      .append("line")
      .attr("class", "connection")
      .attr("x1", packedData.x)
      .attr("y1", packedData.y)
      .attr("x2", d => d.x)
      .attr("y2", d => d.y)
      .attr("stroke", d => (d.data as any).verified ? "#10b981" : "#9ca3af")
      .attr("stroke-width", d => (d.data as any).verified ? 1.5 : 1)
      .attr("stroke-opacity", 0.6)
      .attr("stroke-dasharray", d => (d.data as any).verified ? "none" : "4,2")
      .on("mouseover", function(event: MouseEvent) {
        d3.select(this)
          .attr("stroke-width", d => (d.data as any).verified ? 2.5 : 2)
          .attr("stroke-opacity", 1);

        // Dispatch custom event
        const customEvent = new CustomEvent("connectionmouseover", {
          detail: { x: event.offsetX, y: event.offsetY }
        });
        containerRef.current?.dispatchEvent(customEvent);
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("stroke-width", d => (d.data as any).verified ? 1.5 : 1)
          .attr("stroke-opacity", 0.6);

        // Dispatch custom event
        const customEvent = new CustomEvent("connectionmouseout", {});
        containerRef.current?.dispatchEvent(customEvent);
      });
    
    // Add verification badges for verified skills
    node.filter((d: any) => d.depth === 1 && d.data.verified)
      .append("circle")
      .attr("cx", d => d.r * 0.6)
      .attr("cy", -d.r * 0.6)
      .attr("r", d => d.r * 0.3)
      .attr("fill", "#10b981")
      .attr("stroke", "white")
      .attr("stroke-width", 1.5);

    // Add checkmark to verification badges
    node.filter((d: any) => d.depth === 1 && d.data.verified)
      .append("text")
      .attr("x", d => d.r * 0.6)
      .attr("y", -d.r * 0.6)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-size", d => Math.max(8, d.r * 0.3) + "px")
      .attr("pointer-events", "none")
      .text("✓");

    return cleanup;
  }, [skills, name, cleanup]);

  return cleanup;
};
