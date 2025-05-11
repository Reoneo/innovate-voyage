
import React from 'react';
import { OpenSeaNft } from '@/api/services/openseaService';
import { Badge } from '@/components/ui/badge';

interface NftItemProps {
  nft: OpenSeaNft & { count?: number };
  onClick: (nft: OpenSeaNft) => void;
  showTitle?: boolean;
}

const NftItem: React.FC<NftItemProps> = ({ nft, onClick, showTitle = true }) => {
  return (
    <div 
      className="relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer transition-transform transform hover:scale-105"
      onClick={() => onClick(nft)}
    >
      <div className="aspect-square w-full relative">
        <img 
          src={nft.image_url || 'https://placehold.co/300x300/e2e8f0/64748b?text=No+Image'} 
          alt={nft.name || 'NFT Image'} 
          className="w-full h-full object-cover" 
          loading="lazy"
        />
        
        {/* Count badge */}
        {nft.count && nft.count > 1 && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black bg-opacity-70 text-white">
              x{nft.count}
            </Badge>
          </div>
        )}
      </div>
      
      {/* Only show title if showTitle is true */}
      {showTitle && (
        <div className="p-2 bg-white">
          <p className="text-xs font-medium truncate">
            {nft.name || 'Unnamed NFT'}
          </p>
        </div>
      )}
    </div>
  );
};

export default NftItem;
