
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
  private ensApiEndpoint = 'https://ens-api.gskril.workers.dev';
  private cache = new Map<string, ResolveDotBitResult>();
  
  // Cache TTL in milliseconds (5 minutes)
  private cacheTtl = 5 * 60 * 1000;

  /**
   * Resolve a .box domain to an address using CCIP-Read compatible resolution
   */
  async resolveDotBit(ensName: string): Promise<ResolveDotBitResult | null> {
    if (!ensName.endsWith('.box')) return null;
    
    // Check cache first - with timestamp validation
    if (this.cache.has(ensName)) {
      const cachedData = this.cache.get(ensName);
      const timestamp = cachedData?._timestamp as number;
      
      // If cache is fresh, use it
      if (timestamp && Date.now() - timestamp < this.cacheTtl) {
        console.log(`Using cached resolution for ${ensName}`);
        const { _timestamp, ...resultWithoutTimestamp } = cachedData as any;
        return resultWithoutTimestamp;
      } else {
        console.log(`Cache for ${ensName} is stale, refreshing...`);
      }
    }
    
    try {
      // First try ENS API - most reliable and comprehensive
      const apiResult = await this.tryEnsApi(ensName);
      if (apiResult) return apiResult;
      
      // Then try the official DotBit resolver API
      const dotBitResult = await this.tryDotBitIndexer(ensName);
      if (dotBitResult) return dotBitResult;
      
      // If all fails, try the offchain resolver
      const offchainResult = await this.tryOffchainResolver(ensName);
      if (offchainResult) return offchainResult;
      
      // Last resort, try web3.bio
      const web3BioResult = await this.tryWeb3Bio(ensName);
      if (web3BioResult) return web3BioResult;
      
      return null;
    } catch (error) {
      console.error(`Error resolving .box domain ${ensName}:`, error);
      return null;
    }
  }
  
  /**
   * Try the ENS API first
   */
  private async tryEnsApi(ensName: string): Promise<ResolveDotBitResult | null> {
    try {
      console.log(`Trying ENS API for ${ensName}`);
      
      // Get address
      const addressResponse = await fetch(`${this.ensApiEndpoint}/address/${ensName}`, {
        signal: AbortSignal.timeout(2500)
      });
      
      if (addressResponse.ok) {
        const addressData = await addressResponse.json();
        
        if (addressData && addressData.address) {
          // Also fetch profile data for additional information
          try {
            const profileResponse = await fetch(`${this.ensApiEndpoint}/profile/${ensName}`, {
              signal: AbortSignal.timeout(2500) 
            });
            
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              
              const result: ResolveDotBitResult = {
                address: addressData.address,
                avatar: profileData.avatar,
                socials: profileData.social || {}
              };
              
              // Cache the result with timestamp
              this.cacheResultWithTimestamp(ensName, result);
              console.log(`ENS API resolution success for ${ensName}:`, result);
              return result;
            }
          } catch (profileError) {
            console.error(`Error fetching profile from ENS API for ${ensName}:`, profileError);
          }
          
          // Return just the address if profile fetch failed
          const result = {
            address: addressData.address
          };
          this.cacheResultWithTimestamp(ensName, result);
          console.log(`ENS API address resolution success for ${ensName}:`, result);
          return result;
        }
      }
    } catch (error) {
      console.error(`ENS API error for ${ensName}:`, error);
    }
    return null;
  }
  
  /**
   * Try the official DotBit resolver API
   */
  private async tryDotBitIndexer(ensName: string): Promise<ResolveDotBitResult | null> {
    try {
      const response = await fetch(`${this.dotBitApiEndpoint}/v1/account/info?account=${ensName}`, {
        signal: AbortSignal.timeout(2500)
      });
      
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
          
          // Cache the result with timestamp
          this.cacheResultWithTimestamp(ensName, result);
          console.log(`DotBit indexer resolution success for ${ensName}:`, result);
          return result;
        }
      }
    } catch (error) {
      console.error(`DotBit indexer error for ${ensName}:`, error);
    }
    return null;
  }
  
  /**
   * Try the offchain resolver
   */
  private async tryOffchainResolver(ensName: string): Promise<ResolveDotBitResult | null> {
    try {
      const ccipResponse = await fetch(`${this.offchainResolverEndpoint}/resolve?name=${ensName}&type=addr`, {
        signal: AbortSignal.timeout(2500)
      });
      
      if (ccipResponse.ok) {
        const ccipData = await ccipResponse.json();
        if (ccipData && ccipData.result) {
          const result: ResolveDotBitResult = { 
            address: ccipData.result
          };
          
          this.cacheResultWithTimestamp(ensName, result);
          console.log(`Offchain resolver success for ${ensName}:`, result);
          return result;
        }
      }
    } catch (error) {
      console.error(`Offchain resolver error for ${ensName}:`, error);
    }
    return null;
  }
  
  /**
   * Try web3.bio as last resort
   */
  private async tryWeb3Bio(ensName: string): Promise<ResolveDotBitResult | null> {
    try {
      const bioResponse = await fetch(`${this.web3BioEndpoint}/profile/dotbit/${ensName}`, {
        signal: AbortSignal.timeout(2500)
      });
      
      if (bioResponse.ok) {
        const bioData = await bioResponse.json();
        if (bioData) {
          const result: ResolveDotBitResult = {
            address: bioData.address || bioData.addresses?.ethereum || "",
            avatar: bioData.avatar
          };
          
          if (result.address) {
            this.cacheResultWithTimestamp(ensName, result);
            console.log(`Web3.bio resolution success for ${ensName}:`, result);
            return result;
          }
        }
      }
    } catch (error) {
      console.error(`Web3.bio error for ${ensName}:`, error);
    }
    return null;
  }
  
  /**
   * Cache result with timestamp
   */
  private cacheResultWithTimestamp(ensName: string, result: ResolveDotBitResult) {
    this.cache.set(ensName, {
      ...result,
      _timestamp: Date.now()
    } as any);
  }
  
  /**
   * Get .box domains for an Ethereum address
   */
  async getDotBitByAddress(address: string): Promise<string[]> {
    try {
      // First try ENS API
      try {
        const response = await fetch(`${this.ensApiEndpoint}/name/${address}`, {
          signal: AbortSignal.timeout(2500)
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.name && data.name.endsWith('.box')) {
            console.log(`ENS API found .box domain for ${address}: ${data.name}`);
            return [data.name];
          }
        }
      } catch (apiError) {
        console.error(`ENS API error for address lookup ${address}:`, apiError);
      }
      
      // Try DotBit indexer
      try {
        const response = await fetch(`${this.dotBitApiEndpoint}/v1/reverse/record?key=address.eth&value=${address}`, {
          signal: AbortSignal.timeout(2500)
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data && data.data && Array.isArray(data.data)) {
            const domains = data.data.map((account: any) => account.account);
            console.log(`DotBit indexer found domains for ${address}:`, domains);
            return domains;
          }
        }
      } catch (error) {
        console.error(`DotBit indexer error for address ${address}:`, error);
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
