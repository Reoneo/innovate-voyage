
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import NftCollectionCard from './NftCollectionCard';
import type { OpenSeaNft } from '@/api/services/openseaService';
import { Package, Sparkles, Grid3X3 } from 'lucide-react';
import type { ViewMode } from './NftCollectionsSection';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  if (loading) {
    const skeletonCount = isMobile ? 3 : 6;
    return (
      <div className="space-y-6">
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
          {[...Array(skeletonCount)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className={`${isMobile ? 'p-4' : 'p-6'} space-y-4`}>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-3 gap-3'}`}>
                  {[...Array(isMobile ? 4 : 6)].map((_, j) => (
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

  // Filter collections based on selected type and exclude poapv2
  const filteredCollections = collections
    .filter(collection => !collection.collection.toLowerCase().includes('poap v2'))
    .filter(collection => {
      if (selectedType === 'all') return true;
      
      // Check if any NFT in the collection matches the selected type
      return collection.nfts.some((nft: any) => {
        // Map token standards to our filter types
        switch (selectedType) {
          case 'ethereum':
            return nft.token_standard === 'erc721' || nft.token_standard === 'erc1155';
          case 'ens':
            return nft.token_standard === 'ens' || nft.collection.toLowerCase().includes('ens');
          case 'poap':
            return nft.token_standard === 'poap' || nft.collection.toLowerCase().includes('poap');
          case '3dns':
            return nft.token_standard === '3dns';
          default:
            return true;
        }
      });
    }).map(collection => ({
      ...collection,
      nfts: selectedType === 'all' 
        ? collection.nfts 
        : collection.nfts.filter((nft: any) => {
            switch (selectedType) {
              case 'ethereum':
                return nft.token_standard === 'erc721' || nft.token_standard === 'erc1155';
              case 'ens':
                return nft.token_standard === 'ens' || nft.collection.toLowerCase().includes('ens');
              case 'poap':
                return nft.token_standard === 'poap' || nft.collection.toLowerCase().includes('poap');
              case '3dns':
                return nft.token_standard === '3dns';
              default:
                return true;
            }
          })
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
        <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold text-gray-800 mb-3`}>No Collections Found</h3>
        <p className={`text-gray-500 max-w-md leading-relaxed ${isMobile ? 'text-sm px-4' : ''}`}>
          {selectedType === 'all' 
            ? "This wallet doesn't have any NFT collections yet. Start collecting to see them here!"
            : `No ${selectedType.toUpperCase()} collections found for this wallet. Try selecting a different category.`
          }
        </p>
      </div>
    );
  }

  // Determine grid layout based on view mode and mobile
  const getGridClass = () => {
    if (isMobile) {
      return viewMode === 'list' ? 'space-y-3' : 'grid grid-cols-1 gap-4';
    }
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
        <div className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
          <Grid3X3 size={isMobile ? 14 : 16} />
          <span>{filteredCollections.length} collection{filteredCollections.length !== 1 ? 's' : ''}</span>
          <span>•</span>
          <span>{filteredCollections.reduce((total, collection) => total + collection.nfts.length, 0)} items</span>
        </div>
      </div>

      <div className={getGridClass()}>
        {filteredCollections.map((collection, index) => (
          <NftCollectionCard
            key={`${collection.collection}-${index}`}
            collectionName={collection.collection}
            nfts={collection.nfts}
            onNftClick={onNftClick}
            viewMode={isMobile && viewMode === 'large-grid' ? 'grid' : viewMode}
          />
        ))}
      </div>
    </div>
  );
};

export default NftCollectionsContent;
