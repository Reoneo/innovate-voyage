
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSkillNftsByAddress } from '@/api/services/nftService';

interface NftCollectionsSectionProps {
  walletAddress: string;
}

const NftCollectionsSection: React.FC<NftCollectionsSectionProps> = ({ walletAddress }) => {
  const { data: nfts, isLoading } = useQuery({
    queryKey: ['nfts', walletAddress],
    queryFn: () => getSkillNftsByAddress(walletAddress),
    enabled: !!walletAddress,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!nfts?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            NFT Collections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No NFTs found</p>
        </CardContent>
      </Card>
    );
  }

  // Group NFTs by collection
  const nftsByCollection = nfts.reduce((acc, nft) => {
    const collectionName = nft.collectionName || 'Unnamed Collection';
    if (!acc[collectionName]) {
      acc[collectionName] = [];
    }
    acc[collectionName].push(nft);
    return acc;
  }, {} as Record<string, typeof nfts>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          NFT Collections ({Object.keys(nftsByCollection).length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {Object.entries(nftsByCollection).map(([collection, collectionNfts]) => (
              <div key={collection} className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">{collection} ({collectionNfts.length})</h3>
                <div className="space-y-2">
                  {collectionNfts.map((nft) => (
                    <div key={nft.tokenId} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <h4 className="font-medium">{nft.name}</h4>
                        <p className="text-sm text-muted-foreground">#{nft.tokenId}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NftCollectionsSection;
