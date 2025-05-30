
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
          !collection.name.toLowerCase().includes('poap v2')
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

  const handleOpenProfile = (name: string) => {
    if (onOpenChange) {
      onOpenChange(false);
    }
    window.location.href = `/${name.toLowerCase()}/`;
  };

  // Check what types of NFTs are available
  const hasEthereumNfts = collections.some(c => c.nfts.some((nft: any) => nft.type === 'ethereum'));
  const hasEnsNfts = collections.some(c => c.nfts.some((nft: any) => nft.type === 'ens'));
  const hasPoapNfts = collections.some(c => c.nfts.some((nft: any) => nft.type === 'poap'));
  const has3dnsNfts = collections.some(c => c.nfts.some((nft: any) => nft.type === '3dns'));

  // Filter collections based on selected collection
  const filteredCollections = selectedCollection 
    ? collections.filter(collection => collection.name === selectedCollection)
    : collections;

  // Get total NFT count from filtered collections
  const totalNfts = filteredCollections.reduce((total, collection) => total + collection.nfts.length, 0);

  return <>
      <Dialog open={showCollections} onOpenChange={onOpenChange}>
        <DialogContent className={`${isMobile ? 'max-w-[95vw] h-[95vh] m-2' : 'max-w-4xl w-[90vw] h-[80vh]'} flex flex-col bg-white text-gray-900 border-0 shadow-2xl rounded-2xl p-0 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
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

      {/* Enhanced NFT Details Dialog */}
      {selectedNft && (
        <NftDetailsDialog 
          nft={selectedNft} 
          onClose={() => setSelectedNft(null)} 
          onOpenProfile={handleOpenProfile} 
        />
      )}
    </>;
};
