
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  // Icons for the filter buttons
  const ethereumIcon = "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=024";
  const ensIcon = "https://ens.domains/assets/brand/mark/ens-mark-Blue.svg";
  const poapIcon = "https://deficon.nyc/wp-content/uploads/2021/12/poap.png";
  const dns3Icon = "https://docs.my.box/~gitbook/image?url=https%3A%2F%2F1581571575-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLNPySatzgHa3v2j4Gmqn%252Fuploads%252F4HNwIbiFFE6Sd7H41SIL%252Fhex_black.png%3Falt%3Dmedia%26token%3D518e3a0f-2c02-484c-ac5b-23b7329f1176&width=376&dpr=2&quality=100&sign=c393b902&sv=2";
  const baseIcon = "https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue.png";

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 py-2 overflow-x-auto">
        <Button
          variant={selectedType === 'all' ? "default" : "outline"}
          size="sm"
          onClick={() => onTypeChange('all')}
          className="rounded-full text-xs whitespace-nowrap"
        >
          All Collections
        </Button>

        {hasEthereumNfts && (
          <Button
            variant={selectedType === 'ethereum' ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeChange('ethereum')}
            className="rounded-full text-xs whitespace-nowrap flex items-center"
          >
            <img src={ethereumIcon} alt="Ethereum" className="w-4 h-4 mr-2" />
            Ethereum NFTs
          </Button>
        )}

        {hasEnsNfts && (
          <Button
            variant={selectedType === 'ens' ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeChange('ens')}
            className="rounded-full text-xs whitespace-nowrap flex items-center"
          >
            <img src={ensIcon} alt="ENS" className="w-4 h-4 mr-2" />
            ENS Domains
          </Button>
        )}

        {hasPoapNfts && (
          <Button
            variant={selectedType === 'poap' ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeChange('poap')}
            className="rounded-full text-xs whitespace-nowrap flex items-center"
          >
            <img src={poapIcon} alt="POAP" className="w-4 h-4 mr-2" />
            POAPs
          </Button>
        )}

        {has3dnsNfts && (
          <Button
            variant={selectedType === '3dns' ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeChange('3dns')}
            className="rounded-full text-xs whitespace-nowrap flex items-center"
          >
            <img src={dns3Icon} alt="3DNS" className="w-4 h-4 mr-2" />
            3DNS Domains
          </Button>
        )}

        {hasBaseNfts && (
          <Button
            variant={selectedType === 'base' ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeChange('base')}
            className="rounded-full text-xs whitespace-nowrap flex items-center"
          >
            <img src={baseIcon} alt="Base" className="w-4 h-4 mr-2" />
            Base NFTs
          </Button>
        )}
      </div>
    </ScrollArea>
  );
};

export default NftFilterControls;
