
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import NftCollectionCard from './NftCollectionCard';
import NftFilterControls from './NftFilterControls';
import { OpenSeaNftWithCount } from './NftGrid';
import { Loader2 } from 'lucide-react';

interface NftCollectionsContentProps {
  collections: any[];
  loading: boolean;
  selectedType: 'ethereum' | 'ens' | 'poap' | 'all';
  setSelectedType: (type: 'ethereum' | 'ens' | 'poap' | 'all') => void;
  onNftClick: (nft: OpenSeaNftWithCount) => void;
}

const NftCollectionsContent: React.FC<NftCollectionsContentProps> = ({
  collections,
  loading,
  selectedType,
  setSelectedType,
  onNftClick
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<string>('all');

  // Filter collections by type and network
  const filteredCollections = collections.filter((collection) => {
    if (selectedType !== 'all' && collection.type !== selectedType) {
      return false;
    }
    
    if (selectedNetwork !== 'all' && collection.network !== selectedNetwork) {
      return false;
    }
    
    return true;
  });

  // Get all network options
  const networkOptions = [...new Set(collections.map(c => c.network))].filter(Boolean);

  const getCollectionImage = (collectionName: string) => {
    // Special handling for 3DNS Domains
    if (collectionName.toLowerCase().includes('3dns')) {
      return "https://docs.my.box/~gitbook/image?url=https%3A%2F%2F1581571575-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLNPySatzgHa3v2j4Gmqn%252Fuploads%252F4HNwIbiFFE6Sd7H41SIL%252Fhex_black.png%3Falt%3Dmedia%26token%3D518e3a0f-2c02-484c-ac5b-23b7329f1176&width=376&dpr=2&quality=100&sign=c393b902&sv=2";
    }
    return null;
  };

  const getCollectionDisplayName = (collectionName: string) => {
    // Special handling for 3DNS Domains
    if (collectionName.toLowerCase().includes('3dns')) {
      return "3DNS Domains";
    }
    return collectionName;
  };

  const getNetworkIcon = (network: string) => {
    if (network.toLowerCase().includes('ethereum')) {
      return (
        <img 
          src="https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/256/Ethereum-ETH-icon.png"
          alt="Ethereum"
          className="h-5 w-5 inline-block mr-1"
        />
      );
    } else if (network.toLowerCase().includes('base')) {
      return (
        <img 
          src="https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue-600x600.webp"
          alt="Base"
          className="h-5 w-5 inline-block mr-1"
        />
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <NftFilterControls
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedNetwork={selectedNetwork}
          setSelectedNetwork={setSelectedNetwork}
          networkOptions={networkOptions}
          getNetworkIcon={getNetworkIcon}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Loading NFTs...</span>
        </div>
      ) : filteredCollections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No NFTs found matching the selected filters.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedType('all');
              setSelectedNetwork('all');
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredCollections.map((collection) => (
            <NftCollectionCard
              key={collection.collectionName}
              collectionName={getCollectionDisplayName(collection.collectionName)}
              nfts={collection.nfts}
              onNftClick={onNftClick}
              customImage={getCollectionImage(collection.collectionName)}
              network={collection.network}
              getNetworkIcon={getNetworkIcon}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NftCollectionsContent;
