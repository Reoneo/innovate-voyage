
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle } from 'lucide-react';
import { OpenSeaNft } from '@/api/services/openseaService';

interface NftDetailsDialogProps {
  nft: OpenSeaNft;
  onClose: () => void;
  onOpenProfile?: (name: string) => void;
}

const NftDetailsDialog: React.FC<NftDetailsDialogProps> = ({ nft, onClose, onOpenProfile }) => {
  const handleProfileClick = () => {
    if (onOpenProfile && nft.owner) {
      onOpenProfile(nft.owner);
      onClose();
    }
  };

  // Get chain logo based on the chain ID
  const getChainLogo = (chain: string | undefined) => {
    switch (chain) {
      case 'ethereum':
        return 'https://cdn.creazilla.com/icons/3253747/ethereum-icon-lg.png';
      case 'base':
        return 'https://cryptologos.cc/logos/base-logo.svg';
      case 'optimism':
        return 'https://altcoinsbox.com/wp-content/uploads/2023/03/optimism-logo-600x600.webp';
      case 'polygon':
        return 'https://altcoinsbox.com/wp-content/uploads/2023/03/matic-logo-600x600.webp';
      default:
        return 'https://cdn.creazilla.com/icons/3253747/ethereum-icon-lg.png'; // Default to Ethereum
    }
  };

  const chainName = (chain: string | undefined) => {
    switch (chain) {
      case 'ethereum':
        return 'Ethereum';
      case 'base':
        return 'Base';
      case 'optimism':
        return 'Optimism';
      case 'polygon':
        return 'Polygon';
      default:
        return 'Ethereum';
    }
  };

  // Generate the correct OpenSea URL with contract address
  const getOpenSeaUrl = () => {
    const chain = nft.chain || 'ethereum';
    const contractAddress = nft.contractAddress;
    const tokenId = nft.id;
    
    // Use the correct OpenSea URL format: /assets/{chain}/{contractAddress}/{tokenId}
    if (contractAddress) {
      return `https://opensea.io/assets/${chain}/${contractAddress}/${tokenId}`;
    } else {
      // Fallback to old format if contract address is not available
      return `https://opensea.io/assets/${chain}/${tokenId}`;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white text-gray-800 border border-gray-200 shadow-lg">
        <DialogHeader className="border-b border-gray-200 pb-3">
          <DialogTitle className="flex items-center gap-2">
            <img 
              src={getChainLogo(nft.chain)} 
              alt={chainName(nft.chain)}
              className="h-5 w-5 rounded-full"
            />
            {nft.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex justify-center">
            <div className="rounded-md overflow-hidden w-full aspect-square bg-gray-50">
              <img 
                src={nft.imageUrl} 
                alt={nft.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700">Collection</h3>
              <p className="text-gray-900">{nft.collectionName}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-2">
              <img 
                src={getChainLogo(nft.chain)} 
                alt={chainName(nft.chain)}
                className="h-5 w-5 rounded-full"
              />
              <span>{chainName(nft.chain)} Network</span>
            </div>
            
            {nft.description && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700">Description</h3>
                <p className="text-sm text-gray-600">{nft.description}</p>
              </div>
            )}
            
            <div className="flex gap-2">
              {nft.bestOffer && (
                <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700">Best Offer</h3>
                  <p>{nft.bestOffer} ETH</p>
                </div>
              )}
              
              {nft.currentPrice && (
                <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700">Current Price</h3>
                  <p>{nft.currentPrice} ETH</p>
                </div>
              )}
            </div>
            
            {nft.owner && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700">Owner</h3>
                <Button 
                  variant="link" 
                  className="text-primary p-0 h-auto font-normal hover:text-primary/80"
                  onClick={handleProfileClick}
                >
                  {nft.owner}
                </Button>
              </div>
            )}
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-1 border-gray-200 hover:bg-gray-50 text-gray-800"
                asChild
              >
                <a 
                  href={getOpenSeaUrl()} 
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

export default NftDetailsDialog;
