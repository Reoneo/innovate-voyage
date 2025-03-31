
import React from 'react';
import { useIdNetworkData } from './hooks/useIdNetworkData';
import IdNetworkVisualization from './components/IdNetworkVisualization';

interface IdNetworkGraphProps {
  name: string;
  avatarUrl?: string;
  ensName?: string;
  address?: string;
  additionalEnsDomains?: string[];
}

const IdNetworkGraph: React.FC<IdNetworkGraphProps> = ({ 
  name, 
  avatarUrl, 
  ensName, 
  address,
  additionalEnsDomains = []
}) => {
  const { 
    networkData,
    selectedNode,
    setSelectedNode,
    loading,
    hasData
  } = useIdNetworkData(name, avatarUrl, ensName, address, additionalEnsDomains);

  return (
    <div className="w-full h-full flex justify-center items-center">
      {networkData.nodes.length > 0 && (
        <IdNetworkVisualization
          networkData={networkData}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          avatarUrl={avatarUrl}
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
