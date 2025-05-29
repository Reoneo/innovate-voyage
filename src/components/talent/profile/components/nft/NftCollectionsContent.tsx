
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import NftCollectionCard from './NftCollectionCard';
import type { OpenSeaNft } from '@/api/services/openseaService';

interface NftCollectionsContentProps {
  collections: any[];
  loading: boolean;
  selectedType: 'ethereum' | 'ens' | 'poap' | '3dns' | 'all';
  onNftClick: (nft: OpenSeaNft) => void;
}

const NftCollectionsContent: React.FC<NftCollectionsContentProps> = ({
  collections,
  loading,
  selectedType,
  onNftClick
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Filter collections based on selected type
  const filteredCollections = collections.filter(collection => {
    if (selectedType === 'all') return true;
    return collection.nfts.some((nft: any) => nft.type === selectedType);
  }).map(collection => ({
    ...collection,
    nfts: selectedType === 'all' 
      ? collection.nfts 
      : collection.nfts.filter((nft: any) => nft.type === selectedType)
  })).filter(collection => collection.nfts.length > 0);

  if (filteredCollections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-400 mb-2">📦</div>
        <h3 className="text-lg font-medium text-gray-600 mb-1">No Collections Found</h3>
        <p className="text-sm text-gray-400">
          {selectedType === 'all' 
            ? "This wallet doesn't have any NFT collections yet."
            : `No ${selectedType.toUpperCase()} collections found for this wallet.`
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCollections.map((collection, index) => (
          <NftCollectionCard
            key={`${collection.name}-${index}`}
            collectionName={collection.name}
            nfts={collection.nfts}
            onNftClick={onNftClick}
          />
        ))}
      </div>
    </div>
  );
};

export default NftCollectionsContent;
