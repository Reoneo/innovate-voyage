
import React, { useEffect, useState } from 'react';
import { fetchUserNfts, type OpenSeaNft } from '@/api/services/openseaService';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import NftDetailsDialog from './NftDetailsDialog';
import NftCollectionsContent from './NftCollectionsContent';
import NftDialogHeader from './NftDialogHeader';
import { useIsMobile } from '@/hooks/use-mobile';

interface NftCollectionsSectionProps {
  walletAddress?: string;
  showCollections?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export type ViewMode = 'grid' | 'large-grid' | 'list';

export const NftCollectionsSection: React.FC<NftCollectionsSectionProps> = ({
  walletAddress,
  showCollections = false,
  onOpenChange
}) => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'ethereum' | 'ens' | 'poap' | '3dns' | 'all'>('all');
  const [selectedNft, setSelectedNft] = useState<OpenSeaNft | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!walletAddress) return;
    const loadNfts = async () => {
      setLoading(true);
      try {
        const nftCollections = await fetchUserNfts(walletAddress);
        // Filter out poapv2 collections as requested
        const filteredCollections = nftCollections.filter(collection =>
          !collection.collection.toLowerCase().includes('poap v2')
        );
        setCollections(filteredCollections);
      } catch (error) {
        console.error('Error loading NFTs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadNfts();
  }, [walletAddress]);

  if (!walletAddress) return null;

  const handleNftClick = (nft: OpenSeaNft) => {
    setSelectedNft(nft);
  };

  const handleOpenProfile = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
    // Owner viewing not supported by returned OpenSeaNft type.
  };

  // Check what types of NFTs are available
  const hasEthereumNfts = collections.some(c => c.nfts.some((nft: any) => nft.token_standard === 'erc721' || nft.token_standard === 'erc1155'));
  const hasEnsNfts = collections.some(c => c.nfts.some((nft: any) => nft.token_standard === 'ens'));
  const hasPoapNfts = collections.some(c => c.nfts.some((nft: any) => nft.token_standard === 'poap'));
  const has3dnsNfts = collections.some(c => c.nfts.some((nft: any) => nft.token_standard === '3dns'));

  // Filter collections based on selected collection
  const filteredCollections = selectedCollection
    ? collections.filter(collection => collection.collection === selectedCollection)
    : collections;

  // Get total NFT count from filtered collections
  const totalNfts = filteredCollections.reduce((total, collection) => total + collection.nfts.length, 0);

  return <>
      <Dialog open={showCollections} onOpenChange={onOpenChange}>
        <DialogContent className={`${isMobile ? 'w-screen h-screen max-w-none m-0 rounded-none' : 'max-w-7xl w-[95vw] h-[95vh] max-h-none'} flex flex-col bg-white text-gray-900 border-0 shadow-2xl p-0`}>
          <NftDialogHeader
            totalNfts={totalNfts}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            hasEthereumNfts={hasEthereumNfts}
            hasEnsNfts={hasEnsNfts}
            hasPoapNfts={hasPoapNfts}
            has3dnsNfts={has3dnsNfts}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onClose={() => onOpenChange?.(false)}
            collections={collections}
            selectedCollection={selectedCollection}
            onCollectionSelect={setSelectedCollection}
          />

          {/* Content Area - Made scrollable */}
          <div className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
            <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <NftCollectionsContent
                collections={filteredCollections}
                loading={loading}
                selectedType={selectedType}
                onNftClick={handleNftClick}
                viewMode={isMobile ? 'grid' : viewMode}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* NFT Details Dialog */}
      {selectedNft && (
        <NftDetailsDialog
          nft={selectedNft}
          onClose={() => setSelectedNft(null)}
        />
      )}
    </>;
};
