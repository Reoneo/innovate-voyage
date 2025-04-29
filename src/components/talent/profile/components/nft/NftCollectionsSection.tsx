import React, { useEffect, useState } from 'react';
import { fetchUserNfts, type OpenSeaNft } from '@/api/services/openseaService';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
interface NftCollectionsSectionProps {
  walletAddress?: string;
}
export const NftCollectionsSection: React.FC<NftCollectionsSectionProps> = ({
  walletAddress
}) => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCollections, setShowCollections] = useState(false);
  const [selectedType, setSelectedType] = useState<'ethereum' | 'ens' | 'poap' | 'all'>('all');
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
  const filteredCollections = selectedType === 'all' ? collections : collections.filter(collection => collection.type === selectedType);
  const hasNfts = collections.length > 0;
  const hasEthereumNfts = collections.some(c => c.type === 'ethereum');
  const hasEnsNfts = collections.some(c => c.type === 'ens');
  const hasPoapNfts = collections.some(c => c.type === 'poap');
  return <>
      <div className="flex justify-center gap-3 mt-4">
        {hasEthereumNfts && <Button onClick={() => {
        setSelectedType('ethereum');
        setShowCollections(true);
      }} variant="outline" size="icon" className="h-10 w-10 rounded-full" title="View NFT Collections">
            <img src="https://cdn-icons-png.flaticon.com/512/6699/6699362.png" alt="NFT" className="h-6 w-6" />
          </Button>}
        
        {hasEnsNfts && <Button onClick={() => {
        setSelectedType('ens');
        setShowCollections(true);
      }} variant="outline" size="icon" className="h-10 w-10 rounded-full" title="View ENS Collection">
            <img src="https://ens.domains/assets/brand/mark/ens-mark-Blue.svg" alt="ENS" className="h-6 w-6" />
          </Button>}
        
        {hasPoapNfts && <Button onClick={() => {
        setSelectedType('poap');
        setShowCollections(true);
      }} variant="outline" size="icon" className="h-10 w-10 rounded-full" title="View POAP Collection">
            <img src="https://deficon.nyc/wp-content/uploads/2021/12/poap.png" alt="POAP" className="h-6 w-6" />
          </Button>}

        {hasNfts && collections.length > 1 && <Button onClick={() => {
        setSelectedType('all');
        setShowCollections(true);
      }} variant="outline" size="icon" className="h-10 w-10 rounded-full" title="View All Collections">
            <span className="text-xs font-bold">All</span>
          </Button>}
      </div>

      <Dialog open={showCollections} onOpenChange={setShowCollections}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          

          <div className="flex gap-2 mb-4">
            <Button onClick={() => setSelectedType('all')} variant={selectedType === 'all' ? "default" : "outline"} size="sm">
              All
            </Button>
            {hasEthereumNfts && <Button onClick={() => setSelectedType('ethereum')} variant={selectedType === 'ethereum' ? "default" : "outline"} size="sm" className="flex items-center gap-1">
                <img src="https://cdn-icons-png.flaticon.com/512/6699/6699362.png" alt="NFT" className="h-4 w-4" />
                NFTs
              </Button>}
            {hasEnsNfts && <Button onClick={() => setSelectedType('ens')} variant={selectedType === 'ens' ? "default" : "outline"} size="sm" className="flex items-center gap-1">
                <img src="https://ens.domains/assets/brand/mark/ens-mark-Blue.svg" alt="ENS" className="h-4 w-4" />
                ENS
              </Button>}
            {hasPoapNfts && <Button onClick={() => setSelectedType('poap')} variant={selectedType === 'poap' ? "default" : "outline"} size="sm" className="flex items-center gap-1">
                <img src="https://deficon.nyc/wp-content/uploads/2021/12/poap.png" alt="POAP" className="h-4 w-4" />
                POAP
              </Button>}
          </div>

          {loading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div> : filteredCollections.length > 0 ? <div className="space-y-6">
              {filteredCollections.map(collection => <Card key={collection.name} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {collection.type === 'ethereum' && <img src="https://cdn-icons-png.flaticon.com/512/6699/6699362.png" alt="NFT" className="h-5 w-5" />}
                      {collection.type === 'ens' && <img src="https://ens.domains/assets/brand/mark/ens-mark-Blue.svg" alt="ENS" className="h-5 w-5" />}
                      {collection.type === 'poap' && <img src="https://deficon.nyc/wp-content/uploads/2021/12/poap.png" alt="POAP" className="h-5 w-5" />}
                      <h4 className="text-md font-medium">{collection.name}</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {collection.nfts.map((nft: OpenSeaNft) => <div key={nft.id} className="relative group">
                          <img src={nft.imageUrl} alt={nft.name} className="w-full h-32 object-cover rounded-lg" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-2">
                            <div className="text-white text-sm">
                              <p className="font-medium">{nft.name}</p>
                              {nft.bestOffer && <p className="text-xs">Best offer: {nft.bestOffer} ETH</p>}
                            </div>
                          </div>
                        </div>)}
                    </div>
                  </CardContent>
                </Card>)}
            </div> : <div className="text-center p-8">
              <p className="text-muted-foreground">No NFTs found for this category</p>
            </div>}
        </DialogContent>
      </Dialog>
    </>;
};