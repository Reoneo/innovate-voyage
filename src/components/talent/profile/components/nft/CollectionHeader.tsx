
import React from 'react';

interface CollectionHeaderProps {
  collectionName: string;
  customImage?: string | null;
  network?: string;
  getNetworkIcon?: (network: string) => React.ReactNode;
}

const CollectionHeader: React.FC<CollectionHeaderProps> = ({ 
  collectionName,
  customImage,
  network,
  getNetworkIcon
}) => {
  return (
    <div className="flex items-center space-x-2">
      {customImage && (
        <img 
          src={customImage} 
          alt={collectionName} 
          className="h-6 w-6 rounded-full"
        />
      )}
      <h3 className="text-lg font-semibold flex items-center">
        <span>{collectionName}</span>
        {network && getNetworkIcon && (
          <span className="ml-2 flex items-center text-sm text-gray-600">
            {getNetworkIcon(network)}
            <span>{network}</span>
          </span>
        )}
      </h3>
    </div>
  );
};

export default CollectionHeader;
