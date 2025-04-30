
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
    <div 
      className="relative group cursor-pointer overflow-hidden rounded-lg"
      onClick={() => onClick(nft)}
    >
      <div className="aspect-square w-full relative bg-gradient-to-b from-gray-800 to-gray-900">
        <img 
          src={nft.imageUrl} 
          alt={nft.name}
          className="w-full h-full object-contain"
        />
        
        {/* Chain indicator */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute bottom-2 left-2">
                <img 
                  src={getChainLogo(nft.chain)} 
                  alt={chainName(nft.chain)}
                  className="h-5 w-5 rounded-full bg-gray-800 p-0.5"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{chainName(nft.chain)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
        <div className="text-white text-sm">
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
