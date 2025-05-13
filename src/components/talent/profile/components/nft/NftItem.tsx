
import React from 'react';
import { OpenSeaNft } from '@/api/services/openseaService';
import { Skeleton } from '@/components/ui/skeleton';

interface NftItemProps {
  nft: OpenSeaNft & { count?: number };
  onClick: (nft: OpenSeaNft & { count?: number }) => void;
}

const NftItem: React.FC<NftItemProps> = ({ nft, onClick }) => {
  const handleClick = () => {
    onClick(nft);
  };

  // Show count badge if NFT count is more than 1
  const showCountBadge = nft.count && nft.count > 1;

  return (
    <div 
      className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 cursor-pointer transition-all hover:scale-105"
      onClick={handleClick}
    >
      {nft.imageUrl ? (
        <div className="relative h-full w-full">
          <img 
            src={nft.imageUrl} 
            alt={nft.name || "NFT"} 
            className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          
          {/* NFT count badge */}
          {showCountBadge && (
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 text-xs font-bold rounded-full">
              {nft.count}x
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
