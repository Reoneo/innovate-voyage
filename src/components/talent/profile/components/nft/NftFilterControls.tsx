
import React from 'react';
import { Button } from '@/components/ui/button';

interface NftFilterControlsProps {
  selectedType: 'ethereum' | 'ens' | 'poap' | '3dns' | 'base' | 'all';
  setSelectedType: (type: 'ethereum' | 'ens' | 'poap' | '3dns' | 'base' | 'all') => void;
  hasEnsCollection: boolean;
  hasPoapCollection: boolean;
  has3dnsCollection: boolean;
  hasBaseCollection: boolean;
}

const NftFilterControls: React.FC<NftFilterControlsProps> = ({
  selectedType,
  setSelectedType,
  hasEnsCollection,
  hasPoapCollection,
  has3dnsCollection,
  hasBaseCollection
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant={selectedType === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setSelectedType('all')}
        className="rounded-full"
      >
        All
      </Button>
      
      <Button
        variant={selectedType === 'ethereum' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setSelectedType('ethereum')}
        className="rounded-full"
      >
        Ethereum NFTs
      </Button>
      
      {hasEnsCollection && (
        <Button
          variant={selectedType === 'ens' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedType('ens')}
          className="rounded-full"
        >
          ENS Domains
        </Button>
      )}
      
      {hasPoapCollection && (
        <Button
          variant={selectedType === 'poap' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedType('poap')}
          className="rounded-full"
        >
          POAPs
        </Button>
      )}
      
      {has3dnsCollection && (
        <Button
          variant={selectedType === '3dns' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedType('3dns')}
          className="rounded-full"
        >
          3DNS Domains
        </Button>
      )}
      
      {hasBaseCollection && (
        <Button
          variant={selectedType === 'base' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedType('base')}
          className="rounded-full"
        >
          Base Names
        </Button>
      )}
    </div>
  );
};

export default NftFilterControls;
