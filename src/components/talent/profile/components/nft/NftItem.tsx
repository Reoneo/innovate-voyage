
import React from 'react';
import { OpenSeaNft } from '@/api/services/openseaService';

interface NftItemProps {
  nft: OpenSeaNft;
  onClick: (nft: OpenSeaNft) => void;
}

const NftItem: React.FC<NftItemProps> = ({ nft, onClick }) => {
  // Special handling for Ethereum Follow Protocol NFTs
  const isEfp = nft.collectionName?.toLowerCase().includes('ethereum follow protocol') || 
                nft.collectionName?.toLowerCase().includes('efp');
  
  // Check if this is a custom NFT (promotional link)
  const isCustom = nft.isCustom || false;
  
  // Render EFP NFTs differently
  if (isEfp) {
    return (
      <div 
        className="relative rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onClick(nft)}
      >
        <div className="relative aspect-square bg-gray-100">
          <img 
            src={nft.imageUrl} 
            alt={nft.name} 
            className="object-cover w-full h-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://public.rootdata.com/images/b6/1704560912107.png";
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <p className="text-white text-sm font-medium truncate px-2 text-center">
              {nft.name}
            </p>
          </div>
        </div>
        
        {isCustom && (
          <div className="absolute top-1 right-1 bg-gray-900 text-white text-xs px-1 rounded">
            AD
          </div>
        )}
      </div>
    );
  }
  
  // Standard NFT rendering
  return (
    <div 
      className="relative rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(nft)}
    >
      <div className="aspect-square bg-gray-100">
        <img 
          src={nft.imageUrl} 
          alt={nft.name} 
          className="object-cover w-full h-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/6699/6699362.png";
          }}
        />
      </div>
      
      {isCustom && (
        <div className="absolute top-1 right-1 bg-gray-900 text-white text-xs px-1 rounded">
          AD
        </div>
      )}
    </div>
  );
};

export default NftItem;
