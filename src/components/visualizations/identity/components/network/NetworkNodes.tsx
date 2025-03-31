
import * as d3 from 'd3';
import { NetworkNode } from '../../types/networkTypes';
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
  // Create a group for all nodes
  const nodeGroup = svg.append("g")
    .attr("class", "nodes");
    
  // Create individual node groups
  const node = nodeGroup
    .selectAll(".node")
    .data(nodes)
    .join("g")
      .attr("class", d => `network-node ${d.id === 'central' ? 'central-node' : ''}`)
      .attr("data-id", (d: any) => d.id)
      .attr("data-name", (d: any) => d.name)
      .attr("data-type", (d: any) => d.type)
      .style("cursor", interactive ? "pointer" : "default");
      
  // Only apply drag behavior and click handlers if interactive mode is enabled
  if (interactive) {
    // Apply drag behavior
    node.call(createDragBehavior(simulation) as any)
      // Handle click events for node selection
      .on("click", function(event, d: any) {
        event.stopPropagation(); // Prevent event bubbling
        
        const nodeName = d.name;
        setSelectedNode(selectedNode === nodeName ? null : nodeName);
        
        // Reset all nodes and links styling
        svg.selectAll(".network-node circle")
          .attr("stroke-width", 1.5)
          .attr("r", (d: any) => getNodeRadius(d));
          
        svg.selectAll(".links line")
          .attr("stroke-opacity", 0.6)
          .attr("stroke-width", (link: any) => Math.sqrt(link.value) * 1.5);
        
        // Highlight the selected node and its connections
        if (selectedNode !== nodeName) {
          d3.select(this).select("circle")
            .attr("stroke-width", 3)
            .attr("r", (d: any) => getNodeRadius(d) * 1.2);
            
          svg.selectAll(".links line").filter((l: any) => {
            const source = typeof l.source === 'object' ? l.source.id : l.source;
            const target = typeof l.target === 'object' ? l.target.id : l.target;
            return source === d.id || target === d.id;
          })
          .attr("stroke-opacity", 1)
          .attr("stroke-width", (l: any) => Math.sqrt(l.value) * 2);
        }
      });
      
    // Handle hover effects
    node.on("mouseenter", function() {
        d3.select(this).select("circle")
          .transition()
          .duration(300)
          .attr("r", (d: any) => getNodeRadius(d) * 1.2)
          .attr("stroke-width", 2.5);
      })
      .on("mouseleave", function() {
        const nodeId = d3.select(this).attr("data-id");
        const isSelected = selectedNode === d3.select(this).attr("data-name");
        
        d3.select(this).select("circle")
          .transition()
          .duration(300)
          .attr("r", (d: any) => getNodeRadius(d) * (isSelected ? 1.2 : 1))
          .attr("stroke-width", isSelected ? 3 : 1.5);
      });
  } else {
    // For non-interactive mode, still allow hover effects for better UX
    node.on("mouseenter", function() {
      d3.select(this).select("circle")
        .transition()
        .duration(300)
        .attr("r", (d: any) => getNodeRadius(d) * 1.1)
        .attr("stroke-width", 2);
    })
    .on("mouseleave", function() {
      d3.select(this).select("circle")
        .transition()
        .duration(300)
        .attr("r", (d: any) => getNodeRadius(d))
        .attr("stroke-width", 1.5);
    });
  }
      
  return node;
};

/**
 * Get appropriate radius for each node based on type
 */
function getNodeRadius(node: any): number {
  if (node.type === 'user') return 30;
  if (node.type === 'ens-domain') return 25;
  if (node.type === 'identity-nft') return 20;
  if (node.type === 'platform') return 18;
  return 15;
}
