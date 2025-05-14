
import React from 'react';
import { Button } from "@/components/ui/button";

interface NftFilterControlsProps {
  selectedType: 'ethereum' | 'ens' | 'poap' | 'base' | '3dns' | 'all';
  onTypeChange: (type: 'ethereum' | 'ens' | 'poap' | 'base' | '3dns' | 'all') => void;
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
  const buttonClass = (type: typeof selectedType) => 
    `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
      selectedType === type 
        ? 'bg-primary text-white' 
        : 'bg-muted hover:bg-muted/80 text-muted-foreground'
    }`;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button 
        onClick={() => onTypeChange('all')} 
        className={buttonClass('all')}
        variant={selectedType === 'all' ? 'default' : 'outline'}
      >
        All
      </Button>
      
      {hasEthereumNfts && (
        <Button 
          onClick={() => onTypeChange('ethereum')} 
          className={buttonClass('ethereum')}
          variant={selectedType === 'ethereum' ? 'default' : 'outline'}
        >
          <img 
            src="https://cdn-icons-png.flaticon.com/512/6699/6699362.png" 
            alt="NFTs" 
            className="h-4 w-4" 
          />
          NFTs
        </Button>
      )}
      
      {hasEnsNfts && (
        <Button 
          onClick={() => onTypeChange('ens')} 
          className={buttonClass('ens')}
          variant={selectedType === 'ens' ? 'default' : 'outline'}
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
          className={buttonClass('poap')}
          variant={selectedType === 'poap' ? 'default' : 'outline'}
        >
          <img 
            src="https://deficon.nyc/wp-content/uploads/2021/12/poap.png" 
            alt="POAP" 
            className="h-4 w-4" 
          />
          POAP
        </Button>
      )}
      
      {has3dnsNfts && (
        <Button 
          onClick={() => onTypeChange('3dns')} 
          className={buttonClass('3dns')}
          variant={selectedType === '3dns' ? 'default' : 'outline'}
        >
          <img 
            src="https://docs.my.box/~gitbook/image?url=https%3A%2F%2F1581571575-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLNPySatzgHa3v2j4Gmqn%252Fuploads%252F4HNwIbiFFE6Sd7H41SIL%252Fhex_black.png%3Falt%3Dmedia%26token%3D518e3a0f-2c02-484c-ac5b-23b7329f1176&width=376&dpr=2&quality=100&sign=c393b902&sv=2" 
            alt="3DNS" 
            className="h-4 w-4" 
          />
          3DNS
        </Button>
      )}
      
      {hasBaseNfts && (
        <Button 
          onClick={() => onTypeChange('base')} 
          className={buttonClass('base')}
          variant={selectedType === 'base' ? 'default' : 'outline'}
        >
          <img 
            src="https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue.png" 
            alt="Base" 
            className="h-4 w-4" 
          />
          Base
        </Button>
      )}
    </div>
  );
};

export default NftFilterControls;
