
import * as d3 from 'd3';
import { NetworkNode, NetworkLink } from '../../hooks/useIdNetworkData';

interface SimulationProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
  width: number;
  height: number;
}

/**
 * Create and configure the D3 force simulation for the network
 */
export const createNetworkSimulation = ({
  nodes,
  links,
  width,
  height
}: SimulationProps) => {
  return d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(30));
};

/**
 * Apply the tick function to update node and link positions
 */
export const applyTickFunction = (
  link: d3.Selection<any, any, any, any>,
  node: d3.Selection<any, any, any, any>,
  margin: { top: number, right: number, bottom: number, left: number },
  width: number,
  height: number
) => {
  return () => {
    link
      .attr("x1", (d: any) => d.source.x)
      .attr("y1", (d: any) => d.source.y)
      .attr("x2", (d: any) => d.target.x)
      .attr("y2", (d: any) => d.target.y);

    node.attr("transform", (d: any) => {
      d.x = Math.max(margin.left + 30, Math.min(width - margin.right - 30, d.x));
      d.y = Math.max(margin.top + 30, Math.min(height - margin.bottom - 30, d.y));
      return `translate(${d.x},${d.y})`;
    });
  };
};
