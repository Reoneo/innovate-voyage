
import React from 'react';
import { OpenSeaNft } from '@/api/services/openseaService';

interface NftItemProps {
  nft: OpenSeaNft;
  onClick: (nft: OpenSeaNft) => void;
}

const NftItem: React.FC<NftItemProps> = ({ nft, onClick }) => {
  return (
    <div 
      className="relative group cursor-pointer"
      onClick={() => onClick(nft)}
    >
      <div className="aspect-square w-full relative">
        <img 
          src={nft.imageUrl} 
          alt={nft.name}
          className="w-full h-full object-contain rounded-lg"
        />
      </div>
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-2 flex flex-col justify-end">
        <div className="text-white text-sm">
          <p className="font-medium truncate">{nft.name}</p>
          {nft.bestOffer && (
            <p className="text-xs">Best offer: {nft.bestOffer} ETH</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NftItem;
