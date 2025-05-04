
import { useState, useCallback } from 'react';
import { resolveEnsToAddress, resolveAddressToEns } from '@/utils/ensResolution';
import { getEnsAvatar, getEnsLinks, getEnsBio } from '@/utils/ensResolution';

// ENS API endpoint for direct access when resolution fails
const ENS_API_URL = 'https://ens-api.gskril.workers.dev';

interface EnsResolutionState {
  resolvedAddress: string | undefined;
  resolvedEns: string | undefined;
  avatarUrl: string | undefined;
  ensBio: string | undefined;
  ensLinks: {
    socials: Record<string, string>;
    ensLinks: string[];
    description?: string;
    keywords?: string[];
  };
}

export function useEnsResolution(ensName?: string, address?: string) {
  const [state, setState] = useState<EnsResolutionState>({
    resolvedAddress: address,
    resolvedEns: ensName,
    avatarUrl: undefined,
    ensBio: undefined,
    ensLinks: {
      socials: {},
      ensLinks: [],
      keywords: []
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Maximum number of retry attempts
  const MAX_RETRIES = 2;
  // Shorter timeout for faster retries
  const RETRY_DELAY_MS = 800;

  // Function to resolve ENS name to address with retry logic
  const resolveEns = useCallback(async (ensName: string) => {
    setIsLoading(true);
    setError(null);
    
    let currentTry = 0;
    
    while (currentTry <= MAX_RETRIES) {
      try {
        currentTry++;
        console.log(`Resolving ENS (attempt ${currentTry}): ${ensName}`);
        
        const resolvedAddress = await resolveEnsToAddress(ensName);
        
        if (resolvedAddress) {
          // Try ENS API for metadata first (faster and more reliable)
          try {
            console.log(`Fetching ENS profile data from API for ${ensName}`);
            const profileResponse = await fetch(`${ENS_API_URL}/profile/${ensName}`);
            
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              console.log(`Got ENS profile data from API for ${ensName}:`, profileData);
              
              // Update with API data
              setState(prev => ({
                ...prev,
                resolvedAddress,
                avatarUrl: profileData.avatar || prev.avatarUrl,
                ensBio: profileData.description || prev.ensBio,
                ensLinks: {
                  socials: profileData.social || {},
                  ensLinks: profileData.links || [],
                  description: profileData.description,
                  keywords: profileData.keywords || []
                }
              }));
              
              setIsLoading(false);
              return;
            }
          } catch (apiError) {
            console.error(`Error fetching ENS profile from API for ${ensName}:`, apiError);
          }
          
          // Fallback to traditional methods if API fails
          // Fetch links, avatar and bio in parallel
          const [links, avatar, bio] = await Promise.all([
            getEnsLinks(ensName, 'mainnet').catch(() => ({ 
              socials: {}, ensLinks: [], keywords: [] 
            })),
            getEnsAvatar(ensName, 'mainnet').catch(() => null),
            getEnsBio(ensName, 'mainnet').catch(() => null)
          ]);
          
          console.log(`ENS resolution for ${ensName}:`, { 
            address: resolvedAddress,
            links,
            avatar,
            bio
          });
          
          setState(prev => ({
            ...prev,
            resolvedAddress,
            ensLinks: links || prev.ensLinks,
            avatarUrl: avatar || prev.avatarUrl,
            ensBio: bio || (links && 'description' in links ? links.description : undefined) || prev.ensBio
          }));
          
          setIsLoading(false);
          return;
        }
        
        // If we got null but no error thrown, try again or give up
        if (currentTry > MAX_RETRIES) {
          setError(`Could not resolve ENS name: ${ensName}`);
          break;
        }
        
        // Wait before retrying
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
      } catch (error) {
        console.error(`Error resolving ${ensName} (attempt ${currentTry}):`, error);
        
        if (currentTry > MAX_RETRIES) {
          setError(`Error resolving ENS: ${(error as Error).message}`);
          break;
        }
        
        // Wait before retrying
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
      }
    }
    
    setIsLoading(false);
    setRetryCount(currentTry);
  }, [MAX_RETRIES, RETRY_DELAY_MS]);

  // Function to lookup address to ENS with retry logic
  const lookupAddress = useCallback(async (address: string) => {
    setIsLoading(true);
    setError(null);
    
    let currentTry = 0;
    
    while (currentTry <= MAX_RETRIES) {
      try {
        currentTry++;
        console.log(`Looking up address (attempt ${currentTry}): ${address}`);
        
        // Try ENS API first (faster and more reliable)
        try {
          console.log(`Fetching ENS profile data from API for address ${address}`);
          const profileResponse = await fetch(`${ENS_API_URL}/address/${address}`);
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            if (profileData && profileData.name) {
              console.log(`Got ENS profile data from API for address ${address}:`, profileData);
              
              // Update with API data
              setState(prev => ({
                ...prev,
                resolvedEns: profileData.name,
                avatarUrl: profileData.avatar || prev.avatarUrl,
                ensBio: profileData.description || prev.ensBio,
                ensLinks: {
                  socials: profileData.social || {},
                  ensLinks: profileData.links || [],
                  description: profileData.description,
                  keywords: profileData.keywords || []
                }
              }));
              
              setIsLoading(false);
              return;
            }
          }
        } catch (apiError) {
          console.error(`Error fetching ENS profile from API for address ${address}:`, apiError);
        }
        
        // Fallback to traditional methods
        const result = await resolveAddressToEns(address);
        
        if (result) {
          // Fetch links, avatar and bio in parallel
          const [links, avatar, bio] = await Promise.all([
            getEnsLinks(result.ensName, 'mainnet').catch(() => ({ 
              socials: {}, ensLinks: [], keywords: [] 
            })),
            getEnsAvatar(result.ensName, 'mainnet').catch(() => null),
            getEnsBio(result.ensName, 'mainnet').catch(() => null)
          ]);
          
          console.log(`Address lookup for ${address}:`, {
            ens: result.ensName,
            links,
            avatar,
            bio
          });
          
          setState(prev => ({
            ...prev,
            resolvedEns: result.ensName,
            ensLinks: links || prev.ensLinks,
            avatarUrl: avatar || prev.avatarUrl,
            ensBio: bio || (links && 'description' in links ? links.description : undefined) || prev.ensBio
          }));
          
          setIsLoading(false);
          return;
        }
        
        // If we got null but no error thrown, try again or give up
        if (currentTry > MAX_RETRIES) {
          // Don't set error here, just log - many addresses don't have ENS
          console.log(`No ENS found for address: ${address}`);
          break;
        }
        
        // Wait before retrying
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
      } catch (error) {
        console.error(`Error looking up ENS for address ${address} (attempt ${currentTry}):`, error);
        
        if (currentTry > MAX_RETRIES) {
          setError(`Error looking up address: ${(error as Error).message}`);
          break;
        }
        
        // Wait before retrying
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
      }
    }
    
    setIsLoading(false);
    setRetryCount(currentTry);
  }, [MAX_RETRIES, RETRY_DELAY_MS]);

  return {
    state,
    setState,
    isLoading,
    setIsLoading,
    error,
    setError,
    retryCount,
    resolveEns,
    lookupAddress
  };
}
