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
      .distanceMax(200)  // Limit the maximum distance of effect
    )
    // Add centering force to keep nodes in the middle
    .force("center", d3.forceCenter(width / 2, height / 2))
    // Add collision force to prevent node overlap
    .force("collision", d3.forceCollide().radius((d: any) => {
      // Radius based on node type
      if (d.type === 'user') return 35;  // Central user node
      if (d.type === 'ens-domain') return 30; // ENS domains
      return 25; // Other nodes
    }))
    // Add x and y forces to keep nodes within bounds
    .force("x", d3.forceX(width / 2).strength(0.05))
    .force("y", d3.forceY(height / 2).strength(0.05));

  // Reduce simulation alpha for smoother transitions
  simulation.alpha(0.5);
  
  // Apply alpha decay
  if (!interactive) {
    // Faster decay for static visualization
    simulation.alphaDecay(0.08);
  } else {
    // Lower alpha decay for interactive mode for smoother transitions
    simulation.alphaDecay(0.01);
    
    // Set a minimum alpha target to keep some gentle motion
    simulation.alphaTarget(0.001);
    
    // Reduce velocity decay for smoother movement
    simulation.velocityDecay(0.4);
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

    // Keep nodes within visualization bounds with smoother constraints
    node.attr("transform", (d: any) => {
      // Apply padding to keep nodes fully visible
      const padding = 30;
      
      // Constrain nodes within visualization area - gradual constraint to reduce jittering
      d.x = Math.max(margin.left + padding, Math.min(width - margin.right - padding, d.x));
      d.y = Math.max(margin.top + padding, Math.min(height - margin.bottom - padding, d.y));
      
      // Apply transform
      return `translate(${d.x}, ${d.y})`;
    });
  };
}
