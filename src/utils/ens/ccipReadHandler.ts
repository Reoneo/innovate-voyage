
import { mainnetProvider } from '../ethereumProviders';

export interface ResolveDotBitResult {
  address: string;
  owner?: string;
  avatar?: string;
  socials?: Record<string, string>;
}

/**
 * Implementation of CCIP-Read (EIP-3668) compatible resolver for .box domains
 */
class CCIPReadHandler {
  private dotBitApiEndpoint = 'https://indexer-v1.did.id';
  private web3BioEndpoint = 'https://api.web3.bio';
  private offchainResolverEndpoint = 'https://resolver.dotbit.me';
  private cache = new Map<string, ResolveDotBitResult>();

  /**
   * Resolve a .box domain to an address using CCIP-Read compatible resolution
   */
  async resolveDotBit(ensName: string): Promise<ResolveDotBitResult | null> {
    if (!ensName.endsWith('.box')) return null;
    
    // Check cache first
    if (this.cache.has(ensName)) {
      console.log(`Using cached resolution for ${ensName}`);
      return this.cache.get(ensName) || null;
    }
    
    try {
      // First try the official DotBit resolver API
      const response = await fetch(`${this.dotBitApiEndpoint}/v1/account/info?account=${ensName}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.data && data.data.account_info && data.data.account_info.owner_key) {
          // Extract Ethereum address
          const owner = data.data.account_info.owner_key;
          const records = data.data.records || [];
          
          // Find the ETH address record
          const ethRecord = records.find((r: any) => 
            r.key === 'address.eth' || r.key === 'address.60'
          );
          
          const address = ethRecord ? ethRecord.value : owner;
          
          // Find avatar record
          const avatarRecord = records.find((r: any) => r.key === 'profile.avatar');
          const avatar = avatarRecord ? avatarRecord.value : null;
          
          // Extract social records
          const socials: Record<string, string> = {};
          records.filter((r: any) => r.key.startsWith('profile.social')).forEach((r: any) => {
            const platform = r.key.replace('profile.social.', '');
            socials[platform] = r.value;
          });
          
          const result: ResolveDotBitResult = { 
            address, 
            owner,
            avatar,
            socials
          };
          
          // Cache the result
          this.cache.set(ensName, result);
          return result;
        }
      }
      
      // If primary method fails, try the offchain resolver
      const ccipResponse = await fetch(`${this.offchainResolverEndpoint}/resolve?name=${ensName}&type=addr`);
      
      if (ccipResponse.ok) {
        const ccipData = await ccipResponse.json();
        if (ccipData && ccipData.result) {
          const result: ResolveDotBitResult = { 
            address: ccipData.result
          };
          
          // Try to get additional data from web3.bio
          try {
            const bioResponse = await fetch(`${this.web3BioEndpoint}/profile/dotbit/${ensName}`);
            if (bioResponse.ok) {
              const bioData = await bioResponse.json();
              if (bioData && bioData.avatar) {
                result.avatar = bioData.avatar;
              }
            }
          } catch (err) {
            console.log('Error fetching web3.bio data:', err);
          }
          
          // Cache the result
          this.cache.set(ensName, result);
          return result;
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Error resolving .box domain ${ensName}:`, error);
      return null;
    }
  }
  
  /**
   * Get .box domains for an Ethereum address
   */
  async getDotBitByAddress(address: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.dotBitApiEndpoint}/v1/reverse/record?key=address.eth&value=${address}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.data && Array.isArray(data.data)) {
          return data.data.map((account: any) => account.account);
        }
      }
      
      return [];
    } catch (error) {
      console.error(`Error getting .box domains for address ${address}:`, error);
      return [];
    }
  }
}

// Create a singleton instance
export const ccipReadEnabled = new CCIPReadHandler();
