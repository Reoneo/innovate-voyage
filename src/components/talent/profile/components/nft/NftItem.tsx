
import React, { useState } from 'react';
import NftDetailsDialog from './NftDetailsDialog';

interface NftItemProps {
  id: string;
  name?: string;
  imageUrl?: string;
  collectionName?: string;
  description?: string;
  permalink?: string;
  traits?: Array<{ trait_type: string; value: string }>;
  collectionSlug?: string;
  chainId?: number;
  baseLogoUrl?: string;
}

const NftItem: React.FC<NftItemProps> = ({
  id,
  name = 'Unnamed NFT',
  imageUrl,
  collectionName = 'Unknown Collection',
  description,
  permalink,
  traits = [],
  chainId,
  baseLogoUrl
}) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const isBaseChain = chainId === 8453;

  return (
    <>
      <div 
        className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all"
        onClick={() => setDetailOpen(true)}
      >
        <div className="relative h-40 bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/e5e7eb/a1a1aa?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          {isBaseChain && baseLogoUrl && (
            <div className="absolute top-2 right-2 h-6 w-6 bg-white rounded-full p-0.5 shadow">
              <img src={baseLogoUrl} alt="Base Network" className="w-full h-full" />
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm truncate">{name}</h3>
          <p className="text-xs text-muted-foreground truncate">{collectionName}</p>
        </div>
      </div>
      
      <NftDetailsDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        nft={{
          id,
          name,
          imageUrl,
          collectionName,
          description: description || '',
          permalink: permalink || '',
          traits: traits || []
        }}
      />
    </>
  );
};

export default NftItem;
