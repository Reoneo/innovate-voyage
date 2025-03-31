
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { NetworkData } from '../hooks/useIdNetworkData';
import { createNetworkLinks } from './network/NetworkLinks';
import { createNetworkNodes } from './network/NetworkNodes';
import { renderNodeElements } from './network/NodeElements';
import { applyNodeTooltips } from './network/NetworkTooltip';
import { createNetworkSimulation, applyTickFunction } from './network/NetworkSimulation';
import { setupUserAvatar } from './network/UserAvatar';

interface IdNetworkVisualizationProps {
  networkData: NetworkData;
  selectedNode: string | null;
  setSelectedNode: (node: string | null) => void;
  avatarUrl?: string;
}

const IdNetworkVisualization: React.FC<IdNetworkVisualizationProps> = ({
  networkData,
  selectedNode,
  setSelectedNode,
  avatarUrl
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { nodes, links } = networkData;

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    // Full container size with margins
    const width = 400;
    const height = 300;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    // Create force simulation
    const simulation = createNetworkSimulation({
      nodes,
      links,
      width,
      height
    });

    // Add links with appropriate styling
    const link = createNetworkLinks({
      svg,
      links,
      nodes
    });

    // Create node groups
    const node = createNetworkNodes({
      svg,
      nodes,
      simulation,
      setSelectedNode,
      selectedNode
    });

    // Setup user avatar pattern if available
    setupUserAvatar(svg, avatarUrl);

    // Render node elements (circles, text, etc)
    renderNodeElements({
      node,
      avatarUrl,
      setSelectedNode,
      selectedNode
    });

    // Setup simulation tick function
    simulation.on("tick", applyTickFunction(
      link,
      node,
      margin,
      width,
      height
    ));

    // Add tooltips to nodes
    const tooltip = applyNodeTooltips(node);

    return () => {
      tooltip.remove();
    };
  }, [nodes, links, selectedNode, avatarUrl, setSelectedNode]);

  return (
    <svg 
      ref={svgRef}
      className="w-full h-full"
      style={{ maxHeight: "100%", maxWidth: "100%", overflow: "visible" }}
    ></svg>
  );
};

export default IdNetworkVisualization;
