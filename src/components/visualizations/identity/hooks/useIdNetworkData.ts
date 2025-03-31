
import { useQuery } from '@tanstack/react-query';
import { web3Api } from '@/api/web3Api';
import { useSkillNfts } from '@/hooks/useWeb3';
import { useNetworkGraphData } from './useNetworkGraphData';
import { useNodeSelection } from './useNodeSelection';
import { NetworkData } from '../types/networkTypes';

/**
 * Hook to process and prepare data for the ID Network graph
 */
export function useIdNetworkData(name: string, avatarUrl?: string, ensName?: string, address?: string) {
  const { selectedNode, setSelectedNode } = useNodeSelection();
  
  // Get resolved address - consider both .eth and .box domains
  const resolvedAddress = address || (ensName && !ensName.includes('.eth') && !ensName.includes('.box')) ? ensName : undefined;
  
  // Fetch all ENS domains for this address
  const { data: ensRecords, isLoading: isLoadingEns } = useQuery({
    queryKey: ['idNetworkEnsDomains', resolvedAddress],
    queryFn: async () => {
      if (!resolvedAddress) return [];
      try {
        // Get all ENS records using our improved function
        return await web3Api.getIdNetworkEnsDomains(resolvedAddress);
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
  const networkData: NetworkData = useNetworkGraphData(
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

// Re-export types from networkTypes for backward compatibility
export { NetworkData, NetworkNode, NetworkLink } from '../types/networkTypes';
