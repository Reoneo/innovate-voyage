
import React from 'react';
import { Button } from "@/components/ui/button";

interface NftFilterControlsProps {
  selectedType: 'ethereum' | 'ens' | 'poap' | 'all';
  onTypeChange: (type: 'ethereum' | 'ens' | 'poap' | 'all') => void;
  hasEthereumNfts: boolean;
  hasEnsNfts: boolean;
  hasPoapNfts: boolean;
}

const NftFilterControls: React.FC<NftFilterControlsProps> = ({
  selectedType,
  onTypeChange,
  hasEthereumNfts,
  hasEnsNfts,
  hasPoapNfts
}) => {
  return (
    <div className="flex gap-2 mb-4">
      <Button 
        onClick={() => onTypeChange('all')} 
        variant={selectedType === 'all' ? "default" : "outline"}
        size="sm"
      >
        All
      </Button>
      {hasEthereumNfts && (
        <Button 
          onClick={() => onTypeChange('ethereum')} 
          variant={selectedType === 'ethereum' ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-1"
        >
          <img 
            src="https://cdn-icons-png.flaticon.com/512/6699/6699362.png" 
            alt="NFT" 
            className="h-4 w-4"
          />
          NFTs
        </Button>
      )}
      {hasEnsNfts && (
        <Button 
          onClick={() => onTypeChange('ens')} 
          variant={selectedType === 'ens' ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-1"
        >
          <img 
            src="https://ens.domains/assets/brand/mark/ens-mark-Blue.svg" 
            alt="ENS" 
            className="h-4 w-4"
          />
          ENS
        </Button>
      )}
      {hasPoapNfts && (
        <Button 
          onClick={() => onTypeChange('poap')} 
          variant={selectedType === 'poap' ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-1"
        >
          <img 
            src="https://deficon.nyc/wp-content/uploads/2021/12/poap.png" 
            alt="POAP" 
            className="h-4 w-4"
          />
          POAP
        </Button>
      )}
    </div>
  );
};

export default NftFilterControls;
