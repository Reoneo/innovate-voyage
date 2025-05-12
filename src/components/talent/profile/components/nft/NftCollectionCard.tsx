
import React from 'react';
import { NftCollectionCardProps } from './types/NftTypes';
import CollectionHeader from './CollectionHeader';
import NftGrid from './NftGrid';

const NftCollectionCard: React.FC<NftCollectionCardProps> = ({ 
  collectionName, 
  nfts,
  onNftClick 
}) => {
  return (
    <div key={collectionName} className="space-y-3">
      <CollectionHeader collectionName={collectionName} />
      <NftGrid nfts={nfts} onNftClick={onNftClick} />
    </div>
  );
};

export default NftCollectionCard;
