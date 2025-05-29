
import React from 'react';
import { Button } from '@/components/ui/button';
import { Palette, Globe, Award, Hexagon, Grid3X3 } from 'lucide-react';

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
      case 'all': return <Grid3X3 size={16} />;
      case 'ethereum': return <Palette size={16} />;
      case 'ens': return <Globe size={16} />;
      case 'poap': return <Award size={16} />;
      case '3dns': return <Hexagon size={16} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedType === 'all' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onTypeChange('all')}
        className={`rounded-full transition-all duration-200 ${
          selectedType === 'all' 
            ? 'bg-white/30 text-white hover:bg-white/40 backdrop-blur-sm border border-white/30' 
            : 'text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm'
        }`}
      >
        {getFilterIcon('all')}
        All Collections
      </Button>
      
      {hasEthereumNfts && (
        <Button
          variant={selectedType === 'ethereum' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onTypeChange('ethereum')}
          className={`rounded-full transition-all duration-200 ${
            selectedType === 'ethereum' 
              ? 'bg-white/30 text-white hover:bg-white/40 backdrop-blur-sm border border-white/30' 
              : 'text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm'
          }`}
        >
          {getFilterIcon('ethereum')}
          NFTs
        </Button>
      )}
      
      {hasEnsNfts && (
        <Button
          variant={selectedType === 'ens' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onTypeChange('ens')}
          className={`rounded-full transition-all duration-200 ${
            selectedType === 'ens' 
              ? 'bg-white/30 text-white hover:bg-white/40 backdrop-blur-sm border border-white/30' 
              : 'text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm'
          }`}
        >
          {getFilterIcon('ens')}
          ENS
        </Button>
      )}
      
      {hasPoapNfts && (
        <Button
          variant={selectedType === 'poap' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onTypeChange('poap')}
          className={`rounded-full transition-all duration-200 ${
            selectedType === 'poap' 
              ? 'bg-white/30 text-white hover:bg-white/40 backdrop-blur-sm border border-white/30' 
              : 'text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm'
          }`}
        >
          {getFilterIcon('poap')}
          POAPs
        </Button>
      )}
      
      {has3dnsNfts && (
        <Button
          variant={selectedType === '3dns' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onTypeChange('3dns')}
          className={`rounded-full transition-all duration-200 ${
            selectedType === '3dns' 
              ? 'bg-white/30 text-white hover:bg-white/40 backdrop-blur-sm border border-white/30' 
              : 'text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm'
          }`}
        >
          {getFilterIcon('3dns')}
          3DNS Domains
        </Button>
      )}
    </div>
  );
};

export default NftFilterControls;
