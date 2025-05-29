
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CollectionHeaderProps {
  collectionName: string;
}

const CollectionHeader: React.FC<CollectionHeaderProps> = ({ collectionName }) => {
  // Format collection name - replace dashes with spaces
  const formatCollectionName = (name: string) => {
    return name.replace(/-/g, ' ');
  };

  // Get collection icon based on collection name
  const getCollectionIcon = (collectionName: string) => {
    const lowerCaseName = collectionName.toLowerCase();
    if (lowerCaseName.includes('3dns') || lowerCaseName.includes('3dns powered domains')) {
      return "https://docs.my.box/~gitbook/image?url=https%3A%2F%2F1581571575-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLNPySatzgHa3v2j4Gmqn%252Fuploads%252F4HNwIbiFFE6Sd7H41SIL%252Fhex_black.png%3Falt%3Dmedia%26token%3D518e3a0f-2c02-484c-ac5b-23b7329f1176&width=376&dpr=2&quality=100&sign=c393b902&sv=2";
    } else if (lowerCaseName.includes('doodle') || lowerCaseName.includes('doodles')) {
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

  // Get display name for the collection
  const getDisplayName = (collectionName: string) => {
    const lowerCaseName = collectionName.toLowerCase();
    if (lowerCaseName.includes('3dns') || lowerCaseName.includes('3dns powered domains')) {
      return "3DNS Domains";
    }
    return formatCollectionName(collectionName);
  };

  // Get collection type badge
  const getTypeBadge = (collectionName: string) => {
    const lowerCaseName = collectionName.toLowerCase();
    if (lowerCaseName.includes('ens')) {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">ENS</Badge>;
    } else if (lowerCaseName.includes('poap')) {
      return <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">POAP</Badge>;
    } else if (lowerCaseName.includes('3dns')) {
      return <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">3DNS</Badge>;
    }
    return <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">NFT</Badge>;
  };

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img 
            src={getCollectionIcon(collectionName)} 
            alt={collectionName} 
            className="h-8 w-8 rounded-xl object-cover shadow-sm" 
          />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
            {getDisplayName(collectionName)}
          </h4>
        </div>
      </div>
      {getTypeBadge(collectionName)}
    </div>
  );
};

export default CollectionHeader;
