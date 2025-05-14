
import React, { useEffect, useState } from 'react';
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
  const [selectedType, setSelectedType] = useState<'ethereum' | 'ens' | 'poap' | 'base' | '3dns' | 'all'>('all');
  const [selectedNft, setSelectedNft] = useState<OpenSeaNft | null>(null);

  useEffect(() => {
    if (!walletAddress) return;

    const loadNfts = async () => {
      setLoading(true);
      try {
        const nftCollections = await fetchUserNfts(walletAddress);
        
        // Check if we already have a Base collection
        const hasBaseCollection = nftCollections.some(c => c.type === 'base');
        
        // If we don't have a Base collection, add a sample one
        if (!hasBaseCollection) {
          // Sample Base NFT collection
          const baseCollection = {
            name: 'Base NFTs',
            type: 'base',
            nfts: [
              {
                id: 'base-1',
                name: 'Base Genesis',
                description: 'First NFT on Base network',
                image_url: 'https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue.png',
                permalink: 'https://opensea.io/assets/base/sample',
                collection: {
                  name: 'Base NFTs',
                  slug: 'base-nfts'
                }
              }
            ]
          };
          
          nftCollections.push(baseCollection);
        }
        
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

  // Handle NFT click to show details
  const handleNftClick = (nft: OpenSeaNft) => {
    setSelectedNft(nft);
  };

  // Handle profile click from NFT details
  const handleOpenProfile = (name: string) => {
    if (onOpenChange) {
      onOpenChange(false);
    }
    // Navigate to the profile - this will be handled by the parent component
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
                 selectedType === 'ens' ? 'ENS Collection' : 
                 selectedType === 'base' ? 'Base Collection' :
                 selectedType === '3dns' ? '3DNS Collection' : 'POAP Collection'}
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
