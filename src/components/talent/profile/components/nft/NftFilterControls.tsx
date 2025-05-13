
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NftFilterControlsProps {
  selectedType: 'ethereum' | 'ens' | 'poap' | '3dns' | 'base' | 'all';
  onTypeChange: (type: 'ethereum' | 'ens' | 'poap' | '3dns' | 'base' | 'all') => void;
  hasEthereumNfts: boolean;
  hasEnsNfts: boolean;
  hasPoapNfts: boolean;
  has3dnsNfts: boolean;
  hasBaseNfts: boolean;
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
  const renderIcon = (type: string) => {
    switch (type) {
      case 'ethereum':
        return (
          <img 
            src="https://cdn-icons-png.flaticon.com/512/6699/6699362.png"
            alt="Ethereum"
            className="w-4 h-4 mr-1" 
          />
        );
      case 'ens':
        return (
          <img 
            src="https://ens.domains/assets/brand/token-icon.svg"
            alt="ENS" 
            className="w-4 h-4 mr-1" 
          />
        );
      case 'poap':
        return (
          <img 
            src="https://deficon.nyc/wp-content/uploads/2021/12/poap.png"
            alt="POAP" 
            className="w-4 h-4 mr-1" 
          />
        );
      case '3dns':
        return (
          <img 
            src="https://docs.my.box/~gitbook/image?url=https%3A%2F%2F1581571575-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLNPySatzgHa3v2j4Gmqn%252Fuploads%252F4HNwIbiFFE6Sd7H41SIL%252Fhex_black.png%3Falt%3Dmedia%26token%3D518e3a0f-2c02-484c-ac5b-23b7329f1176"
            alt="3DNS"
            className="w-4 h-4 mr-1"
          />
        );
      case 'base':
        return (
          <img
            src="https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue.png"
            alt="Base"
            className="w-4 h-4 mr-1"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-4 pt-2">
      <Tabs 
        value={selectedType} 
        onValueChange={(value) => onTypeChange(value as any)}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 gap-1">
          <TabsTrigger value="all" className="text-xs py-1.5">
            All
          </TabsTrigger>
          
          {hasEthereumNfts && (
            <TabsTrigger value="ethereum" className="text-xs py-1.5 flex items-center justify-center">
              {renderIcon('ethereum')} NFTs
            </TabsTrigger>
          )}
          
          {hasEnsNfts && (
            <TabsTrigger value="ens" className="text-xs py-1.5 flex items-center justify-center">
              {renderIcon('ens')} ENS
            </TabsTrigger>
          )}
          
          {hasBaseNfts && (
            <TabsTrigger value="base" className="text-xs py-1.5 flex items-center justify-center">
              {renderIcon('base')} Base
            </TabsTrigger>
          )}
          
          {has3dnsNfts && (
            <TabsTrigger value="3dns" className="text-xs py-1.5 flex items-center justify-center">
              {renderIcon('3dns')} 3DNS
            </TabsTrigger>
          )}
          
          {hasPoapNfts && (
            <TabsTrigger value="poap" className="text-xs py-1.5 flex items-center justify-center">
              {renderIcon('poap')} POAP
            </TabsTrigger>
          )}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default NftFilterControls;
