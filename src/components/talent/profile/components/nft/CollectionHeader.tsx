
import React from 'react';

interface CollectionHeaderProps {
  name: string;
  icon: string;
  count: number;
  type: 'ethereum' | 'ens' | 'poap' | 'base';
}

const CollectionHeader: React.FC<CollectionHeaderProps> = ({ name, icon, count, type }) => {
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'ethereum':
        return 'Ethereum NFT';
      case 'ens':
        return 'ENS Names';
      case 'poap':
        return 'POAP Collection';
      case 'base':
        return 'Base NFT';
      default:
        return 'NFT Collection';
    }
  };

  return (
    <div className="px-4 py-3 border-b flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img 
          src={icon} 
          alt={name} 
          className="w-8 h-8 object-contain rounded-md"
          style={{
            background: type === 'ens' || type === 'base' ? 'white' : 'transparent'
          }}
        />
        <div>
          <h3 className="font-medium text-gray-800 line-clamp-1">{name}</h3>
          <p className="text-xs text-gray-500">
            {getTypeLabel()} · {formatNumber(count)} item{count !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CollectionHeader;
