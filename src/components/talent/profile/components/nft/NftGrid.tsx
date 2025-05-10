
import React from 'react';
import NftItem from './NftItem';
import { OpenSeaNft } from '@/api/services/openseaService';

// Group NFTs by collection and token ID to show count
export type GroupedNft = {
  id: string;
  name: string;
  imageUrl: string;
  count: number;
  collectionName: string;
  collectionAddress: string;
  description: string;
  tokenId: string;
  tokenType: string;
  chain?: string;
  nfts: any[]; // Store all instances of this NFT
};

export interface NftGridProps {
  nfts: OpenSeaNft[];
  onItemClick: (nft: GroupedNft) => void;
  isLoading?: boolean;
}

const NftGrid: React.FC<NftGridProps> = ({ nfts = [], onItemClick, isLoading = false }) => {
  // Group NFTs by their unique identifiers (collection address + token ID)
  const groupedNfts: GroupedNft[] = [];
  
  if (!isLoading && nfts.length > 0) {
    const nftMap = new Map<string, GroupedNft>();
    
    nfts.forEach(nft => {
      // Create a unique key for this NFT
      const key = `${nft.collectionName}-${nft.id}`;
      
      if (nftMap.has(key)) {
        // Increment count for existing NFT
        const existingNft = nftMap.get(key)!;
        existingNft.count += 1;
        existingNft.nfts.push(nft);
      } else {
        // Add new NFT to map
        nftMap.set(key, {
          id: nft.id,
          name: nft.name || `#${nft.id}`,
          imageUrl: nft.imageUrl || '',
          count: 1,
          collectionName: nft.collectionName || 'Unknown Collection',
          collectionAddress: nft.collectionName,
          description: nft.description || '',
          tokenId: nft.id,
          tokenType: 'ERC721',
          chain: nft.chain,
          nfts: [nft],
        });
      }
    });
    
    // Convert map to array
    nftMap.forEach(value => groupedNfts.push(value));
  }
  
  // Display loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <NftItem 
            key={i}
            name=""
            imageUrl=""
            onClick={() => {}}
            isLoading={true}
          />
        ))}
      </div>
    );
  }
  
  // No NFTs state
  if (groupedNfts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No NFTs found</p>
      </div>
    );
  }
  
  // Display grouped NFTs
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {groupedNfts.map((nft, index) => (
        <NftItem 
          key={`${nft.collectionName}-${nft.id}-${index}`}
          name={nft.name}
          imageUrl={nft.imageUrl}
          count={nft.count}
          onClick={() => onItemClick(nft)}
        />
      ))}
    </div>
  );
};

export default NftGrid;
