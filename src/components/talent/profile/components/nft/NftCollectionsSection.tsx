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
      console.log('Loading NFTs for wallet:', walletAddress);
      try {
        const nftCollections = await fetchUserNfts(walletAddress);
        console.log('Fetched NFT collections:', nftCollections);
        
        // More lenient filtering - keep more collections
        const filteredCollections = nftCollections.filter(collection => {
          const hasValidNfts = collection.nfts && collection.nfts.length > 0;
          const collectionName = collection.collection || '';
          const isNotTestCollection = !collectionName.toLowerCase().includes('test');
          
          console.log('Collection check:', collectionName, 'hasValidNfts:', hasValidNfts, 'isNotTestCollection:', isNotTestCollection);
          return hasValidNfts && isNotTestCollection;
        });
        
        console.log('Filtered collections:', filteredCollections);
        setCollections(filteredCollections);
      } catch (error) {
        console.error('Error loading NFTs:', error);
        setCollections([]);
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
  };

  // Check what types of NFTs are available with more flexible matching
  const hasEthereumNfts = collections.some(c => 
    c.nfts.some((nft: any) => {
      const tokenStandard = nft.token_standard?.toLowerCase() || '';
      const collectionName = (nft.collection || c.collection || '').toLowerCase();
      return tokenStandard.includes('erc721') || 
             tokenStandard.includes('erc1155') ||
             tokenStandard === 'erc-721' ||
             tokenStandard === 'erc-1155' ||
             (!tokenStandard && !collectionName.includes('ens') && !collectionName.includes('poap'));
    })
  );
  
  const hasEnsNfts = collections.some(c => 
    c.nfts.some((nft: any) => {
      const tokenStandard = nft.token_standard?.toLowerCase() || '';
      const collectionName = (nft.collection || c.collection || '').toLowerCase();
      return tokenStandard.includes('ens') || collectionName.includes('ens');
    })
  );
  
  const hasPoapNfts = collections.some(c => 
    c.nfts.some((nft: any) => {
      const tokenStandard = nft.token_standard?.toLowerCase() || '';
      const collectionName = (nft.collection || c.collection || '').toLowerCase();
      return tokenStandard.includes('poap') || collectionName.includes('poap');
    })
  );
  
  const has3dnsNfts = collections.some(c => 
    c.nfts.some((nft: any) => {
      const tokenStandard = nft.token_standard?.toLowerCase() || '';
      const collectionName = (nft.collection || c.collection || '').toLowerCase();
      return tokenStandard.includes('3dns') || collectionName.includes('3dns');
    })
  );

  // Filter collections based on selected collection
  const filteredCollections = selectedCollection
    ? collections.filter(collection => collection.collection === selectedCollection)
    : collections;

  // Get total NFT count from filtered collections
  const totalNfts = filteredCollections.reduce((total, collection) => total + collection.nfts.length, 0);

  console.log('NFT Section state:', {
    walletAddress,
    collectionsCount: collections.length,
    totalNfts,
    hasEthereumNfts,
    hasEnsNfts,
    hasPoapNfts,
    has3dnsNfts,
    selectedType,
    loading
  });

  return (
    <>
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
    </>
  );
};
