
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface NetworkNode {
  id: string;
  name: string;
  type: string;
  avatar?: string;
  isDotBox?: boolean;
  image?: string;
}

export interface NetworkLink {
  source: string;
  target: string;
  value: number;
}

export interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

/**
 * Hook to process and prepare data for the ID Network graph
 */
export function useIdNetworkData(name: string, avatarUrl?: string, ensName?: string, address?: string) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  // Process the data to create nodes and links for ENS domains only
  const networkData = useNetworkGraphData(
    name,
    avatarUrl,
    ensName
  );

  return {
    networkData,
    selectedNode,
    setSelectedNode,
    loading: false,
    hasData: ensName !== undefined
  };
}

/**
 * Hook to process the data into nodes and links for the D3 graph
 * Focusing ONLY on ENS domains
 */
function useNetworkGraphData(
  name: string,
  avatarUrl?: string,
  ensName?: string,
): NetworkData {
  const [data, setData] = useState<NetworkData>({ nodes: [], links: [] });

  useEffect(() => {
    // Create nodes for the identity network
    const centralNode: NetworkNode = { id: 'central', name, type: 'user', avatar: avatarUrl };
    
    // Main ENS domain node - could be .eth or .box
    const mainEnsNode = ensName ? { 
      id: 'main-ens', 
      name: ensName, 
      type: 'ens-domain',
      isDotBox: ensName.includes('.box') 
    } : null;
    
    // Combine all nodes - ONLY central node and main ENS domain
    const nodes = [
      centralNode,
      ...(mainEnsNode ? [mainEnsNode] : [])
    ];

    // Create links between central node and main ENS domain
    const links = [
      // Link to main ENS if exists
      ...(mainEnsNode ? [{ source: 'central', target: 'main-ens', value: 5 }] : [])
    ];

    setData({ nodes, links });
  }, [name, avatarUrl, ensName]);

  return data;
}
