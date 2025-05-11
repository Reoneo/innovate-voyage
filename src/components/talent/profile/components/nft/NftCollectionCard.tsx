
import React from 'react';
import { OpenSeaNft } from '@/api/services/openseaService';
import CollectionHeader from './CollectionHeader';
import NftGrid from './NftGrid';

interface NftCollectionCardProps {
  collectionName: string;
  nfts: OpenSeaNft[];
  onNftClick: (nft: OpenSeaNft) => void;
}

const NftCollectionCard: React.FC<NftCollectionCardProps> = ({ 
  collectionName, 
  nfts,
  onNftClick 
}) => {
  // Special handling for 3DNS Domains collection
  const is3DnsCollection = collectionName.toLowerCase().includes('3dns') || 
                          collectionName.toLowerCase().includes('powered domains');

  return (
    <div key={collectionName} className="space-y-3">
      {is3DnsCollection ? (
        <div className="flex items-center gap-3 mb-4">
          <img 
            src="https://docs.my.box/~gitbook/image?url=https%3A%2F%2F1581571575-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLNPySatzgHa3v2j4Gmqn%252Fuploads%252F4HNwIbiFFE6Sd7H41SIL%252Fhex_black.png%3Falt%3Dmedia%26token%3D518e3a0f-2c02-484c-ac5b-23b7329f1176&width=376&dpr=2&quality=100&sign=c393b902&sv=2"
            alt="3DNS Domains"
            className="h-8 w-8 rounded"
          />
          <h3 className="text-lg font-medium">3DNS Domains</h3>
        </div>
      ) : (
        <CollectionHeader collectionName={collectionName} />
      )}
      <NftGrid nfts={nfts} onNftClick={onNftClick} />
    </div>
  );
};

export default NftCollectionCard;
