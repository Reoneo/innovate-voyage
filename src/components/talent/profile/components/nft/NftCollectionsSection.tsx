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

// Define collection type
type CollectionType = 'ethereum' | 'ens' | 'poap' | '3dns' | 'base' | 'all';

export const NftCollectionsSection: React.FC<NftCollectionsSectionProps> = ({ 
  walletAddress, 
  showCollections = false,
  onOpenChange
}) => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<CollectionType>('all');
  const [selectedNft, setSelectedNft] = useState<OpenSeaNft | null>(null);

  useEffect(() => {
    if (!walletAddress) return;

    const loadNfts = async () => {
      setLoading(true);
      try {
        const nftCollections = await fetchUserNfts(walletAddress);
        
        // Add an advertisement NFT at the end
        const hasXBoxAdNft = nftCollections.some(collection => 
          collection.name === '3DNS Domains' && 
          collection.nfts.some(nft => nft.name === 'x.box')
        );
        
        if (!hasXBoxAdNft) {
          // Find or create 3DNS collection
          let dnsCollection = nftCollections.find(c => c.name === '3DNS Domains');
          if (!dnsCollection) {
            dnsCollection = {
              name: '3DNS Domains',
              type: '3dns',
              nfts: []
            };
            nftCollections.push(dnsCollection);
          }
          
          // Add x.box advertisement NFT
          dnsCollection.nfts.push({
            tokenId: 'ad-xbox',
            name: 'x.box',
            description: 'Reserved 3DNS domain - Advertised',
            imageUrl: 'https://cdn-icons-png.flaticon.com/512/6699/6699362.png',
            collectionName: '3DNS Domains',
            contractAddress: '0x',
            rarityRank: null,
            traits: [],
            isAd: true,
            adUrl: 'https://my.box/?ref=aqdql6'
          });
        }
        
        // Ensure ENS collection links to https://ens.domains/
        const ensCollection = nftCollections.find(c => c.name === 'ENS Domains');
        if (ensCollection) {
          ensCollection.nfts = ensCollection.nfts.map(nft => ({
            ...nft,
            collectionUrl: 'https://ens.domains/'
          }));
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
    // If it's an ad NFT, open the ad URL in a new tab
    if (nft.isAd && nft.adUrl) {
      window.open(nft.adUrl, '_blank');
      return;
    }
    
    // Otherwise show the details dialog
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
                 selectedType === 'base' ? 'Base Names' :
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
