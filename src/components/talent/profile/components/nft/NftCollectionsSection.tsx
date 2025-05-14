
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NftCollectionsContent from './NftCollectionsContent';
import { useWeb3 } from '@/hooks/useWeb3';
import { fetchNfts, type OpenSeaNft, type OpenSeaCollection } from '@/api/services/openseaService';
import { fetchPoapsByAddress } from '@/api/services/poapService';
import { getAllSkillNfts } from '@/api/services/nftService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSkillNftsByAddress } from '@/api/services/nftService';
import { Skeleton } from '@/components/ui/skeleton';

interface NftCollectionsSectionProps {
  walletAddress: string;
}

const NftCollectionsSection: React.FC<NftCollectionsSectionProps> = ({ walletAddress }) => {
  const [activeTab, setActiveTab] = useState('ethereum');
  const [collections, setCollections] = useState<OpenSeaCollection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { web3 } = useWeb3();
  
  useEffect(() => {
    const fetchNftCollections = async () => {
      if (!walletAddress) return;
      
      setIsLoading(true);
      try {
        // Fetch Ethereum NFTs
        const ethereumNfts = await fetchNfts(walletAddress, 'ethereum');
        
        // Group NFTs by collection (for Ethereum)
        const ethereumCollections = groupNftsByCollection(ethereumNfts, 'ethereum');
        
        // Fetch POAPs if on POAP tab
        let poapCollection: OpenSeaCollection[] = [];
        if (activeTab === 'poap') {
          const poaps = await fetchPoapsByAddress(walletAddress);
          if (poaps.length > 0) {
            poapCollection = [{
              name: 'POAPs',
              type: 'poap',
              nfts: poaps.map(poap => ({
                id: poap.tokenId,
                name: poap.event.name,
                description: poap.event.description,
                imageUrl: poap.event.image_url, 
                permalink: `https://collectors.poap.xyz/token/${poap.tokenId}`,
                collectionName: 'POAP'
              }))
            }];
          }
        }
        
        // Create Base NFT collection
        const baseNfts = [
          {
            id: 'base-1',
            name: 'Base NFT #1',
            description: 'Base Network NFT',
            image_url: 'https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue.png',
            permalink: 'https://opensea.io',
            collection: {
              name: 'Base NFTs',
              slug: 'base-nfts'
            },
            imageUrl: 'https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue.png',
            collectionName: 'Base NFTs'
          }
        ];
        
        const baseCollection = [{
          name: 'Base NFTs',
          type: 'base',
          nfts: baseNfts
        }];
        
        // Set the appropriate collections based on active tab
        if (activeTab === 'ethereum') {
          setCollections(ethereumCollections);
        } else if (activeTab === 'poap') {
          setCollections(poapCollection);
        } else if (activeTab === 'base') {
          setCollections(baseCollection);
        } else {
          // ENS/3DNS case - placeholder for now
          setCollections([]);
        }
        
      } catch (error) {
        console.error('Error fetching NFT collections:', error);
        setCollections([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNftCollections();
  }, [walletAddress, web3, activeTab]);
  
  // Group NFTs by their collection
  const groupNftsByCollection = (nfts: OpenSeaNft[], type: string): OpenSeaCollection[] => {
    const collectionMap = new Map<string, OpenSeaNft[]>();
    
    nfts.forEach(nft => {
      const collectionName = nft.collectionName || 'Other';
      if (!collectionMap.has(collectionName)) {
        collectionMap.set(collectionName, []);
      }
      collectionMap.get(collectionName)?.push(nft);
    });
    
    return Array.from(collectionMap.entries()).map(([name, nfts]) => ({
      name,
      type,
      nfts
    }));
  };
  
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          NFT Collections
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ethereum" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ethereum" className="flex items-center gap-1">
              <img src="https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/13c43/eth-diamond-black.png" className="w-4 h-4" alt="Ethereum" />
              <span>NFTs</span>
            </TabsTrigger>
            <TabsTrigger value="base" className="flex items-center gap-1">
              <img src="https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue.png" className="w-4 h-4" alt="Base" />
              <span>Base</span>
            </TabsTrigger>
            <TabsTrigger value="poap" className="flex items-center gap-1">
              <img src="https://poap.xyz/favicon-32x32.png" className="w-4 h-4" alt="POAP" />
              <span>POAPs</span>
            </TabsTrigger>
            <TabsTrigger value="ens" className="flex items-center gap-1">
              <img src="https://app.ens.domains/favicon-32x32.png" className="w-4 h-4" alt="ENS" />
              <span>Domains</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ethereum">
            {isLoading ? (
              <div className="mt-4 space-y-4">
                <Skeleton className="h-48 w-full" />
              </div>
            ) : (
              <NftCollectionsContent collections={collections} />
            )}
          </TabsContent>
          
          <TabsContent value="base">
            {isLoading ? (
              <div className="mt-4 space-y-4">
                <Skeleton className="h-48 w-full" />
              </div>
            ) : (
              <NftCollectionsContent collections={collections} />
            )}
          </TabsContent>
          
          <TabsContent value="poap">
            {isLoading ? (
              <div className="mt-4 space-y-4">
                <Skeleton className="h-48 w-full" />
              </div>
            ) : (
              <NftCollectionsContent collections={collections} />
            )}
          </TabsContent>
          
          <TabsContent value="ens">
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Coming soon: ENS and DNS domain collections</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NftCollectionsSection;
