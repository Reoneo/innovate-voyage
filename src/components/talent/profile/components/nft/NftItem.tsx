
import React from 'react';
import { NftItemProps } from './types/NftTypes';

const NftItem: React.FC<NftItemProps> = ({ nft, onClick }) => {
  const handleClick = () => {
    onClick(nft);
  };

  // Show count badge if NFT count is more than 1
  const showCountBadge = nft.count && nft.count > 1;
  // Show AD badge for sponsored NFTs
  const showAdBadge = nft.isAd;
  
  // Special handling for EFP NFTs (Ethereum Follow Protocol)
  const isEfpNft = nft.collectionName?.toLowerCase().includes('ethereum follow protocol') || 
                   nft.collectionName?.toLowerCase().includes('efp');
  
  return (
    <div 
      className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 cursor-pointer transition-all hover:scale-105"
      onClick={handleClick}
    >
      {isEfpNft ? (
        <div className="relative h-full w-full flex flex-col items-center justify-center bg-gray-100 p-2">
          <img 
            src="https://public.rootdata.com/images/b6/1704560912107.png" 
            alt={nft.name || "EFP NFT"} 
            className="h-3/4 w-3/4 object-contain"
          />
          <div className="mt-2 text-center text-xs font-medium truncate w-full">
            {nft.name}
          </div>
        </div>
      ) : (
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
          
          {/* AD badge for sponsored items */}
          {showAdBadge && (
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 text-xs font-bold rounded-full">
              AD
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NftItem;
