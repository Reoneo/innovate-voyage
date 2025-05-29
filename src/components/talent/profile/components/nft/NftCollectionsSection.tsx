
import React, { useEffect, useState } from 'react';
import { fetchUserNfts, type OpenSeaNft } from '@/api/services/openseaService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Grid3X3, LayoutGrid, List } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NftDetailsDialog from './NftDetailsDialog';
import NftCollectionsContent from './NftCollectionsContent';
import NftFilterControls from './NftFilterControls';
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

  // Get total NFT count
  const totalNfts = collections.reduce((total, collection) => total + collection.nfts.length, 0);

  const getViewModeIcon = (mode: ViewMode) => {
    switch (mode) {
      case 'grid': return <Grid3X3 size={16} />;
      case 'large-grid': return <LayoutGrid size={16} />;
      case 'list': return <List size={16} />;
    }
  };

  return <>
      <Dialog open={showCollections} onOpenChange={onOpenChange}>
        <DialogContent className={`${isMobile ? 'max-w-[95vw] h-[95vh] m-2' : 'max-w-7xl h-[90vh]'} flex flex-col bg-white text-gray-900 border-0 shadow-2xl rounded-2xl p-0`}>
          {/* Professional Header with OpenSea icon */}
          <div className="flex-shrink-0 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white">
            <div className={`${isMobile ? 'p-4' : 'p-6'} border-b border-white/10`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <DialogHeader>
                    <DialogTitle className={`flex items-center gap-3 ${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-white`}>
                      <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                        <img 
                          src="https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png" 
                          alt="OpenSea" 
                          className="w-6 h-6"
                        />
                      </div>
                      NFT Collections
                      {totalNfts > 0 && (
                        <span className={`bg-white/15 px-3 py-1 rounded-full ${isMobile ? 'text-xs' : 'text-sm'} font-medium backdrop-blur-sm border border-white/20`}>
                          {totalNfts} items
                        </span>
                      )}
                    </DialogTitle>
                  </DialogHeader>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* View Mode Controls - Hide on mobile for space */}
                  {!isMobile && (
                    <div className="flex bg-white/10 rounded-lg p-1 backdrop-blur-sm">
                      {(['grid', 'large-grid', 'list'] as ViewMode[]).map((mode) => (
                        <Button
                          key={mode}
                          variant={viewMode === mode ? 'secondary' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode(mode)}
                          className={`px-3 py-1.5 rounded-md transition-all ${
                            viewMode === mode 
                              ? 'bg-white text-gray-900 shadow-sm' 
                              : 'text-white/80 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {getViewModeIcon(mode)}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onOpenChange?.(false)} 
                    className="rounded-full h-10 w-10 text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
                  >
                    <X size={20} />
                  </Button>
                </div>
              </div>
              
              {/* Filter Controls */}
              <div className="mt-4">
                <NftFilterControls
                  selectedType={selectedType}
                  onTypeChange={setSelectedType}
                  hasEthereumNfts={hasEthereumNfts}
                  hasEnsNfts={hasEnsNfts}
                  hasPoapNfts={hasPoapNfts}
                  has3dnsNfts={has3dnsNfts}
                />
              </div>

              {/* Mobile View Mode Controls */}
              {isMobile && (
                <div className="mt-3 flex bg-white/10 rounded-lg p-1 backdrop-blur-sm w-fit">
                  {(['grid', 'list'] as ViewMode[]).map((mode) => (
                    <Button
                      key={mode}
                      variant={viewMode === mode ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode(mode)}
                      className={`px-3 py-1.5 rounded-md transition-all ${
                        viewMode === mode 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {getViewModeIcon(mode)}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content Area - Made scrollable */}
          <div className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
            <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <NftCollectionsContent 
                collections={collections} 
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
