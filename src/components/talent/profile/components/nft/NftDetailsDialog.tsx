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

const NftDetailsDialog: React.FC<NftDetailsDialogProps> = ({ nft, onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white text-gray-800 border border-gray-200 shadow-lg">
        <DialogHeader className="border-b border-gray-200 pb-3">
          <DialogTitle className="flex items-center gap-2">
            {nft.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex justify-center">
            <div className="rounded-md overflow-hidden w-full aspect-square bg-gray-50">
              <img 
                src={nft.image_url}
                alt={nft.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700">Collection</h3>
              <p className="text-gray-900">{nft.collection}</p>
            </div>
            
            {nft.description && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700">Description</h3>
                <p className="text-sm text-gray-600">{nft.description}</p>
              </div>
            )}
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-1 border-gray-200 hover:bg-gray-50 text-gray-800"
                asChild
              >
                <a 
                  href={nft.opensea_url} 
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
