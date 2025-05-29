
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
      className="group relative aspect-square overflow-hidden rounded-xl bg-gray-50 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-100"
      onClick={handleClick}
    >
      {nft.imageUrl ? (
        <div className="relative h-full w-full">
          <img 
            src={nft.imageUrl} 
            alt={nft.name || "NFT"} 
            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* NFT count badge */}
          {showCountBadge && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
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
