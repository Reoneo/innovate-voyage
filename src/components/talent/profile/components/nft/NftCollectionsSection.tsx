
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from '@tanstack/react-query';

interface NftCollectionsSectionProps {
  walletAddress: string;
  showCollections: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NftCollectionsSection: React.FC<NftCollectionsSectionProps> = ({
  walletAddress,
  showCollections,
  onOpenChange,
}) => {
  const fetchNFTs = async () => {
    try {
      const response = await fetch(`/api/nfts/${walletAddress}`);
      if (!response.ok) throw new Error('Failed to fetch NFTs');
      return await response.json();
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      return { collections: [] };
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['nfts', walletAddress],
    queryFn: fetchNFTs,
    enabled: showCollections,
  });

  return (
    <Dialog open={showCollections} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <img 
              src="https://storage.googleapis.com/opensea-static/Logomark/Logomark-White.png" 
              alt="OpenSea" 
              className="h-8 w-8 bg-blue-600 p-1 rounded-md"
            />
            <DialogTitle>NFT Collections</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[70vh]">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
              <p className="mt-4 text-gray-500">Loading NFT collections...</p>
            </div>
          ) : (data?.collections?.length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {data.collections.map((collection: any) => (
                <div 
                  key={collection.slug} 
                  className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                  <div 
                    className="h-40 bg-gray-100 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${collection.image_url || 'https://via.placeholder.com/300x150?text=No+Image'})` }}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-medium truncate">{collection.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {collection.owned_asset_count} {collection.owned_asset_count === 1 ? 'item' : 'items'}
                    </p>
                    <a 
                      href={`https://opensea.io/collection/${collection.slug}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm text-blue-500 hover:text-blue-600"
                    >
                      View on OpenSea
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No NFT collections found for this wallet.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
