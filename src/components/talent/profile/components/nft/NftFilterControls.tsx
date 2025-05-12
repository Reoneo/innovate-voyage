
import React from 'react';
import { Button } from "@/components/ui/button";

interface NftFilterControlsProps {
  selectedType: 'ethereum' | 'ens' | 'poap' | '3dns' | 'base' | 'all';
  onTypeChange: (type: 'ethereum' | 'ens' | 'poap' | '3dns' | 'base' | 'all') => void;
  hasEthereumNfts: boolean;
  hasEnsNfts: boolean;
  hasPoapNfts: boolean;
  has3dnsNfts: boolean;
  hasBaseNfts?: boolean;
}

const NftFilterControls: React.FC<NftFilterControlsProps> = ({
  selectedType,
  onTypeChange,
  hasEthereumNfts,
  hasEnsNfts,
  hasPoapNfts,
  has3dnsNfts,
  hasBaseNfts = false
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button 
        variant={selectedType === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onTypeChange('all')}
      >
        All
      </Button>

      {hasEthereumNfts && (
        <Button 
          variant={selectedType === 'ethereum' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('ethereum')}
        >
          NFTs
        </Button>
      )}

      {hasEnsNfts && (
        <Button 
          variant={selectedType === 'ens' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('ens')}
        >
          ENS
        </Button>
      )}

      {hasPoapNfts && (
        <Button 
          variant={selectedType === 'poap' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('poap')}
        >
          POAP
        </Button>
      )}

      {has3dnsNfts && (
        <Button 
          variant={selectedType === '3dns' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('3dns')}
        >
          3DNS Domains
        </Button>
      )}

      {hasBaseNfts && (
        <Button 
          variant={selectedType === 'base' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('base')}
        >
          Base Names
        </Button>
      )}
    </div>
  );
};

export default NftFilterControls;
