
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CollectionHeaderProps {
  collectionName: string;
  network?: string;
}

const CollectionHeader: React.FC<CollectionHeaderProps> = ({ 
  collectionName,
  network = 'ethereum'
}) => {
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
  
  // Get network icon and name
  const getNetworkDetails = (networkId: string) => {
    switch(networkId?.toLowerCase()) {
      case 'ethereum':
      case 'eth':
      case '1':
        return {
          icon: "https://www.citypng.com/public/uploads/preview/ethereum-eth-round-logo-icon-png-701751694969815akblwl2552.png",
          name: "Ethereum"
        };
      case 'polygon':
      case 'matic':
      case '137':
        return {
          icon: "https://cryptologos.cc/logos/polygon-matic-logo.png",
          name: "Polygon"
        };
      case 'optimism':
      case 'op':
      case '10':
        return {
          icon: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png", 
          name: "Optimism"
        };
      case 'arbitrum':
      case 'arb':
      case '42161':
        return {
          icon: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
          name: "Arbitrum"
        };
      case 'base':
      case '8453':
        return {
          icon: "https://cryptologos.cc/logos/base-logo.png",
          name: "Base"
        };
      default:
        return {
          icon: "https://www.citypng.com/public/uploads/preview/ethereum-eth-round-logo-icon-png-701751694969815akblwl2552.png",
          name: "Ethereum"
        };
    }
  };
  
  const networkDetails = getNetworkDetails(network);

  return (
    <div className="flex items-center justify-between pl-1">
      <div className="flex items-center gap-2">
        <img 
          src={getCollectionIcon(collectionName)} 
          alt={collectionName} 
          className="h-5 w-5 rounded-full" 
        />
        <h4 className="text-md font-medium text-gray-800">{formatCollectionName(collectionName)}</h4>
      </div>
      
      {/* Network badge */}
      <Badge variant="outline" className="flex items-center gap-1 py-1">
        <img 
          src={networkDetails.icon} 
          alt={networkDetails.name} 
          className="h-4 w-4" 
        />
        <span className="text-xs">{networkDetails.name}</span>
      </Badge>
    </div>
  );
};

export default CollectionHeader;
