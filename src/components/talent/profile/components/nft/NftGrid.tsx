
import React from 'react';
import NftItem from './NftItem';

interface NftGridProps {
  nfts: Array<{
    id: string;
    name?: string;
    imageUrl?: string;
    collectionName?: string;
    description?: string;
    permalink?: string;
    traits?: Array<{ trait_type: string; value: string }>;
    collectionSlug?: string;
    chainId?: number;
  }>;
  baseLogoUrl?: string;
}

const NftGrid: React.FC<NftGridProps> = ({ nfts, baseLogoUrl }) => {
  if (!nfts || nfts.length === 0) {
    return (
      <div className="py-12 text-center border border-dashed rounded-lg">
        <p className="text-muted-foreground">No NFTs found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {nfts.map((nft) => (
        <NftItem
          key={nft.id}
          id={nft.id}
          name={nft.name}
          imageUrl={nft.imageUrl}
          collectionName={nft.collectionName}
          description={nft.description}
          permalink={nft.permalink}
          traits={nft.traits}
          collectionSlug={nft.collectionSlug}
          chainId={nft.chainId}
          baseLogoUrl={baseLogoUrl}
        />
      ))}
    </div>
  );
};

export default NftGrid;
