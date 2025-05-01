
import React from 'react';
import { OpenSeaNft } from '@/api/services/openseaService';
import NftItem from './NftItem';

interface NftCollectionCardProps {
  collectionName: string;
  nfts: OpenSeaNft[];
  onNftClick: (nft: OpenSeaNft) => void;
}

const NftCollectionCard: React.FC<NftCollectionCardProps> = ({ 
  collectionName, 
  nfts,
  onNftClick 
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

  return (
    <div key={collectionName} className="space-y-3">
      <div className="flex items-center gap-2 pl-1">
        <img 
          src={getCollectionIcon(collectionName)} 
          alt={collectionName} 
          className="h-5 w-5 rounded-full" 
        />
        <h4 className="text-md font-medium text-gray-800">{formatCollectionName(collectionName)}</h4>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {nfts.map((nft) => (
          <NftItem 
            key={nft.id} 
            nft={nft} 
            onClick={onNftClick} 
          />
        ))}
      </div>
    </div>
  );
};

export default NftCollectionCard;
