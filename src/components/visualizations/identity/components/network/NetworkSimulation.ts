import * as d3 from 'd3';
import { NetworkNode, NetworkLink } from '../../types/networkTypes';

interface SimulationProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
  width: number;
  height: number;
  forceStrength?: number;
  interactive?: boolean;
}

/**
 * Create and configure the force simulation for the network graph
 */
export function createNetworkSimulation({
  nodes,
  links,
  width,
  height,
  forceStrength = -30,
  interactive = true
}: SimulationProps): d3.Simulation<any, undefined> {
  
  // Create a new simulation with nodes
  const simulation = d3.forceSimulation(nodes)
    // Add link force to connect nodes
    .force("link", d3.forceLink(links)
      .id((d: any) => d.id)
      .distance(70) // Increase distance between connected nodes
    )
    // Add charge force to make nodes repel each other
    .force("charge", d3.forceManyBody()
      .strength(forceStrength)  // Negative is repulsion
    )
    // Add centering force to keep nodes in the middle
    .force("center", d3.forceCenter(width / 2, height / 2))
    // Add collision force to prevent node overlap
    .force("collision", d3.forceCollide().radius((d: any) => {
      // Radius based on node type
      if (d.type === 'user') return 35;  // Central user node
      if (d.type === 'ens-domain') return 30; // ENS domains
      return 25; // Other nodes
    }));

  // Reduce simulation alpha for smoother transitions
  simulation.alpha(0.8);
  
  // Apply alpha decay only if interactive is false (static visualization)
  if (!interactive) {
    simulation.alphaDecay(0.05);
  } else {
    // Use lower alpha decay for interactive mode for smoother transitions
    simulation.alphaDecay(0.02);
  }

  return simulation;
}

/**
 * Apply tick function to update positions of nodes and links during simulation
 */
export function applyTickFunction(
  link: d3.Selection<any, any, any, any>,
  node: d3.Selection<any, any, any, any>,
  margin: { top: number; right: number; bottom: number; left: number },
  width: number,
  height: number
) {
  return function() {
    // Update link positions
    link
      .attr("x1", (d: any) => d.source.x)
      .attr("y1", (d: any) => d.source.y)
      .attr("x2", (d: any) => d.target.x)
      .attr("y2", (d: any) => d.target.y);

    // Keep nodes within visualization bounds
    node.attr("transform", (d: any) => {
      // Constrain nodes within visualization area
      d.x = Math.max(margin.left, Math.min(width - margin.right, d.x));
      d.y = Math.max(margin.top, Math.min(height - margin.bottom, d.y));
      return `translate(${d.x}, ${d.y})`;
    });
  };
}
