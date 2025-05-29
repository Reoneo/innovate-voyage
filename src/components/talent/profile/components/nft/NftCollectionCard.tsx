
import React from 'react';
import { OpenSeaNft } from '@/api/services/openseaService';
import CollectionHeader from './CollectionHeader';
import NftGrid from './NftGrid';

interface NftCollectionCardProps {
  collectionName: string;
  nfts: OpenSeaNft[];
  onNftClick: (nft: OpenSeaNft) => void;
}

const NftCollectionCard: React.FC<NftCollectionCardProps> = ({ 
  collectionName, 
  nfts,
  onNftClick 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group">
      <div className="p-4">
        <CollectionHeader collectionName={collectionName} />
      </div>
      <div className="px-4 pb-4">
        <NftGrid nfts={nfts} onNftClick={onNftClick} />
      </div>
    </div>
  );
};

export default NftCollectionCard;
