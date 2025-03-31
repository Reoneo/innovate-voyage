
import * as d3 from 'd3';
import { NetworkNode } from '../../hooks/useIdNetworkData';
import { createDragBehavior } from '../../utils/idNetworkUtils';

interface NetworkNodesProps {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  nodes: NetworkNode[];
  simulation: d3.Simulation<any, undefined>;
  setSelectedNode: (node: string | null) => void;
  selectedNode: string | null;
  interactive?: boolean;
}

/**
 * Create and configure network nodes
 */
export const createNetworkNodes = ({ 
  svg, 
  nodes, 
  simulation, 
  setSelectedNode,
  selectedNode,
  interactive = true
}: NetworkNodesProps) => {
  const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll(".node")
    .data(nodes)
    .join("g")
      .attr("class", "node")
      .attr("data-id", (d: any) => d.id)
      .attr("data-name", (d: any) => d.name)
      .attr("data-type", (d: any) => d.type);
      
  // Only apply drag behavior and click handlers if interactive mode is enabled
  if (interactive) {
    node.call(createDragBehavior(simulation) as any)
      .on("click", (event, d: any) => {
        const nodeName = d.name;
        setSelectedNode(selectedNode === nodeName ? null : nodeName);
        
        // Reset all nodes and links to default styling
        node.selectAll("circle").attr("stroke-width", 1.5);
        svg.selectAll(".links line")
          .attr("stroke-opacity", 0.7)
          .attr("stroke-width", (link: any) => Math.sqrt(link.value) * 1.5);
        
        // Highlight the selected node and its connections
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
  } else {
    // For non-interactive mode, still allow hover effects for better UX
    node.on("mouseenter", function(event, d: any) {
      d3.select(this).select("circle").attr("stroke-width", 2);
    })
    .on("mouseleave", function() {
      d3.select(this).select("circle").attr("stroke-width", 1.5);
    });
  }
      
  return node;
};
