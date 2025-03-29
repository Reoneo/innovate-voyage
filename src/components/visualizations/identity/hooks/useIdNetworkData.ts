
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { web3Api } from '@/api/web3Api';
import { useSkillNfts } from '@/hooks/useWeb3';
import { ENSRecord } from '@/api/types/web3Types';

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
  const { data: ensRecords } = useQuery({
    queryKey: ['ensRecords', resolvedAddress],
    queryFn: async () => {
      if (!resolvedAddress) return [];
      try {
        // Get all ENS records
        const records = await web3Api.getAllEnsRecords();
        
        // Filter records to include only those belonging to the address
        // and ensure we include both .eth and .box domains
        return records.filter(record => 
          record.address.toLowerCase() === resolvedAddress.toLowerCase()
        );
      } catch (error) {
        console.error("Error fetching ENS domains:", error);
        return [];
      }
    },
    enabled: !!resolvedAddress,
  });

  // Get other web3 profile data
  const { data: web3BioProfile } = useQuery({
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
  const { data: skillNfts } = useSkillNfts(resolvedAddress);

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
    loading: !ensRecords && !web3BioProfile && !skillNfts,
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
    
    // Main ENS domain node - could be .eth or .box
    const mainEnsNode = ensName ? { 
      id: 'main-ens', 
      name: ensName, 
      type: 'ens-main',
      isDotBox: ensName.includes('.box') 
    } : null;
    
    // Additional ENS domains - both .eth and .box
    const ensNodes = ensRecords?.filter(domain => 
      domain.ensName !== ensName
    ).map((domain, idx) => ({
      id: `ens-${idx}`,
      name: domain.ensName,
      type: 'ens-other',
      avatar: domain.avatar,
      isDotBox: domain.ensName.includes('.box')
    })) || [];
    
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
      ...(mainEnsNode ? [mainEnsNode] : []),
      ...ensNodes,
      ...identityNfts,
      ...bioNodes
    ];

    // Create links between central node and other identity elements
    const links = [
      // Link to main ENS
      ...(mainEnsNode ? [{ source: 'central', target: 'main-ens', value: 5 }] : []),
      
      // Links to other ENS domains
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
