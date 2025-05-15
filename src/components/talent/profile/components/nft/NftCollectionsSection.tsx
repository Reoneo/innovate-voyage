
import React, { useEffect, useState } from 'react';
import { fetchUserNfts, type OpenSeaNft } from '@/api/services/openseaService';
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NftDetailsDialog from './NftDetailsDialog';
import NftCollectionsContent from './NftCollectionsContent';

interface OpenSeaCollection {
  name: string;
  nfts: OpenSeaNft[];
  type: 'ethereum' | 'ens' | 'poap' | '3dns' | 'base';
}

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
  const [collections, setCollections] = useState<OpenSeaCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'ethereum' | 'ens' | 'poap' | '3dns' | 'base' | 'all'>('all');
  const [selectedNft, setSelectedNft] = useState<OpenSeaNft | null>(null);

  useEffect(() => {
    if (!walletAddress) return;

    const loadNfts = async () => {
      setLoading(true);
      try {
        const nftData = await fetchUserNfts(walletAddress);
        
        // Process and organize collections
        const processedCollections: OpenSeaCollection[] = [];
        
        // Add Base NFTs as a new collection type
        const baseNfts = nftData
          .filter(nft => nft.collectionName?.toLowerCase().includes('base'))
          .map(nft => ({...nft}));
          
        if (baseNfts.length > 0) {
          processedCollections.push({
            name: 'Base NFTs',
            nfts: baseNfts,
            type: 'base'
          });
        }
        
        // Process remaining collections as before
        nftData.forEach(nft => {
          let collectionType: 'ethereum' | 'ens' | 'poap' | '3dns' | 'base' = 'ethereum';
          let collectionName = nft.collectionName || 'Unknown Collection';
          
          if (nft.collectionName?.toLowerCase().includes('ens')) {
            collectionType = 'ens';
          } else if (nft.collectionName?.toLowerCase().includes('poap')) {
            collectionType = 'poap';
          } else if (nft.collectionName?.toLowerCase().includes('3dns')) {
            collectionType = '3dns';
          } else if (nft.collectionName?.toLowerCase().includes('base')) {
            // Skip Base NFTs as we already processed them
            return;
          }
          
          // Find existing collection or create new one
          let existingCollection = processedCollections.find(c => 
            c.type === collectionType && c.name === collectionName
          );
          
          if (existingCollection) {
            existingCollection.nfts.push(nft);
          } else {
            processedCollections.push({
              name: collectionName,
              nfts: [nft],
              type: collectionType
            });
          }
        });
        
        setCollections(processedCollections);
      } catch (error) {
        console.error('Error loading NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNfts();
  }, [walletAddress]);

  if (!walletAddress) return null;

  // Handle NFT click to show details
  const handleNftClick = (nft: OpenSeaNft) => {
    setSelectedNft(nft);
  };

  // Handle profile click from NFT details
  const handleOpenProfile = (name: string) => {
    if (onOpenChange) {
      onOpenChange(false);
    }
    // Navigate to the profile
    window.location.href = `/${name.toLowerCase()}/`;
  };

  return (
    <>
      <Dialog open={showCollections} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto bg-white text-gray-800 border border-gray-200 p-6 shadow-lg">
          <div className="sticky top-0 z-10 flex justify-between items-center pb-4 border-b border-gray-200 bg-white">
            <DialogHeader>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedType === 'all' ? 'All Collections' : 
                 selectedType === 'ethereum' ? 'NFT Collections' :
                 selectedType === 'base' ? 'Base NFTs' :
                 selectedType === 'ens' ? 'ENS Collection' :
                 selectedType === 'poap' ? 'POAP Collection' : '3DNS Collection'}
              </h2>
            </DialogHeader>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange?.(false)}
              className="rounded-full h-8 w-8 text-gray-500 hover:text-gray-800 hover:bg-gray-100"
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
