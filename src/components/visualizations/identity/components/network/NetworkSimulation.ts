
import * as d3 from 'd3';
import { NetworkNode, NetworkLink } from '../../types/networkTypes';

interface SimulationProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
  width: number;
  height: number;
  forceStrength?: number;
}

/**
 * Create and configure the force simulation for the network graph
 */
export const createNetworkSimulation = ({
  nodes,
  links,
  width,
  height,
  forceStrength = -20
}: SimulationProps) => {
  // Create a force simulation with adjusted parameters
  return d3.forceSimulation(nodes as any)
    .force("link", d3.forceLink(links as any)
      .id((d: any) => d.id)
      .distance(60)  // Increased distance between connected nodes
    )
    .force("charge", d3.forceManyBody().strength(forceStrength))  // Use the configurable force strength
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(30));  // Prevent node overlap
};

/**
 * Create the tick function for updating positions during simulation
 */
export const applyTickFunction = (
  link: d3.Selection<SVGLineElement, any, SVGGElement, unknown>,
  node: d3.Selection<SVGGElement, any, SVGGElement, unknown>,
  margin: { top: number; right: number; bottom: number; left: number },
  width: number,
  height: number
) => {
  return () => {
    link
      .attr("x1", (d: any) => d.source.x)
      .attr("y1", (d: any) => d.source.y)
      .attr("x2", (d: any) => d.target.x)
      .attr("y2", (d: any) => d.target.y);

    node
      .attr("transform", (d: any) => {
        // Constrain nodes within the container bounds
        d.x = Math.max(margin.left, Math.min(width - margin.right, d.x));
        d.y = Math.max(margin.top, Math.min(height - margin.bottom, d.y));
        return `translate(${d.x},${d.y})`;
      });
  };
};
</lov-add-dependency>axios@latest</lov-add-dependency>
