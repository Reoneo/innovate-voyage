
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
        
        // Add sample 3DNS domain to collections if not present
        let has3dnsCollection = nftCollections.some(c => 
          c.name.toLowerCase().includes('3dns') || 
          c.name.toLowerCase().includes('3dns powered domains')
        );
        
        if (!has3dnsCollection) {
          // Create a 3DNS collection with sample NFT
          const sample3dnsNft: OpenSeaNft = {
            id: '3dns-sample',
            name: '3DNS Sample Domain',
            description: 'Sample 3DNS Domain - Click to visit my.box',
            collectionName: '3DNS Powered Domains',
            imageUrl: 'https://docs.my.box/~gitbook/image?url=https%3A%2F%2F1581571575-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLNPySatzgHa3v2j4Gmqn%252Fuploads%252F4HNwIbiFFE6Sd7H41SIL%252Fhex_black.png%3Falt%3Dmedia%26token%3D518e3a0f-2c02-484c-ac5b-23b7329f1176&width=376&dpr=2&quality=100&sign=c393b902&sv=2',
            externalUrl: 'https://my.box/?ref=aqdql6',
            network: 'ethereum',
            tokenId: 'sample',
            contractAddress: '',
            metadataUrl: '',
            isCustom: true
          };
          
          nftCollections.push({
            name: '3DNS Powered Domains',
            nfts: [sample3dnsNft],
            type: '3dns'
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
            externalUrl: 'https://base.org',
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
