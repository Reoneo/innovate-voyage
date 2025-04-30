
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

export default NftDetailsDialog;
