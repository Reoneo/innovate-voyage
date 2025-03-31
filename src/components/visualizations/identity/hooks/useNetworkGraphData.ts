
import { useState, useEffect } from 'react';
import { ENSRecord } from '@/api/types/web3Types';
import { NetworkData, NetworkNode, NetworkLink } from '../types/networkTypes';

/**
 * Hook to process the data into nodes and links for the D3 graph
 */
export function useNetworkGraphData(
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
