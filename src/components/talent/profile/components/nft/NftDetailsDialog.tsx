
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
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
        return 'https://cryptologos.cc/logos/ethereum-eth-logo.svg';
      case 'base':
        return 'https://cryptologos.cc/logos/base-logo.svg';
      case 'optimism':
        return 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg';
      case 'polygon':
        return 'https://cryptologos.cc/logos/polygon-matic-logo.svg';
      default:
        return 'https://cryptologos.cc/logos/ethereum-eth-logo.svg'; // Default to Ethereum
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-gradient-to-b from-gray-900 to-gray-950 text-white border-gray-800">
        <DialogHeader className="border-b border-gray-800 pb-3">
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
            <div className="rounded-md overflow-hidden w-full aspect-square bg-gradient-to-b from-gray-800 to-gray-900">
              <img 
                src={nft.imageUrl} 
                alt={nft.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400">Collection</h3>
              <p className="text-white">{nft.collectionName}</p>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-lg flex items-center gap-2">
              <img 
                src={getChainLogo(nft.chain)} 
                alt={chainName(nft.chain)}
                className="h-5 w-5 rounded-full"
              />
              <span>{chainName(nft.chain)} Network</span>
            </div>
            
            {nft.description && (
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-400">Description</h3>
                <p className="text-sm text-gray-300">{nft.description}</p>
              </div>
            )}
            
            <div className="flex gap-2">
              {nft.bestOffer && (
                <div className="flex-1 bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-400">Best Offer</h3>
                  <p>{nft.bestOffer} ETH</p>
                </div>
              )}
              
              {nft.currentPrice && (
                <div className="flex-1 bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-400">Current Price</h3>
                  <p>{nft.currentPrice} ETH</p>
                </div>
              )}
            </div>
            
            {nft.owner && (
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-400">Owner</h3>
                <Button 
                  variant="link" 
                  className="text-blue-400 p-0 h-auto font-normal hover:text-blue-300"
                  onClick={handleProfileClick}
                >
                  {nft.owner}
                </Button>
              </div>
            )}
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
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

export default NftDetailsDialog;
