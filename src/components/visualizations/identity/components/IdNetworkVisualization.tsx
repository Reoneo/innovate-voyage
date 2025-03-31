
import React from 'react';
import { NetworkData } from '../hooks/useIdNetworkData';
import { useNetworkVisualization } from '../hooks/useNetworkVisualization';

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
  // Pass the props as a single object to match the hook's parameter structure
  const svgRef = useNetworkVisualization({
    networkData,
    selectedNode,
    setSelectedNode,
    avatarUrl
  });

  return (
    <svg 
      ref={svgRef}
      className="w-full h-full"
      style={{ maxHeight: "100%", maxWidth: "100%", overflow: "visible" }}
    ></svg>
  );
};

export default IdNetworkVisualization;
