
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import NftCollectionCard from './NftCollectionCard';
import type { OpenSeaNft } from '@/api/services/openseaService';
import { Package, Sparkles } from 'lucide-react';

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
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[...Array(6)].map((_, j) => (
                  <Skeleton key={j} className="aspect-square rounded-xl" />
                ))}
              </div>
            </div>
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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Collections Found</h3>
        <p className="text-gray-500 max-w-md">
          {selectedType === 'all' 
            ? "This wallet doesn't have any NFT collections yet. Start collecting to see them here!"
            : `No ${selectedType.toUpperCase()} collections found for this wallet. Try selecting a different category.`
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
