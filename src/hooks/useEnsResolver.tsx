
import { useEffect } from 'react';
import { useEnsResolution } from './ens/useEnsResolution';
import { useWeb3BioData } from './ens/useWeb3BioData';
import { useLensAndFarcaster } from './ens/useLensAndFarcaster';

/**
 * Hook to resolve ENS name and Ethereum address bidirectionally
 * @param ensName Optional ENS name to resolve
 * @param address Optional Ethereum address to resolve
 * @returns Object containing resolved address and ENS name
 */
export function useEnsResolver(ensName?: string, address?: string) {
  // Normalize ENS name if provided without extension
  const normalizedEnsName = ensName && !ensName.includes('.') 
    ? `${ensName}.eth` 
    : ensName;
  
  // Determine if we're dealing with an ENS name (.eth or .box)
  const isEns = normalizedEnsName?.includes('.eth') || normalizedEnsName?.includes('.box');
  
  const {
    state,
    setState,
    isLoading: isLoadingEns,
    setIsLoading,
    error: ensError,
    setError,
    resolveEns,
    lookupAddress,
    timeoutError
  } = useEnsResolution(normalizedEnsName, address);

  const { isLoading: isLoadingWeb3Bio } = useWeb3BioData(
    normalizedEnsName,
    address,
    !!isEns,
    (newState) => setState(prev => ({ ...prev, ...newState }))
  );

  // Use our new hook for Lens and Farcaster data
  const { 
    lensProfile, 
    farcasterProfile, 
    isLoading: isLoadingLensAndFarcaster,
    error: lensAndFarcasterError 
  } = useLensAndFarcaster(normalizedEnsName || address);

  // Effect to handle ENS resolution
  useEffect(() => {
    if (!normalizedEnsName) return;
    
    setIsLoading(true);
    setError(null);
    
    resolveEns(normalizedEnsName).finally(() => setIsLoading(false));
  }, [normalizedEnsName]);

  // Effect to handle address resolution
  useEffect(() => {
    if (!address || isEns) return;
    
    setIsLoading(true);
    setError(null);
    
    lookupAddress(address).finally(() => setIsLoading(false));
  }, [address, isEns]);

  // Merge social links from all sources
  useEffect(() => {
    if (lensProfile || farcasterProfile) {
      setState(prev => {
        const updatedSocials = { ...prev.ensLinks.socials };
        
        // Add Lens socials
        if (lensProfile?.socials) {
          Object.keys(lensProfile.socials).forEach(key => {
            if (!updatedSocials[key]) {
              updatedSocials[key] = lensProfile.socials[key];
            }
          });
        }
        
        // Add Farcaster socials
        if (farcasterProfile?.socials) {
          Object.keys(farcasterProfile.socials).forEach(key => {
            if (!updatedSocials[key]) {
              updatedSocials[key] = farcasterProfile.socials[key];
            }
          });
        }
        
        // Update bio if not already set
        const updatedBio = prev.ensBio || 
                          lensProfile?.bio || 
                          farcasterProfile?.bio;
        
        // Use Lens or Farcaster avatar if ENS avatar is not available
        const updatedAvatar = prev.avatarUrl || 
                             lensProfile?.avatar || 
                             farcasterProfile?.avatar;
        
        return {
          ...prev,
          avatarUrl: updatedAvatar,
          ensBio: updatedBio,
          ensLinks: {
            ...prev.ensLinks,
            socials: updatedSocials
          }
        };
      });
    }
  }, [lensProfile, farcasterProfile]);

  return {
    resolvedAddress: state.resolvedAddress,
    resolvedEns: state.resolvedEns,
    avatarUrl: state.avatarUrl,
    ensBio: state.ensBio,
    ensLinks: state.ensLinks,
    isLoading: isLoadingEns || isLoadingWeb3Bio || isLoadingLensAndFarcaster,
    error: ensError || lensAndFarcasterError,
    timeoutError
  };
}
