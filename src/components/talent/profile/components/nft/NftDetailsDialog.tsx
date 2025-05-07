
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, ImageIcon, Network, ArrowUp, ArrowDown, Wallet, Heart } from 'lucide-react';
import { OpenSeaNft } from '@/api/services/openseaService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

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

  // Format date for display - helper function
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Price formatting
  const formatPrice = (price?: string) => {
    if (!price) return null;
    const priceNum = parseFloat(price);
    return priceNum < 0.001 ? '< 0.001 ETH' : `${priceNum.toFixed(3)} ETH`;
  };

  // List of traits/attributes
  const traits = nft.traits || [];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white text-gray-800 border border-gray-200 shadow-lg p-0 overflow-hidden">
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <DialogHeader className="px-6 py-4">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <img 
                src={getChainLogo(nft.chain)} 
                alt={chainName(nft.chain)}
                className="h-5 w-5 rounded-full"
              />
              <span className="truncate">{nft.name}</span>
            </DialogTitle>
          </DialogHeader>
        </div>
        
        <div className="overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Left column - NFT image */}
            <div className="bg-gray-50 flex items-center justify-center p-4 min-h-[300px]">
              {nft.imageUrl ? (
                <img 
                  src={nft.imageUrl} 
                  alt={nft.name}
                  className="max-w-full max-h-[600px] object-contain rounded-md shadow-sm"
                />
              ) : (
                <div className="flex flex-col items-center justify-center bg-gray-100 rounded-md w-full h-full min-h-[300px]">
                  <ImageIcon className="h-16 w-16 text-gray-400" />
                  <p className="text-gray-500 mt-2">Image not available</p>
                </div>
              )}
            </div>
            
            {/* Right column - NFT details */}
            <div className="p-6 space-y-6">
              {/* Collection info */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img 
                    src={nft.collectionImage || `https://api.dicebear.com/6.x/shapes/svg?seed=${nft.collectionName}`} 
                    alt={nft.collectionName}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/6.x/shapes/svg?seed=${nft.collectionName}`;
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-medium">{nft.collectionName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Network className="h-3.5 w-3.5" />
                    <span>{chainName(nft.chain)}</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Price & Offers */}
              <div className="space-y-4">
                {/* Current price */}
                {nft.currentPrice && (
                  <div>
                    <div className="text-sm text-gray-500">Current price</div>
                    <div className="text-xl font-bold flex items-center gap-2">
                      <img 
                        src={getChainLogo(nft.chain)} 
                        alt={chainName(nft.chain)}
                        className="h-5 w-5"
                      />
                      {formatPrice(nft.currentPrice)}
                    </div>
                    
                    {/* Price history indicator */}
                    {nft.priceChange && (
                      <div className={`flex items-center text-sm ${nft.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {nft.priceChange > 0 ? (
                          <ArrowUp className="h-3.5 w-3.5 mr-1" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5 mr-1" />
                        )}
                        {Math.abs(nft.priceChange).toFixed(2)}% from last sale
                      </div>
                    )}
                  </div>
                )}
                
                {/* Best offer */}
                {nft.bestOffer && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Best offer</div>
                    <div className="text-lg font-medium flex items-center gap-2">
                      <img 
                        src={getChainLogo(nft.chain)} 
                        alt={chainName(nft.chain)}
                        className="h-4 w-4"
                      />
                      {formatPrice(nft.bestOffer)}
                    </div>
                    
                    {nft.offerExpiration && (
                      <div className="text-xs text-gray-500 mt-1">
                        Expires {formatDate(nft.offerExpiration)}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Owner */}
              {nft.owner && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Owner</div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start p-3 h-auto"
                    onClick={handleProfileClick}
                  >
                    <Wallet className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="truncate">{nft.owner}</span>
                  </Button>
                </div>
              )}
              
              {/* Traits & Attributes */}
              {traits && traits.length > 0 && (
                <div>
                  <h3 className="text-sm text-gray-500 mb-2">Attributes</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {traits.map((trait, index) => (
                      <div key={index} className="bg-gray-50 rounded-md p-3 text-center">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                          {trait.trait_type}
                        </div>
                        <div className="font-medium mt-1 truncate">
                          {trait.value}
                        </div>
                        {trait.rarity && (
                          <div className="text-xs text-indigo-600 mt-1">
                            {trait.rarity}% have this
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Description */}
              {nft.description && (
                <div>
                  <h3 className="text-sm text-gray-500 mb-2">Description</h3>
                  <div className="bg-gray-50 p-4 rounded-md text-sm">
                    {nft.description}
                  </div>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="flex gap-2 pt-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add to favorites</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <Button 
                  variant="outline" 
                  className="flex flex-1 items-center gap-1 border-gray-200 hover:bg-gray-50 text-gray-800"
                  asChild
                >
                  <a 
                    href={`https://opensea.io/assets/${nft.chain}/${nft.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View on OpenSea <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </Button>
              </div>
              
              {/* Details & Activity */}
              {nft.lastActivity && (
                <div>
                  <h3 className="text-sm text-gray-500 mb-2">Recent Activity</h3>
                  <div className="space-y-2">
                    {nft.lastActivity.map((activity, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div>
                          <div className="font-medium">{activity.type}</div>
                          <div className="text-xs text-gray-500">{formatDate(activity.date)}</div>
                        </div>
                        <Badge variant={activity.type === 'Sale' ? 'default' : 'outline'}>
                          {activity.price} ETH
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NftDetailsDialog;
