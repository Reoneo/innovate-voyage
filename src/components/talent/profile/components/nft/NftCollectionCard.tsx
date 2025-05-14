
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
  // Ensure all NFTs have the required properties
  const processedNfts = nfts.map(nft => ({
    ...nft,
    imageUrl: nft.imageUrl || '',
    collectionName: nft.collectionName || collectionName || 'Unknown Collection'
  }));
  
  return (
    <div key={collectionName} className="space-y-3">
      <CollectionHeader collectionName={collectionName} />
      <NftGrid nfts={processedNfts} onNftClick={onNftClick} />
    </div>
  );
};

export default NftCollectionCard;
