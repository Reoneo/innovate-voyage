
// Export service functionality from actual implementation file
export * from '../nftService';

// Add the missing properties to fix type errors
export interface OpenSeaNft {
  name: string;
  description: string;
  image_url: string;
  collection_name?: string;
  permalink?: string;
  token_standard?: string;
  metadata?: any;
  
  // Add the missing properties referenced in the components
  id?: string;
  chain?: string;
  owner?: {
    address?: string;
    display_name?: string;
    profile_img_url?: string;
    username?: string;
  };
  currentPrice?: {
    amount: string;
    currency: string;
  };
  bestOffer?: {
    amount: string;
    currency: string;
  };
  count?: number;
}
