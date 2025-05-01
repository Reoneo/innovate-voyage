
import React, { useState } from 'react';
import { OpenSeaNft } from '@/api/services/openseaService';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NftDetailsDialogProps {
  nft: OpenSeaNft | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NftDetailsDialog: React.FC<NftDetailsDialogProps> = ({ nft, open, onOpenChange }) => {
  const [imageError, setImageError] = useState(false);

  if (!nft) return null;

  const handleImageError = () => {
    setImageError(true);
  };

  const imageUrl = imageError ? 
    'https://placehold.co/600x400/gray/white?text=Image+Not+Available' : 
    nft.image_url || nft.image_preview_url || 'https://placehold.co/600x400/gray/white?text=Image+Not+Available';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg w-[95%]">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <div className="flex flex-col space-y-4">
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={imageUrl}
              alt={nft.name || 'NFT Image'}
              className="w-full h-auto object-contain"
              onError={handleImageError}
            />
          </div>
          
          <div className="space-y-3">
            <div>
              <h2 className="flex items-center gap-2">
                <span className="text-xl font-semibold">{nft.name || 'Untitled NFT'}</span>
                {nft.rarity_rank && (
                  <Badge variant="outline" className="text-xs">
                    Rank #{nft.rarity_rank}
                  </Badge>
                )}
              </h2>
              <p className="text-sm text-muted-foreground">
                {nft.collection?.name || 'Unknown Collection'}
              </p>
            </div>
            
            {nft.description && (
              <div className="border-t pt-3">
                <h3 className="text-sm font-medium mb-1">Description</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {nft.description}
                </p>
              </div>
            )}
            
            <div className="border-t pt-3">
              <h3 className="text-sm font-medium mb-2">Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {nft.token_id && (
                  <div>
                    <span className="text-muted-foreground">Token ID: </span>
                    <span>{nft.token_id}</span>
                  </div>
                )}
                {nft.contract_address && (
                  <div>
                    <span className="text-muted-foreground">Contract: </span>
                    <span className="truncate">{`${nft.contract_address.slice(0, 6)}...${nft.contract_address.slice(-4)}`}</span>
                  </div>
                )}
              </div>
            </div>
            
            {nft.opensea_url && (
              <div className="pt-3">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  asChild
                >
                  <a 
                    href={nft.opensea_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={16} /> View on OpenSea
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NftDetailsDialog;
