
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import NftCollectionsContent from './NftCollectionsContent';
import { useToast } from '@/hooks/use-toast';
import { fetchCollections } from '@/api/services/openseaService';

interface NftCollectionsSectionProps {
  walletAddress: string;
  showCollections: boolean;
  onOpenChange: (show: boolean) => void;
}

// Define types for NFT collections
interface OpenSeaNft {
  id: string;
  name?: string;
  imageUrl?: string;
  collectionName?: string;
  description?: string;
  permalink?: string;
  traits?: Array<{ trait_type: string; value: string }>;
}

interface OpenSeaCollection {
  slug: string;
  name: string;
  image_url: string;
  description: string;
  external_url: string;
  banner_image_url: string;
  featured_image_url: string;
  twitter_username?: string;
  discord_url?: string;
  stats: {
    total_supply: number;
    num_owners: number;
    floor_price: number;
  };
  primary_asset_contracts?: Array<{
    address: string;
    name: string;
    symbol: string;
  }>;
  nfts?: OpenSeaNft[];
  chainId?: number;
  floorPrice?: number;
}

export type { OpenSeaNft, OpenSeaCollection };

const NftCollectionsSection: React.FC<NftCollectionsSectionProps> = ({
  walletAddress,
  showCollections,
  onOpenChange
}) => {
  const [collections, setCollections] = useState<OpenSeaCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadCollections = async () => {
      if (!walletAddress || !showCollections) return;
      
      setLoading(true);
      try {
        const fetchedCollections = await fetchCollections(walletAddress);
        
        // Process collections to ensure they have the fields we need
        const processedCollections = fetchedCollections.map((collection: any) => ({
          ...collection,
          name: collection.name || 'Unnamed Collection',
          collectionName: collection.name || 'Unnamed Collection', // Add the missing field
          floorPrice: collection.stats?.floor_price || 0
        }));
        
        setCollections(processedCollections);
      } catch (error) {
        console.error('Error loading NFT collections:', error);
        toast({
          variant: 'destructive',
          title: 'Error loading NFTs',
          description: 'Failed to load NFT collections. Please try again later.'
        });
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };

    loadCollections();
  }, [walletAddress, showCollections, toast]);

  // Add Base logo to the collections with Base chainId
  const baseLogoUrl = "https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue.png";
  
  // Helper function to process an NFT for display
  const processNftForDisplay = (nft: any): OpenSeaNft => {
    return {
      id: nft.id || nft.token_id || `nft-${Math.random().toString(36).substr(2, 9)}`,
      name: nft.name || 'Unnamed NFT',
      imageUrl: nft.image_url || nft.image || '',
      collectionName: nft.collection?.name || 'Unknown Collection',
      description: nft.description || '',
      permalink: nft.permalink || '',
      traits: nft.traits || []
    };
  };

  return (
    <Dialog open={showCollections} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <NftCollectionsContent 
          collections={collections} 
          loading={loading}
          baseLogoUrl={baseLogoUrl}
          processNftForDisplay={processNftForDisplay}
        />
      </DialogContent>
    </Dialog>
  );
};

export { NftCollectionsSection };
