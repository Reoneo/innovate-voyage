
import React from 'react';
import CollectionHeader from './CollectionHeader';
import NftGrid, { OpenSeaNftWithCount } from './NftGrid';

interface NftCollectionCardProps {
  collectionName: string;
  nfts: any[];
  onNftClick: (nft: OpenSeaNftWithCount) => void;
  customImage?: string | null;
  network?: string;
  getNetworkIcon?: (network: string) => React.ReactNode;
}

const NftCollectionCard: React.FC<NftCollectionCardProps> = ({ 
  collectionName, 
  nfts,
  onNftClick,
  customImage,
  network,
  getNetworkIcon
}) => {
  return (
    <div key={collectionName} className="space-y-3">
      <CollectionHeader 
        collectionName={collectionName} 
        customImage={customImage}
        network={network}
        getNetworkIcon={getNetworkIcon}
      />
      <NftGrid nfts={nfts} onNftClick={onNftClick} />
    </div>
  );
};

export default NftCollectionCard;
