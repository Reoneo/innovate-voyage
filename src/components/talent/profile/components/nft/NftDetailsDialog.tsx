
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { OpenSeaNft } from '@/api/services/openseaService';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, X } from 'lucide-react';

interface NftDetailsDialogProps {
  nft: OpenSeaNft & { count?: number };
  onClose: () => void;
  onOpenProfile?: (name: string) => void;
}

const NftDetailsDialog: React.FC<NftDetailsDialogProps> = ({ nft, onClose, onOpenProfile }) => {
  // Generate OpenSea URL for making offers
  const generateOpenSeaUrl = () => {
    if (nft.permalink) {
      return nft.permalink;
    }
    
    // Fallback URL construction
    const baseUrl = 'https://opensea.io/assets/ethereum';
    return `${baseUrl}/${nft.contract || 'unknown'}/${nft.token_id || ''}`;
  };

  const openSeaUrl = generateOpenSeaUrl();
  
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white sm:rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{nft.name || 'NFT Details'}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8 text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            <X size={18} />
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
              <img 
                src={nft.image_url || 'https://placehold.co/600x600/e2e8f0/64748b?text=No+Image'}
                alt={nft.name || 'NFT Image'}
                className="w-full object-contain"
                style={{ maxHeight: '400px' }}
              />
            </div>
            
            {nft.count && nft.count > 1 && (
              <div className="mt-4 text-center">
                <Badge variant="outline" className="px-4 py-1">
                  You own {nft.count} of these
                </Badge>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Collection</h3>
              <p className="font-medium">{nft.collectionName || 'Unknown Collection'}</p>
            </div>
            
            {nft.description && (
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Description</h3>
                <p className="text-sm">{nft.description}</p>
              </div>
            )}
            
            {nft.traits && nft.traits.length > 0 && (
              <div>
                <h3 className="text-sm text-gray-500 mb-2">Traits</h3>
                <div className="grid grid-cols-2 gap-2">
                  {nft.traits.map((trait, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded-md">
                      <p className="text-xs text-gray-500">{trait.trait_type}</p>
                      <p className="text-sm font-medium">{trait.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-4 flex flex-col gap-2">
              {openSeaUrl && (
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.open(openSeaUrl, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" /> 
                  Make Offer on OpenSea
                </Button>
              )}
              
              {nft.owner && onOpenProfile && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onOpenProfile(nft.owner as string)}
                >
                  View Owner Profile
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
