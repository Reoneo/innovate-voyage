
import React from 'react';
import NftItem from './NftItem';

// Group NFTs by collection and token ID to show count
type GroupedNft = {
  name: string;
  imageUrl: string;
  count: number;
  collectionName: string;
  collectionAddress: string;
  description: string;
  tokenId: string;
  tokenType: string;
  nfts: any[]; // Store all instances of this NFT
};

interface NftGridProps {
  nfts: any[];
  onItemClick: (nft: any) => void;
  isLoading?: boolean;
}

const NftGrid: React.FC<NftGridProps> = ({ nfts = [], onItemClick, isLoading = false }) => {
  // Group NFTs by their unique identifiers (collection address + token ID)
  const groupedNfts: GroupedNft[] = [];
  
  if (!isLoading && nfts.length > 0) {
    const nftMap = new Map<string, GroupedNft>();
    
    nfts.forEach(nft => {
      const key = `${nft.contract_address}-${nft.token_id}`;
      
      if (nftMap.has(key)) {
        // Increment count for existing NFT
        const existingNft = nftMap.get(key)!;
        existingNft.count += 1;
        existingNft.nfts.push(nft);
      } else {
        // Add new NFT to map
        nftMap.set(key, {
          name: nft.name || `#${nft.token_id}`,
          imageUrl: nft.image_url || '',
          count: 1,
          collectionName: nft.collection_name || 'Unknown Collection',
          collectionAddress: nft.contract_address,
          description: nft.description || '',
          tokenId: nft.token_id,
          tokenType: nft.contract_type || 'ERC721',
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
          key={`${nft.collectionAddress}-${nft.tokenId}-${index}`}
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
