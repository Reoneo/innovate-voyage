
import React from 'react';
import { OpenSeaNft } from '@/api/services/openseaService';
import CollectionHeader from './CollectionHeader';
import NftGrid from './NftGrid';

interface NftCollectionCardProps {
  collectionName: string;
  nfts: OpenSeaNft[];
  onNftClick: (nft: OpenSeaNft) => void;
  chain?: string;
}

const NftCollectionCard: React.FC<NftCollectionCardProps> = ({ 
  collectionName, 
  nfts,
  onNftClick,
  chain
}) => {
  return (
    <div key={collectionName} className="space-y-3">
      <CollectionHeader collectionName={collectionName} chain={chain} />
      <NftGrid nfts={nfts} onNftClick={onNftClick} />
    </div>
  );
};

export default NftCollectionCard;
