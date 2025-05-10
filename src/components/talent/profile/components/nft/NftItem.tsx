
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface NftItemProps {
  name: string;
  imageUrl: string;
  onClick: () => void;
  count?: number; // Add count property to show how many of this NFT the user owns
  isLoading?: boolean;
}

const NftItem: React.FC<NftItemProps> = ({ name, imageUrl, onClick, count = 1, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="overflow-hidden cursor-pointer">
        <Skeleton className="h-40 w-full" />
        <CardContent className="p-3">
          <Skeleton className="h-5 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-md transition-all" 
      onClick={onClick}
    >
      <div className="relative group">
        <div className="h-40 overflow-hidden flex items-center justify-center bg-gray-100">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              No Image
            </div>
          )}
          
          {/* Show count badge if user owns multiple */}
          {count > 1 && (
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
              {count}x
            </div>
          )}
        </div>
        
        <CardContent className="p-3">
          <p className="text-sm font-medium truncate" title={name}>
            {name || "Unnamed NFT"}
          </p>
        </CardContent>
      </div>
    </Card>
  );
};

export default NftItem;
