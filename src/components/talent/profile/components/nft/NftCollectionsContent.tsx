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

  console.log('NftCollectionsContent - Raw collections:', collections);
  console.log('NftCollectionsContent - Selected type:', selectedType);

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

  // More lenient filtering - only filter out obviously problematic collections
  const filteredCollections = collections
    .filter(collection => {
      // Keep all collections unless they are clearly problematic
      const collectionName = collection.collection || '';
      const isProblematic = collectionName.toLowerCase().includes('poap v2') || 
                            collectionName.toLowerCase().includes('test') ||
                            !collection.nfts || 
                            collection.nfts.length === 0;
      
      console.log('Collection filtering:', collectionName, 'isProblematic:', isProblematic);
      return !isProblematic;
    })
    .filter(collection => {
      if (selectedType === 'all') return true;
      
      // Check if any NFT in the collection matches the selected type
      return collection.nfts.some((nft: any) => {
        // More flexible type matching
        const tokenStandard = nft.token_standard?.toLowerCase() || '';
        const collectionName = (nft.collection || collection.collection || '').toLowerCase();
        
        switch (selectedType) {
          case 'ethereum':
            return tokenStandard.includes('erc721') || 
                   tokenStandard.includes('erc1155') ||
                   tokenStandard === 'erc-721' ||
                   tokenStandard === 'erc-1155' ||
                   (!tokenStandard && !collectionName.includes('ens') && !collectionName.includes('poap'));
          case 'ens':
            return tokenStandard.includes('ens') || collectionName.includes('ens');
          case 'poap':
            return tokenStandard.includes('poap') || collectionName.includes('poap');
          case '3dns':
            return tokenStandard.includes('3dns') || collectionName.includes('3dns');
          default:
            return true;
        }
      });
    })
    .map(collection => ({
      ...collection,
      nfts: selectedType === 'all' 
        ? collection.nfts 
        : collection.nfts.filter((nft: any) => {
            const tokenStandard = nft.token_standard?.toLowerCase() || '';
            const collectionName = (nft.collection || collection.collection || '').toLowerCase();
            
            switch (selectedType) {
              case 'ethereum':
                return tokenStandard.includes('erc721') || 
                       tokenStandard.includes('erc1155') ||
                       tokenStandard === 'erc-721' ||
                       tokenStandard === 'erc-1155' ||
                       (!tokenStandard && !collectionName.includes('ens') && !collectionName.includes('poap'));
              case 'ens':
                return tokenStandard.includes('ens') || collectionName.includes('ens');
              case 'poap':
                return tokenStandard.includes('poap') || collectionName.includes('poap');
              case '3dns':
                return tokenStandard.includes('3dns') || collectionName.includes('3dns');
              default:
                return true;
            }
          })
    }))
    .filter(collection => collection.nfts.length > 0);

  console.log('Filtered collections:', filteredCollections);

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
            ? "This wallet doesn't have any NFT collections yet. Collections will appear here once they're detected."
            : `No ${selectedType.toUpperCase()} collections found for this wallet. Try selecting a different category.`
          }
        </p>
        <div className="mt-4 text-xs text-gray-400">
          Total raw collections: {collections.length}
        </div>
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
            collectionName={collection.collection || `Collection ${index + 1}`}
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
