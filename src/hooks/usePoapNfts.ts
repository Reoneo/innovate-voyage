
import { useQuery } from '@tanstack/react-query';
import { web3Api } from '@/api/web3Api';
import type { POAP } from '@/api/types/poapTypes';

export function usePoapNfts(address: string | undefined) {
  return useQuery({
    queryKey: ['poaps', address],
    queryFn: async () => {
      if (!address) return [];
      try {
        // First try to get POAPs from the POAP API
        const poaps = await web3Api.getPoapsByAddress(address);
        
        // If we got POAPs and they're not just mock data, return them
        if (poaps && poaps.length > 0 && !poaps[0].event.name.includes('Mock')) {
          console.log('Retrieved real POAPs from API:', poaps.length);
          return poaps;
        }
        
        // If we didn't get real POAPs, try to get NFT data from Etherscan
        // that might represent POAPs
        console.log('No real POAPs found, checking Etherscan for NFT data');
        const tokenTransfers = await web3Api.getTokenTransfers(address, 50);
        
        // Process the token transfers to identify potential POAPs
        const potentialPoaps = processPotentialPoaps(address, tokenTransfers);
        if (potentialPoaps.length > 0) {
          console.log('Found potential POAPs from Etherscan:', potentialPoaps.length);
          return potentialPoaps;
        }
        
        // If we still have no data, return the original result (which might be mock data)
        return poaps;
      } catch (error) {
        console.error('Error fetching POAPs:', error);
        return [];
      }
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2, // Retry twice to give more chances to succeed
  });
}

// Helper function to process token transfers and identify potential POAPs
function processPotentialPoaps(address: string, tokenTransfers: any[]): POAP[] {
  if (!tokenTransfers || !Array.isArray(tokenTransfers) || tokenTransfers.length === 0) {
    return [];
  }
  
  // Filter transfers that might be POAPs (xDai chain POAPs or specific contract addresses)
  // This is a simplified approach - in a production app you'd want a more robust check
  const potentialPoaps: POAP[] = tokenTransfers
    .filter(tx => {
      // Check if it's a token transfer TO the user's address (they received the token)
      const isInbound = tx.to.toLowerCase() === address.toLowerCase();
      
      // Check if it's from a known POAP contract address
      // This is a simplified check - in production you'd have a list of POAP contract addresses
      const isPoapContract = tx.tokenName?.includes('POAP') || 
                             tx.tokenSymbol?.includes('POAP') ||
                             tx.contractAddress === '0x22c1f6050e56d2876009903609a2cc3fef83b415'; // POAP contract
      
      return isInbound && isPoapContract;
    })
    .map(tx => {
      // Convert to POAP format
      const eventDate = new Date(parseInt(tx.timeStamp) * 1000);
      const eventYear = eventDate.getFullYear();
      const eventId = tx.tokenID || tx.hash.substring(0, 8);
      
      return {
        event: {
          id: parseInt(eventId),
          fancy_id: `etherscan-poap-${eventId}`,
          name: tx.tokenName || 'POAP from Etherscan',
          description: `Token transfer from Etherscan. Contract: ${tx.contractAddress}`,
          start_date: eventDate.toISOString().split('T')[0],
          end_date: eventDate.toISOString().split('T')[0],
          expiry_date: new Date(eventDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          city: 'Unknown',
          country: 'Unknown',
          event_url: `https://etherscan.io/tx/${tx.hash}`,
          image_url: `https://effigy.im/a/${tx.contractAddress}.svg`, // Generate a placeholder image
          year: eventYear
        },
        tokenId: tx.tokenID || tx.hash,
        owner: address,
        chain: 'ethereum',
        created: new Date(parseInt(tx.timeStamp) * 1000).toISOString()
      };
    });
  
  return potentialPoaps;
}
