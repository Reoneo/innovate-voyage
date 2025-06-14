import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch domains from web3.bio API
 */
export async function fetchDomainsFromWeb3Bio(address: string): Promise<string[]> {
  try {
    // Add a cache-busting parameter to prevent stale data
    const path = `/profile/${address}?nocache=${Date.now()}`;
    
    const { data, error } = await supabase.functions.invoke('proxy-web3bio', {
      body: { path }
    });

    if (error) {
      console.warn(`Web3.bio proxy returned an error for address ${address}: ${error.message}`);
      return [];
    }
    
    if (!Array.isArray(data)) {
      if (data.identity) {
        return [data.identity];
      }
      return [];
    }
    
    // Extract all identities
    const domains: string[] = [];
    
    for (const profile of data) {
      if (profile.identity) {
        domains.push(profile.identity);
      }
      
      // Also extract aliases if available
      if (profile.aliases && Array.isArray(profile.aliases)) {
        for (const alias of profile.aliases) {
          // Handle different alias formats
          if (typeof alias === 'string') {
            if (alias.includes(',')) {
              // Format: "platform,name"
              const parts = alias.split(',');
              if (parts.length === 2 && parts[1].includes('.')) {
                if (!domains.includes(parts[1])) {
                  domains.push(parts[1]);
                }
              }
            } else if (alias.includes('.')) {
              // Direct domain name
              if (!domains.includes(alias)) {
                domains.push(alias);
              }
            }
          }
        }
      }
    }
    
    console.log(`Web3.bio returned ${domains.length} domains for ${address}:`, domains);
    return domains;
  } catch (error) {
    console.error("Error fetching from web3.bio:", error);
    return [];
  }
}
