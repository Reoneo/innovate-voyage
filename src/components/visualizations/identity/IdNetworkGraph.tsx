
import React from 'react';
import { useIdNetworkData } from './hooks/useIdNetworkData';
import IdNetworkVisualization from './components/IdNetworkVisualization';

export interface IdNetworkGraphProps {
  name: string;
  avatarUrl?: string;
  ensName?: string;
  address: string;
}

const IdNetworkGraph: React.FC<IdNetworkGraphProps> = ({ 
  name, 
  avatarUrl, 
  ensName, 
  address 
}) => {
  const { 
    networkData,
    selectedNode,
    setSelectedNode,
    loading,
    hasData
  } = useIdNetworkData(name, avatarUrl, ensName, address);

  // Transform the network data to match expected format for IdNetworkVisualization
  const formattedNetworkData = {
    nodes: networkData.nodes.map(node => ({
      id: node.id,
      group: node.type === 'user' ? 1 : node.isDotBox ? 3 : 2, // Assign group based on node type
      name: node.name,
      avatar: node.avatar,
      type: node.type
    })),
    links: networkData.links
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      {networkData.nodes.length > 0 && (
        <IdNetworkVisualization
          networkData={formattedNetworkData}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          avatarUrl={avatarUrl}
          name={name}
          ensName={ensName}
          address={address}
        />
      )}
      
      {!loading && !hasData && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
          No identity data available for this address
        </div>
      )}
    </div>
  );
};

export default IdNetworkGraph;
