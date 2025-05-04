
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
  // Determine the network from the first NFT in the collection
  const network = nfts[0]?.chain_identifier || 'ethereum';
  
  return (
    <div key={collectionName} className="space-y-3">
      <CollectionHeader 
        collectionName={collectionName} 
        network={network} 
      />
      <NftGrid nfts={nfts} onNftClick={onNftClick} />
    </div>
  );
};

export default NftCollectionCard;
