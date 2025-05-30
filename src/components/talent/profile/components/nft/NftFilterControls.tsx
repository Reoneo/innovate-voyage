
import React from 'react';
import { Button } from '@/components/ui/button';
import { Palette, Globe, Award, Hexagon, Grid3X3, Sparkles } from 'lucide-react';

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
  const getFilterIcon = (type: string) => {
    switch (type) {
      case 'all':
        return <Grid3X3 size={16} />;
      case 'ethereum':
        return <Palette size={16} />;
      case 'ens':
        return <Globe size={16} />;
      case 'poap':
        return <Award size={16} />;
      case '3dns':
        return <Hexagon size={16} />;
      default:
        return <Sparkles size={16} />;
    }
  };

  const filters = [
    {
      type: 'all' as const,
      label: 'All Collections',
      available: true
    },
    {
      type: 'ethereum' as const,
      label: 'NFTs',
      available: hasEthereumNfts
    },
    {
      type: 'ens' as const,
      label: 'ENS Domains',
      available: hasEnsNfts
    },
    {
      type: 'poap' as const,
      label: 'POAPs',
      available: hasPoapNfts
    },
    {
      type: '3dns' as const,
      label: '3DNS Domains',
      available: has3dnsNfts
    }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(({ type, label, available }) => {
        if (!available && type !== 'all') return null;
        
        return (
          <Button
            key={type}
            variant={selectedType === type ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => onTypeChange(type)}
            className={`flex items-center gap-2 transition-all ${
              selectedType === type 
                ? 'bg-white text-gray-900 shadow-sm border-white' 
                : 'bg-white/10 border-white/20 text-white/90 hover:bg-white/20 hover:text-white'
            }`}
          >
            {getFilterIcon(type)}
            <span className="text-xs font-medium">{label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default NftFilterControls;
