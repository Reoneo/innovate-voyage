
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
  hasBaseNfts
}) => {
  const filters = [
    { type: 'all' as const, label: 'All Collections', always: true },
    { type: 'ethereum' as const, label: 'Ethereum NFTs', show: hasEthereumNfts },
    { type: 'base' as const, label: 'Base NFTs', show: hasBaseNfts },
    { type: 'ens' as const, label: 'ENS Domains', show: hasEnsNfts },
    { type: 'poap' as const, label: 'POAPs', show: hasPoapNfts },
    { type: '3dns' as const, label: '3DNS Domains', show: has3dnsNfts },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => 
        (filter.always || filter.show) && (
          <Button
            key={filter.type}
            variant={selectedType === filter.type ? "default" : "outline"}
            onClick={() => onTypeChange(filter.type)}
            className="text-xs px-3 py-1 h-auto"
          >
            {filter.label}
          </Button>
        )
      )}
    </div>
  );
};

export default NftFilterControls;
