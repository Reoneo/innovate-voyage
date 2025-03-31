
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { web3Api } from '@/api/web3Api';
import { useSkillNfts } from '@/hooks/useWeb3';
import { ENSRecord } from '@/api/types/web3Types';
import { getIdNetworkEnsDomains } from '@/api/services/domainsService';

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
  
  // Fetch all ENS domains for this address
  const { data: ensRecords, isLoading: isLoadingEns } = useQuery({
    queryKey: ['idNetworkEnsDomains', resolvedAddress],
    queryFn: async () => {
      if (!resolvedAddress) return [];
      try {
        // Get all ENS records using our improved function
        return await getIdNetworkEnsDomains(resolvedAddress);
      } catch (error) {
        console.error("Error fetching ENS domains for ID Network:", error);
        return [];
      }
    },
    enabled: !!resolvedAddress,
  });

  // Get other web3 profile data
  const { data: web3BioProfile, isLoading: isLoadingBio } = useQuery({
    queryKey: ['web3BioProfile', ensName || resolvedAddress],
    queryFn: async () => {
      if (!ensName && !resolvedAddress) return null;
      try {
        return await web3Api.fetchWeb3BioProfile(ensName || resolvedAddress || '');
      } catch (error) {
        console.error("Error fetching Web3 Bio Profile:", error);
        return null;
      }
    },
    enabled: !!(ensName || resolvedAddress),
  });

  // Get NFT data
  const { data: skillNfts, isLoading: isLoadingNfts } = useSkillNfts(resolvedAddress);

  // Process the data to create nodes and links
  const networkData = useNetworkGraphData(
    name,
    avatarUrl,
    ensName,
    ensRecords,
    web3BioProfile,
    skillNfts
  );

  return {
    networkData,
    selectedNode,
    setSelectedNode,
    loading: isLoadingEns || isLoadingBio || isLoadingNfts,
    hasData: Boolean(
      (ensRecords && ensRecords.length > 0) || 
      web3BioProfile || 
      (skillNfts && skillNfts.length > 0)
    )
  };
}

/**
 * Hook to process the data into nodes and links for the D3 graph
 */
function useNetworkGraphData(
  name: string,
  avatarUrl?: string,
  ensName?: string,
  ensRecords?: ENSRecord[],
  web3BioProfile?: any,
  skillNfts?: any[]
): NetworkData {
  const [data, setData] = useState<NetworkData>({ nodes: [], links: [] });

  useEffect(() => {
    // Create nodes for the identity network
    const centralNode: NetworkNode = { id: 'central', name, type: 'user', avatar: avatarUrl };
    
    // Process all ENS domains
    const ensNodes: NetworkNode[] = [];
    
    // Process all ENS domains from query
    if (ensRecords && ensRecords.length > 0) {
      // Add all ENS domains from the records
      ensRecords.forEach((record, idx) => {
        ensNodes.push({
          id: `ens-${idx}`,
          name: record.ensName,
          type: 'ens-domain',
          avatar: record.avatar,
          isDotBox: record.ensName.includes('.box')
        });
      });
    }
    
    // Identity-related NFTs
    const identityNfts = skillNfts?.filter(nft => 
      nft.name.toLowerCase().includes('identity') || 
      nft.name.toLowerCase().includes('passport') ||
      nft.name.toLowerCase().includes('account') ||
      nft.name.toLowerCase().includes('profile')
    ).map((nft, idx) => ({
      id: `nft-${idx}`,
      name: nft.name,
      type: 'identity-nft',
      image: nft.image
    })) || [];
    
    // Web3 bio platform nodes
    const bioNodes = web3BioProfile?.platform ? [{
      id: 'web3bio',
      name: web3BioProfile.platform,
      type: 'platform'
    }] : [];
    
    // Combine all nodes
    const nodes = [
      centralNode,
      ...ensNodes,
      ...identityNfts,
      ...bioNodes
    ];

    // Create links between central node and other identity elements
    // All ENS domains now directly connect to central node
    const links = [
      // Links to ENS domains
      ...ensNodes.map(node => ({
        source: 'central',
        target: node.id,
        value: 3
      })),
      
      // Links to NFTs
      ...identityNfts.map(node => ({
        source: 'central',
        target: node.id,
        value: 2
      })),
      
      // Links to web3 bio platforms
      ...bioNodes.map(node => ({
        source: 'central',
        target: node.id,
        value: 2
      }))
    ];

    setData({ nodes, links });
  }, [name, avatarUrl, ensName, ensRecords, web3BioProfile, skillNfts]);

  return data;
}
