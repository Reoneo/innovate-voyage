
import React from 'react';
import { Card } from '@/components/ui/card';
import CollectionHeader from './CollectionHeader';
import NftGrid from './NftGrid';
import { type OpenSeaNft } from '@/api/services/openseaService';

interface NftCollectionCardProps {
  collection: {
    name: string;
    type: 'ethereum' | 'ens' | 'poap' | 'base';
    nfts: OpenSeaNft[];
  };
  onNftClick: (nft: OpenSeaNft) => void;
}

const NftCollectionCard: React.FC<NftCollectionCardProps> = ({ 
  collection,
  onNftClick
}) => {
  const getCollectionIcon = () => {
    switch (collection.type) {
      case 'ethereum':
        return 'https://cdn-icons-png.flaticon.com/512/7829/7829596.png';
      case 'ens':
        return 'https://cryptologos.cc/logos/ethereum-name-service-ens-logo.png';
      case 'poap':
        return 'https://avatars.githubusercontent.com/u/43257403';
      case 'base':
        return 'https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue.png';
      default:
        return 'https://cdn-icons-png.flaticon.com/512/7829/7829596.png';
    }
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-xl">
      <CollectionHeader 
        name={collection.name}
        icon={getCollectionIcon()}
        count={collection.nfts.length}
        type={collection.type}
      />
      <NftGrid 
        nfts={collection.nfts.slice(0, 9)} 
        onNftClick={onNftClick}
      />
    </Card>
  );
};

export default NftCollectionCard;
