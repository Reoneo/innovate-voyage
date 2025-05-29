
import React from 'react';
import { OpenSeaNft } from '@/api/services/openseaService';
import NftItem from './NftItem';

interface NftGridProps {
  nfts: OpenSeaNft[];
  onNftClick: (nft: OpenSeaNft & { count?: number }) => void;
}

const NftGrid: React.FC<NftGridProps> = ({ nfts, onNftClick }) => {
  // Filter out POAP v2 collections
  const filteredNfts = nfts.filter(nft => 
    !nft.collectionName?.toLowerCase().includes('poap v2')
  );
  
  // Combine NFTs by ID for display with count
  const groupedNfts = filteredNfts.reduce<Record<string, OpenSeaNft & { count?: number }>>((acc, nft) => {
    const key = `${nft.id}-${nft.collectionName}`;
    
    if (acc[key]) {
      acc[key].count = (acc[key].count || 1) + 1;
    } else {
      acc[key] = { ...nft, count: 1 };
    }
    
    return acc;
  }, {});
  
  const uniqueNfts = Object.values(groupedNfts);
  
  // Show limited number of NFTs per collection with "show more" option
  const displayNfts = uniqueNfts.slice(0, 6);
  const hasMore = uniqueNfts.length > 6;
  
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {displayNfts.map((nft) => (
          <NftItem 
            key={`${nft.id}-${nft.collectionName}`} 
            nft={nft} 
            onClick={onNftClick} 
          />
        ))}
      </div>
      {hasMore && (
        <div className="text-center">
          <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            +{uniqueNfts.length - 6} more items
          </span>
        </div>
      )}
    </div>
  );
};

export default NftGrid;
