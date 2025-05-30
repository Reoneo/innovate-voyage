
import React from 'react';
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Grid3X3, LayoutGrid, List } from 'lucide-react';
import NftFilterControls from './NftFilterControls';
import CollectionsDropdown from './CollectionsDropdown';
import type { ViewMode } from './NftCollectionsSection';
import { useIsMobile } from '@/hooks/use-mobile';

interface NftDialogHeaderProps {
  totalNfts: number;
  selectedType: 'ethereum' | 'ens' | 'poap' | '3dns' | 'all';
  onTypeChange: (type: 'ethereum' | 'ens' | 'poap' | '3dns' | 'all') => void;
  hasEthereumNfts: boolean;
  hasEnsNfts: boolean;
  hasPoapNfts: boolean;
  has3dnsNfts: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onClose: () => void;
  collections: any[];
  selectedCollection: string | null;
  onCollectionSelect: (collectionName: string | null) => void;
}

const NftDialogHeader: React.FC<NftDialogHeaderProps> = ({
  totalNfts,
  selectedType,
  onTypeChange,
  hasEthereumNfts,
  hasEnsNfts,
  hasPoapNfts,
  has3dnsNfts,
  viewMode,
  onViewModeChange,
  onClose,
  collections,
  selectedCollection,
  onCollectionSelect
}) => {
  const isMobile = useIsMobile();

  const getViewModeIcon = (mode: ViewMode) => {
    switch (mode) {
      case 'grid': return <Grid3X3 size={16} />;
      case 'large-grid': return <LayoutGrid size={16} />;
      case 'list': return <List size={16} />;
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    console.log('Changing view mode to:', mode);
    onViewModeChange(mode);
  };

  return (
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
                    onClick={() => handleViewModeChange(mode)}
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
              onClick={onClose} 
              className="rounded-full h-10 w-10 text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
            >
              <X size={20} />
            </Button>
          </div>
        </div>
        
        {/* Collections Dropdown and Filter Controls */}
        <div className="mt-4 space-y-3">
          {/* Collections Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            <CollectionsDropdown
              collections={collections}
              selectedCollection={selectedCollection}
              onCollectionSelect={onCollectionSelect}
            />
          </div>

          {/* Filter Controls */}
          <NftFilterControls
            selectedType={selectedType}
            onTypeChange={onTypeChange}
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
                onClick={() => handleViewModeChange(mode)}
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
  );
};

export default NftDialogHeader;
