
import React, { useState } from 'react';
import { OpenSeaNft } from '@/api/services/openseaService';
import NftItem from './NftItem';
import type { ViewMode } from './NftCollectionsSection';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface NftGridProps {
  nfts: OpenSeaNft[];
  onNftClick: (nft: OpenSeaNft & { count?: number }) => void;
  viewMode?: ViewMode;
}

const NftGrid: React.FC<NftGridProps> = ({ nfts, onNftClick, viewMode = 'grid' }) => {
  const [showAll, setShowAll] = useState(false);
  const isMobile = useIsMobile();

  // Group NFTs by identifier+collection for display with count
  const groupedNfts = nfts.reduce<Record<string, OpenSeaNft & { count?: number }>>((acc, nft) => {
    const key = `${nft.identifier}-${nft.collection}`;
    if (acc[key]) {
      acc[key].count = (acc[key].count || 1) + 1;
    } else {
      acc[key] = { ...nft, count: 1 };
    }
    return acc;
  }, {});

  const uniqueNfts = Object.values(groupedNfts);

  // Adjust display count based on view mode and device
  const getDisplayCount = () => {
    if (isMobile) {
      switch (viewMode) {
        case 'list': return 3;
        default: return 4;
      }
    }
    switch (viewMode) {
      case 'large-grid': return 8;
      case 'list': return 4;
      default: return 6;
    }
  };

  const displayCount = getDisplayCount();
  const displayNfts = showAll ? uniqueNfts : uniqueNfts.slice(0, displayCount);
  const hasMore = uniqueNfts.length > displayCount;

  // Get grid classes based on view mode and device
  const getGridClasses = () => {
    if (isMobile) {
      switch (viewMode) {
        case 'list':
          return 'flex gap-2 overflow-x-auto pb-2';
        default:
          return 'grid grid-cols-2 gap-2';
      }
    }
    switch (viewMode) {
      case 'large-grid':
        return 'grid grid-cols-4 gap-4';
      case 'list':
        return 'flex gap-3 overflow-x-auto pb-2';
      default:
        return 'grid grid-cols-3 gap-3';
    }
  };

  if (uniqueNfts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No NFTs in this collection</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={getGridClasses()}>
        {displayNfts.map((nft) => (
          <NftItem
            key={`${nft.identifier}-${nft.collection}`}
            nft={nft}
            onClick={onNftClick}
            viewMode={viewMode}
          />
        ))}
      </div>
      {hasMore && !showAll && (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 transition-colors"
          >
            +{uniqueNfts.length - displayCount} more item{uniqueNfts.length - displayCount !== 1 ? 's' : ''}
          </Button>
        </div>
      )}
      {showAll && hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(false)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 transition-colors"
          >
            Show less
          </Button>
        </div>
      )}
    </div>
  );
};

export default NftGrid;
