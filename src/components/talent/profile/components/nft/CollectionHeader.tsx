
import React from 'react';
import { formatNumber } from '@/lib/utils';

interface CollectionHeaderProps {
  name: string;
  imageUrl?: string;
  floorPrice?: number;
  totalSupply?: number;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  chainId?: number;
  baseLogoUrl?: string;
}

const CollectionHeader: React.FC<CollectionHeaderProps> = ({
  name,
  imageUrl,
  floorPrice,
  totalSupply,
  description,
  selected,
  onClick,
  chainId,
  baseLogoUrl
}) => {
  // Check if this collection is on Base chain (chainId 8453)
  const isBaseChain = chainId === 8453;
  
  // Truncate description for display
  const truncatedDescription = description && description.length > 100
    ? `${description.substring(0, 100)}...`
    : description;

  return (
    <div
      className={`border rounded-lg overflow-hidden transition-all cursor-pointer hover:shadow-md ${
        selected ? 'ring-2 ring-primary shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative h-40 bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/e5e7eb/a1a1aa?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
            No Image Available
          </div>
        )}
        {isBaseChain && baseLogoUrl && (
          <div className="absolute top-2 right-2 h-6 w-6 bg-white rounded-full p-0.5 shadow">
            <img src={baseLogoUrl} alt="Base Network" className="w-full h-full" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-base truncate">{name}</h3>
        
        <div className="mt-2 flex justify-between text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Floor</p>
            <p className="font-medium">
              {floorPrice ? `${floorPrice} ETH` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Supply</p>
            <p className="font-medium">
              {totalSupply ? formatNumber(totalSupply) : 'N/A'}
            </p>
          </div>
        </div>
        
        {truncatedDescription && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {truncatedDescription}
          </p>
        )}
      </div>
    </div>
  );
};

export default CollectionHeader;
