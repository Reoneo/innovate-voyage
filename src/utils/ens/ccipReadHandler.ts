
import { mainnetProvider } from '../ethereumProviders';

export interface ResolveDotBitResult {
  address: string;
  owner?: string;
  avatar?: string;
  socials?: Record<string, string>;
  textRecords?: Record<string, string | null>;
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
      const response = await fetch(`${this.dotBitApiEndpoint}/v1/account/info?account=${ensName}`, {
        signal: AbortSignal.timeout(3000)
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
          
          // Extract all records into a textRecords object for ENS compatibility
          const textRecords: Record<string, string | null> = {};
          records.forEach((r: any) => {
            // Convert DotBit record format to ENS-compatible format
            if (r.key === 'profile.avatar') {
              textRecords['avatar'] = r.value;
              textRecords['avatar.ens'] = r.value;
            } else if (r.key === 'profile.description') {
              textRecords['description'] = r.value;
            } else if (r.key === 'profile.url') {
              textRecords['url'] = r.value;
            } else if (r.key.startsWith('profile.social.')) {
              const platform = r.key.replace('profile.social.', 'com.');
              textRecords[platform] = r.value;
            } else {
              // Store the original key format as well
              textRecords[r.key] = r.value;
            }
          });
          
          const result: ResolveDotBitResult = { 
            address, 
            owner,
            avatar,
            socials,
            textRecords
          };
          
          // Cache the result
          this.cache.set(ensName, result);
          return result;
        }
      }
      
      // If primary method fails, try the offchain resolver
      const ccipResponse = await fetch(`${this.offchainResolverEndpoint}/resolve?name=${ensName}&type=addr`, {
        signal: AbortSignal.timeout(3000)
      });
      
      if (ccipResponse.ok) {
        const ccipData = await ccipResponse.json();
        if (ccipData && ccipData.result) {
          const result: ResolveDotBitResult = { 
            address: ccipData.result,
            textRecords: {}
          };
          
          // Try to get additional data from web3.bio
          try {
            const bioResponse = await fetch(`${this.web3BioEndpoint}/profile/dotbit/${ensName}`, {
              signal: AbortSignal.timeout(3000)
            });
            if (bioResponse.ok) {
              const bioData = await bioResponse.json();
              if (bioData && bioData.avatar) {
                result.avatar = bioData.avatar;
                if (!result.textRecords) result.textRecords = {};
                result.textRecords['avatar'] = bioData.avatar;
                result.textRecords['avatar.ens'] = bioData.avatar;
              }
              
              // Add any other profile data as text records
              if (bioData.description) {
                if (!result.textRecords) result.textRecords = {};
                result.textRecords['description'] = bioData.description;
              }
              
              // Add social links as text records
              if (bioData.accounts) {
                if (!result.socials) result.socials = {};
                if (!result.textRecords) result.textRecords = {};
                
                bioData.accounts.forEach((account: any) => {
                  if (account.platform && account.identity) {
                    result.socials![account.platform] = account.identity;
                    result.textRecords![`com.${account.platform}`] = account.identity;
                  }
                });
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
      
      // If all direct methods fail, try to treat it like a normal ENS name
      try {
        const resolver = await mainnetProvider.getResolver(ensName);
        if (resolver) {
          const address = await resolver.getAddress();
          if (address) {
            const result: ResolveDotBitResult = { 
              address,
              textRecords: {}
            };
            
            // Collect text records from resolver
            const commonKeys = [
              'avatar', 'avatar.ens', 'description', 'url', 
              'com.twitter', 'com.github', 'email'
            ];
            
            // Fetch all text records in parallel
            const textRecords: Record<string, string | null> = {};
            
            await Promise.all(
              commonKeys.map(async key => {
                try {
                  const value = await resolver.getText(key);
                  if (value) {
                    textRecords[key] = value;
                  }
                } catch (e) {
                  // Ignore errors for missing text records
                }
              })
            );
            
            result.textRecords = textRecords;
            
            // Try to get avatar
            try {
              const avatar = await resolver.getText('avatar');
              if (avatar) {
                result.avatar = avatar;
                result.textRecords['avatar'] = avatar;
              }
            } catch (err) {
              console.log(`No avatar for ${ensName}`);
            }
            
            // Cache and return
            this.cache.set(ensName, result);
            return result;
          }
        }
      } catch (err) {
        console.log(`Standard resolver failed for ${ensName}:`, err);
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
      const response = await fetch(
        `${this.dotBitApiEndpoint}/v1/reverse/record?key=address.eth&value=${address}`, 
        { signal: AbortSignal.timeout(3000) }
      );
      
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
