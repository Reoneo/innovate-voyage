
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllEnsDomains } from '@/api/services/domainsService';
import { useSkillNfts } from '@/hooks/useWeb3';

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
  
  // Get resolved address - consider both .eth and .box domains
  const resolvedAddress = address || (ensName && !ensName.includes('.eth') && !ensName.includes('.box')) ? ensName : undefined;
  
  // Fetch all ENS domains for this address using Etherscan API
  const { data: ensDomains, isLoading: loadingEnsDomains } = useQuery({
    queryKey: ['ensDomains', resolvedAddress],
    queryFn: async () => {
      if (!resolvedAddress) return [];
      try {
        return await fetchAllEnsDomains(resolvedAddress);
      } catch (error) {
        console.error("Error fetching ENS domains:", error);
        return [];
      }
    },
    enabled: !!resolvedAddress,
  });

  // Process the data to create nodes and links for ENS domains only
  const networkData = useNetworkGraphData(
    name,
    avatarUrl,
    ensName,
    ensDomains || []
  );

  return {
    networkData,
    selectedNode,
    setSelectedNode,
    loading: loadingEnsDomains,
    hasData: Boolean(ensDomains && ensDomains.length > 0)
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
  ensDomains?: string[]
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
    
    // Additional ENS domains - both .eth and .box
    const ensNodes = (ensDomains || [])
      .filter(domain => domain !== ensName) // Filter out main ENS name to avoid duplication
      .map((domain, idx) => ({
        id: `ens-${idx}`,
        name: domain,
        type: 'ens-domain',
        isDotBox: domain.includes('.box')
      }));
    
    // Combine all nodes - ONLY central node and ENS domains
    const nodes = [
      centralNode,
      ...(mainEnsNode ? [mainEnsNode] : []),
      ...ensNodes
    ];

    // Create links between central node and ENS domains
    const links = [
      // Link to main ENS if exists
      ...(mainEnsNode ? [{ source: 'central', target: 'main-ens', value: 5 }] : []),
      
      // Links to other ENS domains - directly to central node
      ...ensNodes.map(node => ({
        source: 'central',
        target: node.id,
        value: 3
      }))
    ];

    setData({ nodes, links });
  }, [name, avatarUrl, ensName, ensDomains]);

  return data;
}
