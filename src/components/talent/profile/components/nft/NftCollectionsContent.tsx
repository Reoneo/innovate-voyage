
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import NftCollectionCard from './NftCollectionCard';
import NftFilterControls from './NftFilterControls';
import { OpenSeaNft } from '@/api/services/openseaService';

interface OpenSeaCollection {
  name: string;
  nfts: OpenSeaNft[];
  type: 'ethereum' | 'ens' | 'poap' | '3dns';
}

interface NftCollectionsContentProps {
  collections: OpenSeaCollection[];
  loading: boolean;
  selectedType: 'ethereum' | 'ens' | 'poap' | '3dns' | 'all';
  setSelectedType: (type: 'ethereum' | 'ens' | 'poap' | '3dns' | 'all') => void;
  onNftClick: (nft: OpenSeaNft) => void;
}

const NftCollectionsContent: React.FC<NftCollectionsContentProps> = ({
  collections,
  loading,
  selectedType,
  setSelectedType,
  onNftClick
}) => {
  // Filter out POAP v2 collections
  const filteredAllCollections = collections.filter(collection => 
    !collection.name.toLowerCase().includes('poap v2')
  );
  
  const hasEthereumNfts = filteredAllCollections.some(c => c.type === 'ethereum');
  const hasEnsNfts = filteredAllCollections.some(c => c.type === 'ens');
  const hasPoapNfts = filteredAllCollections.some(c => c.type === 'poap');
  const has3dnsNfts = filteredAllCollections.some(c => c.type === '3dns');

  const filteredCollections = selectedType === 'all' 
    ? filteredAllCollections 
    : filteredAllCollections.filter(collection => collection.type === selectedType);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-40 w-full bg-gray-100" />
        <Skeleton className="h-40 w-full bg-gray-100" />
      </div>
    );
  }

  return (
    <>
      <NftFilterControls 
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        hasEthereumNfts={hasEthereumNfts}
        hasEnsNfts={hasEnsNfts}
        hasPoapNfts={hasPoapNfts}
        has3dnsNfts={has3dnsNfts}
      />
      
      {filteredCollections.length > 0 ? (
        <div className="space-y-10 pt-4">
          {filteredCollections.map((collection) => (
            <NftCollectionCard
              key={collection.name}
              collectionName={collection.name}
              nfts={collection.nfts}
              onNftClick={onNftClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-8">
          <p className="text-muted-foreground">No NFTs found for this category</p>
        </div>
      )}
    </>
  );
};

export default NftCollectionsContent;
