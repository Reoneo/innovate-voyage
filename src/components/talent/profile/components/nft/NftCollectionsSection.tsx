
import React, { useEffect, useState } from 'react';
import { fetchUserNfts, type OpenSeaNft } from '@/api/services/openseaService';
import { Card, CardContent } from '@/components/ui/card';
import { Ethereum } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface NftCollectionsSectionProps {
  walletAddress?: string;
}

export const NftCollectionsSection: React.FC<NftCollectionsSectionProps> = ({ walletAddress }) => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!walletAddress) return;

    const loadNfts = async () => {
      setLoading(true);
      try {
        const nftCollections = await fetchUserNfts(walletAddress);
        setCollections(nftCollections);
      } catch (error) {
        console.error('Error loading NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNfts();
  }, [walletAddress]);

  if (!walletAddress) return null;
  if (loading) {
    return <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>;
  }

  if (collections.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <img 
          src="https://storage.googleapis.com/opensea-static/Logomark/Logomark-White.png"
          alt="OpenSea"
          className="h-6 w-6"
        />
        <h3 className="text-lg font-semibold">NFT Collections</h3>
      </div>

      <div className="space-y-6">
        {collections.map((collection) => (
          <Card key={collection.name} className="overflow-hidden">
            <CardContent className="p-4">
              <h4 className="text-md font-medium mb-3 flex items-center gap-2">
                <Ethereum className="h-4 w-4" />
                {collection.name}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {collection.nfts.map((nft: OpenSeaNft) => (
                  <div key={nft.id} className="relative group">
                    <img 
                      src={nft.imageUrl} 
                      alt={nft.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-2">
                      <div className="text-white text-sm">
                        <p className="font-medium">{nft.name}</p>
                        {nft.bestOffer && (
                          <p className="text-xs">Best offer: {nft.bestOffer} ETH</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
