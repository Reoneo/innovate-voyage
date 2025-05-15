
import React, { useState, useCallback, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import NftCollectionCard from './NftCollectionCard';
import NftFilterControls from './NftFilterControls';
import { type OpenSeaNft } from '@/api/services/openseaService';

interface NftCollectionsContentProps {
  collections: any[];
  loading: boolean;
  selectedType: 'ethereum' | 'ens' | 'poap' | 'base' | 'all';
  setSelectedType: React.Dispatch<React.SetStateAction<'ethereum' | 'ens' | 'poap' | 'base' | 'all'>>;
  onNftClick: (nft: OpenSeaNft) => void;
}

const NftCollectionsContent: React.FC<NftCollectionsContentProps> = ({
  collections,
  loading,
  selectedType,
  setSelectedType,
  onNftClick
}) => {
  const [filterValue, setFilterValue] = useState('');
  const [sortOption, setSortOption] = useState('name');
  
  const filteredCollections = useMemo(() => {
    if (!collections.length) return [];
    
    // First, filter by type
    let filtered = collections;
    if (selectedType !== 'all') {
      filtered = collections.filter(c => c.type === selectedType);
    }
    
    // Then, filter by search value if provided
    if (filterValue) {
      const lowercaseFilter = filterValue.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(lowercaseFilter) ||
        c.nfts.some((nft: any) => 
          nft.name?.toLowerCase().includes(lowercaseFilter) ||
          nft.description?.toLowerCase().includes(lowercaseFilter)
        )
      );
    }
    
    // Finally, sort the results
    return filtered.sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'count') {
        return b.nfts.length - a.nfts.length;
      } else if (sortOption === 'recent') {
        // Assuming we have a lastAcquired property
        const aDate = a.lastAcquired || '0';
        const bDate = b.lastAcquired || '0';
        return bDate.localeCompare(aDate);
      }
      return 0;
    });
  }, [collections, selectedType, filterValue, sortOption]);
  
  const renderNoCollections = useCallback(() => {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 opacity-60">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/3474/3474360.png" 
            alt="No NFTs" 
            className="w-20 h-20 mx-auto opacity-50"
          />
        </div>
        <h3 className="text-lg font-medium text-gray-700">No NFT collections found</h3>
        <p className="text-sm text-gray-500 max-w-sm mt-2">
          {selectedType !== 'all' 
            ? `No ${selectedType === 'ethereum' ? 'Ethereum' : selectedType === 'ens' ? 'ENS' : selectedType === 'base' ? 'Base' : 'POAP'} NFTs found for this wallet.`
            : "No NFTs found for this wallet address."
          }
        </p>
      </div>
    );
  }, [selectedType]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Tabs defaultValue={selectedType} onValueChange={(v) => setSelectedType(v as any)} className="w-full sm:w-auto">
          <TabsList className="w-full sm:w-auto grid grid-cols-5 h-9">
            <TabsTrigger value="all" className="text-xs px-1">All</TabsTrigger>
            <TabsTrigger value="ethereum" className="text-xs px-1">Ethereum</TabsTrigger>
            <TabsTrigger value="ens" className="text-xs px-1">ENS</TabsTrigger>
            <TabsTrigger value="base" className="text-xs px-1">
              <div className="flex items-center space-x-1">
                <img 
                  src="https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue.png" 
                  alt="Base" 
                  className="h-4 w-4" 
                />
                <span>Base</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="poap" className="text-xs px-1">POAP</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <NftFilterControls 
          filterValue={filterValue}
          onFilterChange={setFilterValue}
          sortOption={sortOption}
          onSortChange={setSortOption}
        />
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-8 w-1/2" />
              <div className="grid grid-cols-3 gap-2">
                <Skeleton className="h-24 w-full rounded-md" />
                <Skeleton className="h-24 w-full rounded-md" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredCollections.length === 0 ? (
        renderNoCollections()
      ) : (
        <TabsContent value={selectedType} forceMount className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCollections.map((collection, i) => (
              <NftCollectionCard
                key={`${collection.name}-${i}`}
                collection={collection}
                onNftClick={onNftClick}
              />
            ))}
          </div>
        </TabsContent>
      )}
    </div>
  );
};

export default NftCollectionsContent;
