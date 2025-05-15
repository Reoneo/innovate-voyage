
import React, { useState, useMemo } from 'react';
import CollectionHeader from './CollectionHeader';
import NftGrid from './NftGrid';
import NftFilterControls from './NftFilterControls';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OpenSeaCollection, OpenSeaNft } from './NftCollectionsSection';

interface NftCollectionsContentProps {
  collections: OpenSeaCollection[];
  loading: boolean;
  baseLogoUrl: string;
  processNftForDisplay: (nft: any) => OpenSeaNft;
}

const NftCollectionsContent: React.FC<NftCollectionsContentProps> = ({
  collections,
  loading,
  baseLogoUrl,
  processNftForDisplay
}) => {
  const [filterValue, setFilterValue] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('collection');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  // Process collections for display
  const processedCollections = useMemo(() => {
    if (!collections) return [];
    
    return collections.map(collection => {
      // Process NFTs if they exist
      const processedNfts = collection.nfts 
        ? collection.nfts.map(processNftForDisplay) 
        : [];
        
      return {
        ...collection,
        nfts: processedNfts
      };
    });
  }, [collections, processNftForDisplay]);
  
  // Filter collections based on user input
  const filteredCollections = useMemo(() => {
    if (!filterValue) return processedCollections;
    
    const lowercaseFilter = filterValue.toLowerCase();
    return processedCollections.filter(collection => 
      collection.name.toLowerCase().includes(lowercaseFilter)
    );
  }, [processedCollections, filterValue]);
  
  // Get the currently selected collection
  const activeCollection = useMemo(() => {
    if (!selectedCollection) return null;
    return processedCollections.find(c => c.slug === selectedCollection) || null;
  }, [selectedCollection, processedCollections]);
  
  // All NFTs across all collections
  const allNfts = useMemo(() => {
    return processedCollections
      .flatMap(collection => 
        (collection.nfts || []).map(nft => ({
          ...nft,
          collectionSlug: collection.slug,
          chainId: collection.chainId
        }))
      );
  }, [processedCollections]);
  
  // Handle collection selection
  const handleCollectionSelect = (slug: string) => {
    setSelectedCollection(prev => prev === slug ? null : slug);
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <h2 className="text-xl font-bold mb-6">NFT Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-6">NFT Collections</h2>
        <div className="py-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No NFT collections found for this wallet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">NFT Collections</h2>
      <p className="text-muted-foreground mb-6">Explore NFT collections owned by this wallet</p>

      <NftFilterControls 
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />
      
      <Tabs defaultValue="collections" className="mt-6">
        <TabsList>
          <TabsTrigger value="collections">Collections ({filteredCollections.length})</TabsTrigger>
          <TabsTrigger value="all">All NFTs ({allNfts.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="collections" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCollections.map((collection) => (
              <CollectionHeader
                key={collection.slug}
                name={collection.name}
                imageUrl={collection.image_url}
                floorPrice={collection.floorPrice || collection.stats?.floor_price}
                totalSupply={collection.stats?.total_supply}
                description={collection.description}
                selected={selectedCollection === collection.slug}
                onClick={() => handleCollectionSelect(collection.slug)}
                chainId={collection.chainId}
                baseLogoUrl={baseLogoUrl}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="mt-4">
          <NftGrid 
            nfts={allNfts} 
            baseLogoUrl={baseLogoUrl}
          />
        </TabsContent>
      </Tabs>
      
      {activeCollection && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{activeCollection.name} NFTs</h3>
            <button 
              className="text-sm text-muted-foreground hover:text-primary"
              onClick={() => setSelectedCollection(null)}
            >
              Close
            </button>
          </div>
          <NftGrid 
            nfts={(activeCollection.nfts || []).map(nft => ({
              ...nft,
              collectionSlug: activeCollection.slug,
              chainId: activeCollection.chainId
            }))}
            baseLogoUrl={baseLogoUrl}
          />
        </div>
      )}
    </div>
  );
};

export default NftCollectionsContent;
