
// Fix properties: image_url, name, collection, identifier, count.
import React from 'react';
import { OpenSeaNft } from '@/api/services/openseaService';
import { Skeleton } from '@/components/ui/skeleton';
import type { ViewMode } from './NftCollectionsSection';

interface NftItemProps {
  nft: OpenSeaNft & { count?: number };
  onClick: (nft: OpenSeaNft & { count?: number }) => void;
  viewMode?: ViewMode;
}

const NftItem: React.FC<NftItemProps> = ({ nft, onClick, viewMode = 'grid' }) => {
  const handleClick = () => {
    onClick(nft);
  };

  // Show count badge if NFT count is more than 1
  const showCountBadge = nft.count && nft.count > 1;

  // Get size classes based on view mode
  const getSizeClasses = () => {
    switch (viewMode) {
      case 'large-grid':
        return 'aspect-square w-full';
      case 'list':
        return 'w-16 h-16 flex-shrink-0';
      default:
        return 'aspect-square w-full';
    }
  };

  return (
    <div
      className={`group relative ${getSizeClasses()} overflow-hidden rounded-xl bg-gray-50 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-200 hover:border-gray-300`}
      onClick={handleClick}
    >
      {nft.image_url ? (
        <div className="relative h-full w-full">
          <img
            src={nft.image_url}
            alt={nft.name || "NFT"}
            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
            loading="lazy"
            onError={e => {
              (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
            }}
          />

          {/* Enhanced overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* NFT count badge with improved styling */}
          {showCountBadge && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2.5 py-1 text-xs font-bold rounded-full shadow-lg backdrop-blur-sm border border-white/20">
              {nft.count}×
            </div>
          )}

          {/* NFT name overlay for list view */}
          {viewMode === 'list' && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <p className="text-white text-xs font-medium truncate">
                {nft.name || "Unnamed"}
              </p>
            </div>
          )}
        </div>
      ) : (
        <Skeleton className="h-full w-full" />
      )}
    </div>
  );
};

export default NftItem;
