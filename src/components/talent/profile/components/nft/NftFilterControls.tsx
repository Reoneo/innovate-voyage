
import React from 'react';
import { Button } from '@/components/ui/button';

interface NftFilterControlsProps {
  selectedType: 'ethereum' | 'ens' | 'poap' | '3dns' | 'all';
  onTypeChange: (type: 'ethereum' | 'ens' | 'poap' | '3dns' | 'all') => void;
  hasEthereumNfts: boolean;
  hasEnsNfts: boolean;
  hasPoapNfts: boolean;
  has3dnsNfts?: boolean;
}

const NftFilterControls: React.FC<NftFilterControlsProps> = ({
  selectedType,
  onTypeChange,
  hasEthereumNfts,
  hasEnsNfts,
  hasPoapNfts,
  has3dnsNfts = false
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant={selectedType === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onTypeChange('all')}
        className="rounded-full"
      >
        All Collections
      </Button>
      
      {hasEthereumNfts && (
        <Button
          variant={selectedType === 'ethereum' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('ethereum')}
          className="rounded-full"
        >
          NFTs
        </Button>
      )}
      
      {hasEnsNfts && (
        <Button
          variant={selectedType === 'ens' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('ens')}
          className="rounded-full"
        >
          ENS
        </Button>
      )}
      
      {hasPoapNfts && (
        <Button
          variant={selectedType === 'poap' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('poap')}
          className="rounded-full"
        >
          POAPs
        </Button>
      )}
      
      {has3dnsNfts && (
        <Button
          variant={selectedType === '3dns' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('3dns')}
          className="rounded-full"
        >
          3DNS Domains
        </Button>
      )}
    </div>
  );
};

export default NftFilterControls;
