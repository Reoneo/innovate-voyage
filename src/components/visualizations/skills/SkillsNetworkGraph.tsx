import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { PassportSkill } from '@/lib/utils';
import { createDragBehavior, createTooltip } from './utils/networkGraphUtils';
import NetworkNode from './components/NetworkNode';
import NetworkLink from './components/NetworkLink';
import NetworkTooltip from './components/NetworkTooltip';

interface SkillsNetworkGraphProps {
  skills: PassportSkill[];
  name: string;
  avatarUrl?: string;
  ensName?: string;
}

const SkillsNetworkGraph: React.FC<SkillsNetworkGraphProps> = ({ skills, name, avatarUrl, ensName }) => {
  const networkRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{ type: 'node' | 'link', data: any, position: { x: number, y: number } } | null>(null);

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

    // Add the ENS domain as a special node if available
    const ensNode = ensName ? {
      id: 'ens-node',
      name: ensName,
      type: 'ens',
      verified: true
    } : null;

    // Create nodes for graph
    const nodes = [
      { id: 0, name, type: 'user', avatarUrl },
      ...(ensNode ? [ensNode] : []),
      ...skills.slice(0, Math.min(7, skills.length)).map((skill, idx) => ({
        id: idx + 1 + (ensNode ? 1 : 0),
        name: skill.name,
        type: 'skill',
        verified: !!skill.proof
      }))
    ];

    // Create links between central node and skills
    const links = [
      ...(ensNode ? [{ source: 0, target: 'ens-node', value: 5, verified: true }] : []),
      ...skills.slice(0, Math.min(7, skills.length)).map((skill, idx) => ({
        source: 0,
        target: idx + 1 + (ensNode ? 1 : 0),
        value: skill.proof ? 3 : 1,
        verified: !!skill.proof
      }))
    ];

    // Create forceSimulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Create a group for links
    const linkGroup = svg.append("g").attr("class", "links");
    const link = linkGroup.selectAll("line")
      .data(links)
      .join("line")
        .attr("stroke", (d: any) => {
          if (d.source === 0 && d.target === 'ens-node') return "#3b82f6";
          return d.verified ? "#10b981" : "#9ca3af";
        })
        .attr("stroke-opacity", 0.7)
        .attr("stroke-width", (d: any) => Math.sqrt(d.value) * 1.5);

    // Create a group for nodes
    const nodeGroup = svg.append("g").attr("class", "nodes");
    const node = nodeGroup.selectAll(".node")
      .data(nodes)
      .join("g")
        .attr("class", "node")
        .attr("data-id", (d: any) => d.id)
        .attr("data-name", (d: any) => d.name)
        .call(createDragBehavior(simulation) as any)
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
              const source = l.source.id !== undefined ? l.source.id : l.source;
              const target = l.target.id !== undefined ? l.target.id : l.target;
              return source === d.id || target === d.id;
            })
            .attr("stroke-opacity", 1)
            .attr("stroke-width", (l: any) => Math.sqrt(l.value) * 2);
          }
        });

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

    // Add circles to nodes
    node.append("circle")
      .attr("r", (d: any) => {
        if (d.type === "user") return 30;
        if (d.type === "ens") return 25;
        return 20;
      })
      .attr("fill", (d: any) => {
        if (d.type === "user") {
          return avatarUrl ? `url(#user-avatar)` : "#3b82f6"; 
        }
        if (d.type === "ens") return "#6366f1";
        return (d as any).verified ? "#10b981" : "#9ca3af";
      })
      .attr("stroke", (d: any) => {
        if (d.type === "user") return "#1d4ed8";
        if (d.type === "ens") return "#4f46e5";
        return (d as any).verified ? "#059669" : "#6b7280";
      })
      .attr("stroke-width", 1.5);

    // Add text background for better readability
    node.insert("circle", "text")
      .attr("r", (d: any) => {
        if (d.type === "user") return 25;
        if (d.type === "ens") return 22;
        return 18;
      })
      .attr("fill", (d: any) => {
        if (d.type === "user") return avatarUrl ? "transparent" : "#3b82f6";
        if (d.type === "ens") return "#6366f1";
        return (d as any).verified ? "#10b981" : "#9ca3af";
      })
      .attr("opacity", (d: any) => d.type === "user" && avatarUrl ? 0 : 0.9);

    // Add labels
    node.append("text")
      .attr("dy", (d: any) => d.type === "user" ? 0 : 0)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", (d: any) => {
        if (d.type === "user") return avatarUrl ? "#ffffff" : "#ffffff";
        if (d.type === "ens") return "#ffffff";
        return (d as any).verified ? "white" : "#374151";
      })
      .attr("font-weight", (d: any) => {
        if (d.type === "user" || d.type === "ens") return "bold"; 
        return "normal";
      })
      .attr("font-size", (d: any) => {
        if (d.type === "user") return "12px";
        if (d.type === "ens") return "11px";
        return "11px";
      })
      .text((d: any) => {
        const displayName = d.name;
        if (d.type === "user") {
          return displayName.length > 12 ? displayName.substring(0, 12) + "..." : displayName;
        } else if (d.type === "ens") {
          return displayName.length > 12 ? displayName.substring(0, 12) + "..." : displayName;
        } else {
          return displayName.length > 10 ? displayName.substring(0, 10) + "..." : displayName;
        }
      });

    // Add verification badges
    node.filter((d: any) => (d.type !== "user" && (d as any).verified) || d.type === "ens")
      .append("circle")
      .attr("cx", 12)
      .attr("cy", -12)
      .attr("r", 8)
      .attr("fill", (d: any) => d.type === "ens" ? "#6366f1" : "#10b981")
      .attr("stroke", "white")
      .attr("stroke-width", 1.5);

    // Add checkmark to verification badges or ENS icon
    node.filter((d: any) => (d.type !== "user" && (d as any).verified) || d.type === "ens")
      .append("text")
      .attr("x", 12)
      .attr("y", -12)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-size", "10px")
      .text((d: any) => d.type === "ens" ? "E" : "✓");

    // Add tooltip for additional information
    const tooltip = createTooltip();

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

    // Add tooltip behavior for nodes
    node.on("mouseover", function(event, d: any) {
      tooltip.style("visibility", "visible")
        .html(() => {
          if (d.type === "user") {
            return `<strong>${d.name}</strong><br>Main profile`;
          } else if (d.type === "ens") {
            return `<strong>${d.name}</strong><br>ENS Domain`;
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

    // Add tooltip behavior for links
    link.on("mouseover", function(event, d: any) {
      tooltip.style("visibility", "visible")
        .html(() => {
          const source = nodes.find(n => n.id === (d.source.id !== undefined ? d.source.id : d.source));
          const target = nodes.find(n => n.id === (d.target.id !== undefined ? d.target.id : d.target));
          
          if (source && target) {
            if (target.type === "ens") {
              return `<strong>ENS Connection</strong><br>
                    ${source.name} → ${target.name}<br>
                    Domain ownership`;
            }
            
            return `<strong>Connection</strong><br>
                  ${source.name} → ${target.name}<br>
                  ${d.verified ? "Verified" : "Unverified"}`;
          }
          
          return "Connection";
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
  }, [skills, name, selectedNode, avatarUrl, ensName]);

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
