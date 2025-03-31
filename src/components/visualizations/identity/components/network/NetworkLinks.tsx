
import * as d3 from 'd3';
import { NetworkLink, NetworkNode } from '../../hooks/useIdNetworkData';

interface NetworkLinksProps {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  links: NetworkLink[];
  nodes: NetworkNode[];
}

/**
 * Create and style network links between nodes
 */
export const createNetworkLinks = ({ svg, links, nodes }: NetworkLinksProps) => {
  return svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke", (d: any) => {
        const target = nodes.find(n => n.id === d.target);
        if (target?.type === 'ens-domain') return target.isDotBox ? "#8b5cf6" : "#6366f1";
        if (target?.type === 'identity-nft') return "#10b981";
        if (target?.type === 'platform') return "#f59e0b";
        return "#9ca3af";
      })
      .attr("stroke-opacity", 0.7)
      .attr("stroke-width", (d: any) => Math.sqrt(d.value) * 1.5);
};
