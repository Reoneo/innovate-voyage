
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    <div className="flex flex-wrap gap-2">
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
          className="flex items-center gap-1"
        >
          <img 
            src="https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/256/Ethereum-ETH-icon.png" 
            alt="Ethereum" 
            className="h-4 w-4" 
          />
          <span>Ethereum</span>
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
    </div>
  );
};

export default NftFilterControls;
