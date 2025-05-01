
import React from 'react';
import { OpenSeaNft } from '@/api/services/openseaService';
import NftItem from './NftItem';

interface NftGridProps {
  nfts: OpenSeaNft[];
  onNftClick: (nft: OpenSeaNft) => void;
}

const NftGrid: React.FC<NftGridProps> = ({ nfts, onNftClick }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {nfts.map((nft) => (
        <NftItem 
          key={nft.id} 
          nft={nft} 
          onClick={onNftClick} 
        />
      ))}
    </div>
  );
};

export default NftGrid;
