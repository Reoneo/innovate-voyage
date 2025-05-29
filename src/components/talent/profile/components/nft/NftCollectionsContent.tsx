
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import NftCollectionCard from './NftCollectionCard';
import type { OpenSeaNft } from '@/api/services/openseaService';
import { Package, Sparkles, Grid3X3 } from 'lucide-react';
import type { ViewMode } from './NftCollectionsSection';

interface NftCollectionsContentProps {
  collections: any[];
  loading: boolean;
  selectedType: 'ethereum' | 'ens' | 'poap' | '3dns' | 'all';
  onNftClick: (nft: OpenSeaNft) => void;
  viewMode: ViewMode;
}

const NftCollectionsContent: React.FC<NftCollectionsContentProps> = ({
  collections,
  loading,
  selectedType,
  onNftClick,
  viewMode
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[...Array(6)].map((_, j) => (
                    <Skeleton key={j} className="aspect-square rounded-xl" />
                  ))}
                </div>
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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl flex items-center justify-center shadow-sm">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Collections Found</h3>
        <p className="text-gray-500 max-w-md leading-relaxed">
          {selectedType === 'all' 
            ? "This wallet doesn't have any NFT collections yet. Start collecting to see them here!"
            : `No ${selectedType.toUpperCase()} collections found for this wallet. Try selecting a different category.`
          }
        </p>
      </div>
    );
  }

  // Determine grid layout based on view mode
  const getGridClass = () => {
    switch (viewMode) {
      case 'large-grid':
        return 'grid grid-cols-1 md:grid-cols-2 gap-8';
      case 'list':
        return 'space-y-4';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6';
    }
  };

  return (
    <div className="space-y-6">
      {/* Collections Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Grid3X3 size={16} />
          <span>{filteredCollections.length} collection{filteredCollections.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className={getGridClass()}>
        {filteredCollections.map((collection, index) => (
          <NftCollectionCard
            key={`${collection.name}-${index}`}
            collectionName={collection.name}
            nfts={collection.nfts}
            onNftClick={onNftClick}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
};

export default NftCollectionsContent;
