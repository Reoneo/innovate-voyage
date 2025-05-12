
import { OpenSeaNft } from '@/api/services/openseaService';

export interface OpenSeaCollection {
  name: string;
  nfts: OpenSeaNft[];
  type: 'ethereum' | 'ens' | 'poap' | '3dns' | 'base';
}

export interface NftCollectionsSectionProps {
  walletAddress?: string;
  showCollections?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface NftCollectionsContentProps {
  collections: OpenSeaCollection[];
  loading: boolean;
  selectedType: 'ethereum' | 'ens' | 'poap' | '3dns' | 'base' | 'all';
  setSelectedType: (type: 'ethereum' | 'ens' | 'poap' | '3dns' | 'base' | 'all') => void;
  onNftClick: (nft: OpenSeaNft) => void;
}

export interface NftCollectionCardProps {
  collectionName: string;
  nfts: OpenSeaNft[];
  onNftClick: (nft: OpenSeaNft) => void;
}

export interface NftGridProps {
  nfts: OpenSeaNft[];
  onNftClick: (nft: OpenSeaNft & { count?: number }) => void;
}

export interface NftItemProps {
  nft: OpenSeaNft & { count?: number };
  onClick: (nft: OpenSeaNft & { count?: number }) => void;
}

export interface CollectionHeaderProps {
  collectionName: string;
}
