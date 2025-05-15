
import React from 'react';
import { OpenSeaNft } from '@/api/services/openseaService';
import CollectionHeader from './CollectionHeader';
import NftGrid from './NftGrid';

interface NftCollectionCardProps {
  collectionName: string;
  nfts: OpenSeaNft[];
  onNftClick: (nft: OpenSeaNft) => void;
  type?: 'ethereum' | 'ens' | 'poap' | '3dns' | 'base';
}

const NftCollectionCard: React.FC<NftCollectionCardProps> = ({ 
  collectionName, 
  nfts,
  onNftClick,
  type 
}) => {
  return (
    <div key={collectionName} className="space-y-3">
      <CollectionHeader collectionName={collectionName} type={type} />
      <NftGrid nfts={nfts} onNftClick={onNftClick} />
    </div>
  );
};

export default NftCollectionCard;
