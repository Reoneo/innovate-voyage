
import React from 'react';
import { OpenSeaNft } from '@/api/services/openseaService';
import NftItem from './NftItem';
import type { ViewMode } from './NftCollectionsSection';

interface NftGridProps {
  nfts: OpenSeaNft[];
  onNftClick: (nft: OpenSeaNft & { count?: number }) => void;
  viewMode?: ViewMode;
}

const NftGrid: React.FC<NftGridProps> = ({ nfts, onNftClick, viewMode = 'grid' }) => {
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
  
  // Adjust display count based on view mode
  const getDisplayCount = () => {
    switch (viewMode) {
      case 'large-grid': return 8;
      case 'list': return 4;
      default: return 6;
    }
  };
  
  const displayCount = getDisplayCount();
  const displayNfts = uniqueNfts.slice(0, displayCount);
  const hasMore = uniqueNfts.length > displayCount;
  
  // Get grid classes based on view mode
  const getGridClasses = () => {
    switch (viewMode) {
      case 'large-grid':
        return 'grid grid-cols-4 gap-4';
      case 'list':
        return 'flex gap-3 overflow-x-auto pb-2';
      default:
        return 'grid grid-cols-3 gap-3';
    }
  };

  return (
    <div className="space-y-4">
      <div className={getGridClasses()}>
        {displayNfts.map((nft) => (
          <NftItem 
            key={`${nft.id}-${nft.collectionName}`} 
            nft={nft} 
            onClick={onNftClick}
            viewMode={viewMode}
          />
        ))}
      </div>
      {hasMore && (
        <div className="text-center">
          <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer">
            +{uniqueNfts.length - displayCount} more item{uniqueNfts.length - displayCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default NftGrid;
