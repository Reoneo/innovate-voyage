import { supabase } from '@/integrations/supabase/client';

export interface OpenSeaNft {
  id: string;
  name: string;
  imageUrl: string;
  collectionName: string;
  description?: string;
  currentPrice?: string;
  bestOffer?: string;
  owner?: string;
  chain?: string;
  count?: number; // Added count property
  type?: 'ethereum' | 'ens' | 'poap' | '3dns';
}

interface OpenSeaCollection {
  name: string;
  nfts: OpenSeaNft[];
  type: 'ethereum' | 'ens' | 'poap' | '3dns';
}

// Chains supported by OpenSea API
const SUPPORTED_CHAINS = [
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'base', name: 'Base' },
  { id: 'optimism', name: 'Optimism' },
  { id: 'polygon', name: 'Polygon' }
];

// Create cache to avoid redundant API calls
const nftCache = new Map<string, OpenSeaCollection[]>();

export async function fetchUserNfts(walletAddress: string): Promise<OpenSeaCollection[]> {
  // Check if we have cached data for this address
  const cacheKey = walletAddress.toLowerCase();
  if (nftCache.has(cacheKey)) {
    return nftCache.get(cacheKey) || [];
  }
  
  try {
    const { data, error } = await supabase.functions.invoke('proxy-opensea', {
      body: { walletAddress },
    });

    if (error) {
      console.error('Error fetching NFTs via proxy:', error);
      throw error;
    }

    if (!data) {
        return [];
    }

    const collections: OpenSeaCollection[] = data;

    // Cache the results to avoid redundant API calls
    nftCache.set(cacheKey, collections);
    
    return collections;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
}

// Function to fetch avatar for .box domain from OpenSea
export async function fetchDotBoxAvatar(domainName: string): Promise<string | null> {
  try {
    // Check if it's a .box domain
    if (!domainName.endsWith('.box')) return null;

    // Try to find address associated with .box domain
    const response = await fetch(`https://api.dot.bit/v1/account/info?account=${domainName}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (!data?.data?.address) return null;
    
    // Get account's NFTs to find avatar
    const address = data.data.address;
    const collections = await fetchUserNfts(address);
    
    // Look for profile NFT or ENS NFT that might be used as avatar
    for (const collection of collections) {
      // If we find an NFT with name matching the domain, that's likely the avatar
      const matchingNft = collection.nfts.find(nft => {
        const nftNameLower = nft.name.toLowerCase();
        const domainNameLower = domainName.toLowerCase();
        const domainWithoutSuffix = domainName.replace('.box', '').toLowerCase();
        
        return nftNameLower === domainNameLower || 
               nftNameLower === domainWithoutSuffix ||
               nftNameLower.includes(domainWithoutSuffix);
      });
      
      if (matchingNft?.imageUrl) {
        return matchingNft.imageUrl;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching .box avatar from OpenSea:', error);
    return null;
  }
}
