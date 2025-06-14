
import React from 'react';
import { OpenSeaNft } from '@/api/services/openseaService';
import CollectionHeader from './CollectionHeader';
import NftGrid from './NftGrid';
import type { ViewMode } from './NftCollectionsSection';

interface NftCollectionCardProps {
  collectionName: string;
  nfts: OpenSeaNft[];
  onNftClick: (nft: OpenSeaNft) => void;
  viewMode?: ViewMode;
}

const NftCollectionCard: React.FC<NftCollectionCardProps> = ({
  collectionName,
  nfts,
  onNftClick,
  viewMode = 'grid'
}) => {
  const isListView = viewMode === 'list';

  if (!nfts || nfts.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden group ${
      isListView ? 'flex items-center p-4 gap-6' : ''
    }`}>
      <div className={isListView ? 'flex-shrink-0' : 'p-6'}>
        <CollectionHeader
          collectionName={collectionName}
          nftCount={nfts.length}
          isListView={isListView}
        />
      </div>

      <div className={isListView ? 'flex-1' : 'px-6 pb-6'}>
        <NftGrid
          nfts={nfts}
          onNftClick={onNftClick}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
};

export default NftCollectionCard;
