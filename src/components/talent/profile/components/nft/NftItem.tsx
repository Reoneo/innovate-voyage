
import React from 'react';
import { OpenSeaNft } from '@/api/services/openseaService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NftItemProps {
  nft: OpenSeaNft;
  onClick: (nft: OpenSeaNft) => void;
}

const NftItem: React.FC<NftItemProps> = ({ nft, onClick }) => {
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

  return (
    <div 
      className="relative group cursor-pointer overflow-hidden rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
      onClick={() => onClick(nft)}
    >
      <div className="aspect-square w-full relative bg-white">
        <img 
          src={nft.imageUrl} 
          alt={nft.name}
          className="w-full h-full object-contain"
          loading="lazy"
        />
        
        {/* Chain indicator */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute bottom-2 left-2">
                <img 
                  src={getChainLogo(nft.chain)} 
                  alt={chainName(nft.chain)}
                  className="h-5 w-5 rounded-full bg-white p-0.5 shadow-sm"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{chainName(nft.chain)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
        <div className="text-gray-800 text-sm">
          <p className="font-medium truncate">{nft.name}</p>
          {nft.bestOffer && (
            <p className="text-xs">Best offer: {nft.bestOffer} ETH</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NftItem;
