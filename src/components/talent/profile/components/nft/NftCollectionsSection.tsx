
import React, { useEffect, useState, useCallback } from 'react';
import { fetchUserNfts, type OpenSeaNft } from '@/api/services/openseaService';
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NftDetailsDialog from './NftDetailsDialog';
import NftCollectionsContent from './NftCollectionsContent';

interface NftCollectionsSectionProps {
  walletAddress?: string;
  showCollections?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const NftCollectionsSection: React.FC<NftCollectionsSectionProps> = ({ 
  walletAddress, 
  showCollections = false,
  onOpenChange
}) => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'ethereum' | 'ens' | 'poap' | 'all'>('all');
  const [selectedNft, setSelectedNft] = useState<OpenSeaNft | null>(null);

  // Memoize the NFT click handler
  const handleNftClick = useCallback((nft: OpenSeaNft) => {
    setSelectedNft(nft);
  }, []);

  // Memoize the profile click handler
  const handleOpenProfile = useCallback((name: string) => {
    if (onOpenChange) {
      onOpenChange(false);
    }
    // Navigate to the profile - this will be handled by the parent component
    window.location.href = `/${name.toLowerCase()}/`;
  }, [onOpenChange]);

  useEffect(() => {
    if (!walletAddress || !showCollections) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    const loadNfts = async () => {
      setLoading(true);
      try {
        const nftCollections = await fetchUserNfts(walletAddress, { signal });
        setCollections(nftCollections);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('Error loading NFTs:', error);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadNfts();

    return () => {
      abortController.abort();
    };
  }, [walletAddress, showCollections]);

  if (!walletAddress) return null;

  return (
    <>
      <Dialog open={showCollections} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto bg-gradient-to-b from-blue-950 to-blue-900 text-white border-blue-800 p-6 shadow-xl shadow-blue-900/20">
          <div className="sticky top-0 z-10 flex justify-between items-center pb-4 border-b border-blue-800 bg-gradient-to-b from-blue-950 to-blue-950/95">
            <DialogHeader>
              <h2 className="text-lg font-semibold text-white">
                {selectedType === 'all' ? 'All Collections' : 
                 selectedType === 'ethereum' ? 'NFT Collections' :
                 selectedType === 'ens' ? 'ENS Collection' : 'POAP Collection'}
              </h2>
            </DialogHeader>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange?.(false)}
              className="rounded-full h-8 w-8 text-blue-300 hover:text-white hover:bg-blue-800"
            >
              <X size={18} />
            </Button>
          </div>

          <div className="pt-4">
            <NftCollectionsContent 
              collections={collections}
              loading={loading}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              onNftClick={handleNftClick}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* NFT Details Dialog */}
      {selectedNft && (
        <NftDetailsDialog 
          nft={selectedNft} 
          onClose={() => setSelectedNft(null)} 
          onOpenProfile={handleOpenProfile}
        />
      )}
    </>
  );
};
