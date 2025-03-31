
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { NetworkData } from '../types/networkTypes';
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
  interactive?: boolean;
}

const IdNetworkVisualization: React.FC<IdNetworkVisualizationProps> = ({
  networkData,
  selectedNode,
  setSelectedNode,
  avatarUrl,
  interactive = true
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<any>(null);
  const { nodes, links } = networkData;
  const [dimensions, setDimensions] = useState({ width: 400, height: 350 });

  // Effect to handle resize
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const containerRect = svgRef.current.parentElement?.getBoundingClientRect();
        if (containerRect) {
          setDimensions({
            width: containerRect.width || 400,
            height: containerRect.height || 350
          });
        }
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      // Clean up simulation when component unmounts
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, []);

  // Effect to create or update the visualization
  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Stop previous simulation if it exists
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    const { width, height } = dimensions;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    // Create force simulation with more space between nodes
    const simulation = createNetworkSimulation({
      nodes,
      links,
      width,
      height,
      forceStrength: nodes.length > 5 ? -35 : -25,
      interactive
    });
    
    // Store simulation in ref for cleanup
    simulationRef.current = simulation;

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
      selectedNode,
      interactive
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
      // Clean up
      tooltip.remove();
      simulation.stop();
    };
  }, [nodes, links, selectedNode, avatarUrl, setSelectedNode, interactive, dimensions]);

  return (
    <svg 
      ref={svgRef}
      className="w-full h-full"
      style={{ maxHeight: "100%", maxWidth: "100%", overflow: "visible" }}
    ></svg>
  );
};

export default IdNetworkVisualization;
