
import React from 'react';

interface CollectionHeaderProps {
  collectionName: string;
  chain?: string;
}

const CollectionHeader: React.FC<CollectionHeaderProps> = ({ collectionName, chain }) => {
  // Format collection name - replace dashes with spaces
  const formatCollectionName = (name: string) => {
    return name.replace(/-/g, ' ');
  };

  // Get collection icon based on collection name
  const getCollectionIcon = (collectionName: string) => {
    const lowerCaseName = collectionName.toLowerCase();
    if (lowerCaseName.includes('doodle') || lowerCaseName.includes('doodles')) {
      return "https://pbs.twimg.com/profile_images/1907827518700220416/ZUn7WAT8_400x400.jpg";
    } else if (lowerCaseName.includes('ens')) {
      return "https://ens.domains/assets/brand/mark/ens-mark-Blue.svg";
    } else if (lowerCaseName.includes('poap')) {
      return "https://deficon.nyc/wp-content/uploads/2021/12/poap.png";
    } else if (lowerCaseName.includes('efp') || lowerCaseName.includes('ethereum follow protocol')) {
      return "https://pbs.twimg.com/profile_images/1746632341378715649/XOOa7TZO_400x400.jpg";
    }
    return "https://cdn-icons-png.flaticon.com/512/6699/6699362.png";
  };

  // Get chain icon
  const getChainIcon = (chain?: string) => {
    if (!chain) return null;
    
    switch(chain.toLowerCase()) {
      case 'ethereum':
        return "https://www.citypng.com/public/uploads/preview/ethereum-eth-round-logo-icon-png-701751694969815akblwl2552.png";
      case 'base':
        return "https://cryptologos.cc/logos/base-logo.svg";
      case 'optimism':
        return "https://altcoinsbox.com/wp-content/uploads/2023/03/optimism-logo-600x600.webp";
      case 'polygon':
        return "https://altcoinsbox.com/wp-content/uploads/2023/03/matic-logo-600x600.webp";
      default:
        return null;
    }
  };

  const chainIcon = getChainIcon(chain);

  return (
    <div className="flex items-center gap-2 pl-1">
      <img 
        src={getCollectionIcon(collectionName)} 
        alt={collectionName} 
        className="h-5 w-5 rounded-full" 
      />
      <h4 className="text-md font-medium text-gray-800">{formatCollectionName(collectionName)}</h4>
      {chainIcon && (
        <img 
          src={chainIcon} 
          alt={chain} 
          className="h-4 w-4 ml-1" 
        />
      )}
    </div>
  );
};

export default CollectionHeader;
