
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
  const [selectedType, setSelectedType] = useState<'ethereum' | 'ens' | 'poap' | '3dns' | 'base' | 'all'>('all');
  const [selectedNft, setSelectedNft] = useState<OpenSeaNft | null>(null);

  useEffect(() => {
    if (!walletAddress) return;

    const loadNfts = async () => {
      setLoading(true);
      try {
        const nftCollections = await fetchUserNfts(walletAddress);
        
        // Add ENS collection with sample NFT if not present
        let hasEnsCollection = nftCollections.some(c => 
          c.name.toLowerCase().includes('ens') ||
          c.name.toLowerCase().includes('ethereum name service')
        );
        
        if (!hasEnsCollection) {
          // Create an ENS collection with sample NFT
          const sampleEnsNft: OpenSeaNft = {
            id: 'ens-sample',
            name: 'ENS Sample',
            description: 'Ethereum Name Service - Decentralized naming for wallets, websites, & more',
            collectionName: 'Ethereum Name Service',
            imageUrl: 'https://ens.domains/assets/brand/token-icon.svg',
            externalUrl: 'https://ens.domains/',
            network: 'ethereum',
            tokenId: 'sample',
            contractAddress: '',
            metadataUrl: '',
            isCustom: true
          };
          
          nftCollections.push({
            name: 'Ethereum Name Service',
            nfts: [sampleEnsNft],
            type: 'ens'
          });
        }
        
        // Check for a Base Names collection and add if not present
        let hasBaseCollection = nftCollections.some(c => 
          c.name.toLowerCase().includes('base') || 
          c.name.toLowerCase().includes('basename')
        );
        
        if (!hasBaseCollection) {
          // Create a Base Names collection with sample NFT
          const sampleBaseNft: OpenSeaNft = {
            id: 'base-sample',
            name: 'Base Name Sample',
            description: 'Sample Base Name - A next generation L2 blockchain',
            collectionName: 'Base Names',
            imageUrl: 'https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue.png',
            externalUrl: 'https://www.base.org/names',
            network: 'base',
            tokenId: 'sample',
            contractAddress: '',
            metadataUrl: '',
            isCustom: true
          };
          
          nftCollections.push({
            name: 'Base Names',
            nfts: [sampleBaseNft],
            type: 'base'
          });
        }
        
        // Check for Ethereum Follow Protocol collection
        let hasEfpCollection = nftCollections.some(c => 
          c.name.toLowerCase().includes('ethereum follow') || 
          c.name.toLowerCase().includes('efp')
        );
        
        if (!hasEfpCollection) {
          // Create an EFP collection
          const sampleEfpNft: OpenSeaNft = {
            id: 'efp-sample',
            name: 'Ethereum Follow Protocol',
            description: 'EFP - Decentralized social graph protocol',
            collectionName: 'Ethereum Follow Protocol',
            imageUrl: 'https://public.rootdata.com/images/b6/1704560912107.png',
            externalUrl: 'https://efp.xyz/',
            network: 'ethereum',
            tokenId: 'sample',
            contractAddress: '',
            metadataUrl: '',
            isCustom: true
          };
          
          nftCollections.push({
            name: 'Ethereum Follow Protocol',
            nfts: [sampleEfpNft],
            type: 'ethereum'
          });
        } else {
          // Find the EFP collection and update the image URLs
          const efpCollectionIndex = nftCollections.findIndex(c => 
            c.name.toLowerCase().includes('ethereum follow') || 
            c.name.toLowerCase().includes('efp')
          );
          
          if (efpCollectionIndex >= 0) {
            nftCollections[efpCollectionIndex].nfts = nftCollections[efpCollectionIndex].nfts.map(nft => ({
              ...nft,
              imageUrl: 'https://public.rootdata.com/images/b6/1704560912107.png',
              isCustom: true,
              externalUrl: 'https://efp.xyz/'
            }));
          }
        }
        
        // Remove 3DNS Sample Collection (as requested)
        const filtered = nftCollections.filter(c => !c.name.toLowerCase().includes('3dns'));
        
        setCollections(filtered);
      } catch (error) {
        console.error('Error loading NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNfts();
  }, [walletAddress]);

  if (!walletAddress) return null;

  // Handle NFT click to show details or navigate to external URL if it's a custom NFT
  const handleNftClick = (nft: OpenSeaNft) => {
    if (nft.isCustom && nft.externalUrl) {
      window.open(nft.externalUrl, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedNft(nft);
    }
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
                 selectedType === 'poap' ? 'POAP Collection' :
                 selectedType === '3dns' ? '3DNS Domains' : 'Base Names'}
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
      {selectedNft && !selectedNft.isCustom && (
        <NftDetailsDialog 
          nft={selectedNft} 
          onClose={() => setSelectedNft(null)} 
          onOpenProfile={handleOpenProfile}
        />
      )}
    </>
  );
};
