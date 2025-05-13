
import React from 'react';
import { OpenSeaNft } from '@/api/services/openseaService';
import NftItem from './NftItem';

interface NftGridProps {
  nfts: OpenSeaNft[];
  onNftClick: (nft: OpenSeaNft & { count?: number }) => void;
}

const NftGrid: React.FC<NftGridProps> = ({ nfts, onNftClick }) => {
  // Combine NFTs by ID for display with count
  const groupedNfts = nfts.reduce<Record<string, OpenSeaNft & { count?: number }>>((acc, nft) => {
    // Use tokenId if id is not available
    const key = `${nft.id || nft.tokenId}-${nft.collectionName}`;
    
    if (acc[key]) {
      acc[key].count = (acc[key].count || 1) + 1;
    } else {
      acc[key] = { ...nft, count: 1 };
    }
    
    return acc;
  }, {});
  
  const uniqueNfts = Object.values(groupedNfts);
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {uniqueNfts.map((nft) => (
        <NftItem 
          key={`${nft.id || nft.tokenId}-${nft.collectionName}`} 
          nft={nft} 
          onClick={onNftClick} 
        />
      ))}
    </div>
  );
};

export default NftGrid;
