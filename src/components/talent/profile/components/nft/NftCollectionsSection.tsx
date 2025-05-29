
import React, { useEffect, useState } from 'react';
import { fetchUserNfts, type OpenSeaNft } from '@/api/services/openseaService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Grid3X3, Palette, Award, Hexagon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NftDetailsDialog from './NftDetailsDialog';
import NftCollectionsContent from './NftCollectionsContent';
import NftFilterControls from './NftFilterControls';

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
  const [selectedType, setSelectedType] = useState<'ethereum' | 'ens' | 'poap' | '3dns' | 'all'>('all');
  const [selectedNft, setSelectedNft] = useState<OpenSeaNft | null>(null);

  useEffect(() => {
    if (!walletAddress) return;
    const loadNfts = async () => {
      setLoading(true);
      try {
        const nftCollections = await fetchUserNfts(walletAddress);
        setCollections(nftCollections);
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

  // Get total NFT count
  const totalNfts = collections.reduce((total, collection) => total + collection.nfts.length, 0);

  return <>
      <Dialog open={showCollections} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-50 to-white text-gray-800 border-0 shadow-2xl rounded-2xl">
          {/* Enhanced Header */}
          <div className="sticky top-0 z-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 -m-6 mb-0 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-white">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Grid3X3 size={24} />
                    </div>
                    NFT Collections
                    {totalNfts > 0 && (
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                        {totalNfts} items
                      </span>
                    )}
                  </DialogTitle>
                </DialogHeader>
                <div className="hidden md:block">
                  <NftFilterControls
                    selectedType={selectedType}
                    onTypeChange={setSelectedType}
                    hasEthereumNfts={hasEthereumNfts}
                    hasEnsNfts={hasEnsNfts}
                    hasPoapNfts={hasPoapNfts}
                    has3dnsNfts={has3dnsNfts}
                  />
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onOpenChange?.(false)} 
                className="rounded-full h-10 w-10 text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
              >
                <X size={20} />
              </Button>
            </div>
            
            {/* Mobile filter controls */}
            <div className="md:hidden mt-4">
              <NftFilterControls
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                hasEthereumNfts={hasEthereumNfts}
                hasEnsNfts={hasEnsNfts}
                hasPoapNfts={hasPoapNfts}
                has3dnsNfts={has3dnsNfts}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 pt-4">
            <NftCollectionsContent 
              collections={collections} 
              loading={loading} 
              selectedType={selectedType} 
              onNftClick={handleNftClick} 
            />
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
