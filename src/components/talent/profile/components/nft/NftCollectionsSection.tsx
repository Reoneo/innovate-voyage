
import React, { useEffect, useState } from 'react';
import { fetchUserNfts, type OpenSeaNft } from '@/api/services/openseaService';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';

interface NftCollectionsSectionProps {
  walletAddress?: string;
  showCollections?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface NftDetailsProps {
  nft: OpenSeaNft;
  onClose: () => void;
  onOpenProfile?: (name: string) => void;
}

// NFT Details component
const NftDetails: React.FC<NftDetailsProps> = ({ nft, onClose, onOpenProfile }) => {
  const handleProfileClick = () => {
    if (onOpenProfile && nft.owner) {
      onOpenProfile(nft.owner);
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{nft.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex justify-center">
            <img 
              src={nft.imageUrl} 
              alt={nft.name}
              className="rounded-md w-full aspect-square object-contain"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Collection</h3>
              <p>{nft.collectionName}</p>
            </div>
            
            {nft.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="text-sm">{nft.description}</p>
              </div>
            )}
            
            {nft.bestOffer && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Best Offer</h3>
                <p>{nft.bestOffer} ETH</p>
              </div>
            )}
            
            {nft.currentPrice && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Current Price</h3>
                <p>{nft.currentPrice} ETH</p>
              </div>
            )}
            
            {nft.owner && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Owner</h3>
                <Button 
                  variant="ghost" 
                  className="text-blue-600 p-0 h-auto font-normal hover:text-blue-800"
                  onClick={handleProfileClick}
                >
                  {nft.owner}
                </Button>
              </div>
            )}
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                asChild
              >
                <a 
                  href={`https://opensea.io/assets/${nft.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View on OpenSea <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const NftCollectionsSection: React.FC<NftCollectionsSectionProps> = ({ 
  walletAddress, 
  showCollections = false,
  onOpenChange
}) => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'ethereum' | 'ens' | 'poap' | 'all'>('all');
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

  const filteredCollections = selectedType === 'all' 
    ? collections 
    : collections.filter(collection => collection.type === selectedType);

  const hasNfts = collections.length > 0;
  const hasEthereumNfts = collections.some(c => c.type === 'ethereum');
  const hasEnsNfts = collections.some(c => c.type === 'ens');
  const hasPoapNfts = collections.some(c => c.type === 'poap');

  // Get collection icon based on collection name
  const getCollectionIcon = (collectionName: string) => {
    const lowerCaseName = collectionName.toLowerCase();
    if (lowerCaseName.includes('doodle') || lowerCaseName.includes('doodles')) {
      return "https://pbs.twimg.com/profile_images/1907827518700220416/ZUn7WAT8_400x400.jpg";
    } else if (lowerCaseName.includes('ens')) {
      return "https://ens.domains/assets/brand/mark/ens-mark-Blue.svg";
    } else if (lowerCaseName.includes('poap')) {
      return "https://deficon.nyc/wp-content/uploads/2021/12/poap.png";
    } else if (lowerCaseName.includes('efp') || lowerCaseName.includes('ethereum follow protocol')) {
      return "https://pbs.twimg.com/profile_images/1746632341378715649/XOOa7TZO_400x400.jpg";
    }
    return "https://cdn-icons-png.flaticon.com/512/6699/6699362.png";
  };

  // Format collection name - replace dashes with spaces
  const formatCollectionName = (name: string) => {
    return name.replace(/-/g, ' ');
  };

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
    window.location.href = `/recruitment.box/${name.toLowerCase()}/`;
  };

  return (
    <>
      <Dialog open={showCollections} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedType === 'all' ? 'All Collections' : 
               selectedType === 'ethereum' ? 'NFT Collections' :
               selectedType === 'ens' ? 'ENS Collection' : 'POAP Collection'}
            </DialogTitle>
          </DialogHeader>

          <div className="flex gap-2 mb-4">
            <Button 
              onClick={() => setSelectedType('all')} 
              variant={selectedType === 'all' ? "default" : "outline"}
              size="sm"
            >
              All
            </Button>
            {hasEthereumNfts && (
              <Button 
                onClick={() => setSelectedType('ethereum')} 
                variant={selectedType === 'ethereum' ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-1"
              >
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/6699/6699362.png" 
                  alt="NFT" 
                  className="h-4 w-4"
                />
                NFTs
              </Button>
            )}
            {hasEnsNfts && (
              <Button 
                onClick={() => setSelectedType('ens')} 
                variant={selectedType === 'ens' ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-1"
              >
                <img 
                  src="https://ens.domains/assets/brand/mark/ens-mark-Blue.svg" 
                  alt="ENS" 
                  className="h-4 w-4"
                />
                ENS
              </Button>
            )}
            {hasPoapNfts && (
              <Button 
                onClick={() => setSelectedType('poap')} 
                variant={selectedType === 'poap' ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-1"
              >
                <img 
                  src="https://deficon.nyc/wp-content/uploads/2021/12/poap.png" 
                  alt="POAP" 
                  className="h-4 w-4"
                />
                POAP
              </Button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : filteredCollections.length > 0 ? (
            <div className="space-y-6">
              {filteredCollections.map((collection) => (
                <Card key={collection.name} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <img 
                        src={getCollectionIcon(collection.name)} 
                        alt={collection.name} 
                        className="h-5 w-5"
                      />
                      <h4 className="text-md font-medium">{formatCollectionName(collection.name)}</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {collection.nfts.map((nft: OpenSeaNft) => (
                        <div 
                          key={nft.id} 
                          className="relative group cursor-pointer"
                          onClick={() => handleNftClick(nft)}
                        >
                          <div className="aspect-square w-full relative">
                            <img 
                              src={nft.imageUrl} 
                              alt={nft.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-2 flex flex-col justify-end">
                            <div className="text-white text-sm">
                              <p className="font-medium truncate">{nft.name}</p>
                              {nft.bestOffer && (
                                <p className="text-xs">Best offer: {nft.bestOffer} ETH</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-muted-foreground">No NFTs found for this category</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* NFT Details Dialog */}
      {selectedNft && (
        <NftDetails 
          nft={selectedNft} 
          onClose={() => setSelectedNft(null)} 
          onOpenProfile={handleOpenProfile}
        />
      )}
    </>
  );
};
