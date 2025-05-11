
import React from 'react';
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { OpenSeaNftWithCount } from './NftGrid';

interface NftDetailsDialogProps {
  nft: OpenSeaNftWithCount;
  onClose: () => void;
  onOpenProfile?: (ensName: string) => void;
}

const NftDetailsDialog: React.FC<NftDetailsDialogProps> = ({ nft, onClose, onOpenProfile }) => {
  const handleOpenOpensea = () => {
    if (nft.openseaUrl) {
      window.open(nft.openseaUrl, '_blank');
    }
  };

  const handleMakeOffer = () => {
    if (nft.openseaUrl) {
      window.open(`${nft.openseaUrl}?tab=offers`, '_blank');
    }
  };

  // Check if there's an ENS name in the NFT data
  const hasEnsName = nft.name && nft.name.includes('.eth') && nft.name.trim() !== '';
  
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[650px]">
        <div className="flex justify-between items-center">
          <DialogHeader className="flex-1">
            <h3 className="text-xl font-semibold">{nft.name || `#${nft.id}`}</h3>
            <p className="text-sm text-gray-500">{nft.collectionName}</p>
          </DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8 flex items-center justify-center"
          >
            <X size={18} />
          </Button>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full flex items-center justify-center">
            {nft.imageUrl ? (
              <img 
                src={nft.imageUrl} 
                alt={nft.name || "NFT"} 
                className="max-h-[300px] w-auto object-contain rounded-lg shadow-md"
                loading="lazy"
              />
            ) : (
              <div className="bg-gray-200 h-[300px] w-full rounded-lg flex items-center justify-center">
                No image available
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Description</h4>
              <p className="text-sm mt-1">{nft.description || "No description available"}</p>
            </div>
            
            {nft.count && nft.count > 1 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Quantity</h4>
                <p className="text-sm font-semibold mt-1">{nft.count}</p>
              </div>
            )}
            
            <div className="pt-2 flex flex-col gap-3">
              {nft.openseaUrl && (
                <>
                  <Button 
                    variant="outline"
                    onClick={handleOpenOpensea} 
                    className="w-full"
                  >
                    <img src="https://storage.googleapis.com/opensea-static/Logomark/OpenSea-Full-Logo%20(light).svg" 
                         alt="OpenSea" 
                         className="h-4 mr-2" 
                    />
                    View on OpenSea
                  </Button>
                  
                  <Button 
                    onClick={handleMakeOffer} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <img src="https://storage.googleapis.com/opensea-static/Logomark/Logomark-White.svg" 
                         alt="Make offer" 
                         className="h-4 mr-2" 
                    />
                    Make an offer
                  </Button>
                </>
              )}
              
              {hasEnsName && onOpenProfile && (
                <Button 
                  variant="secondary"
                  onClick={() => onOpenProfile(nft.name!)} 
                  className="w-full mt-2"
                >
                  View Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NftDetailsDialog;
