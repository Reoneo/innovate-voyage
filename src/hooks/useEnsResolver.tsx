
import { useState, useEffect } from 'react';
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
  
  // Initialize state
  const [resolvedAddress, setResolvedAddress] = useState<string | undefined>(address);
  const [resolvedEns, setResolvedEns] = useState<string | undefined>(normalizedEnsName);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [ensBio, setEnsBio] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [timeoutError, setTimeoutError] = useState(false);
  const [ensLinks, setEnsLinks] = useState<{
    socials: Record<string, string>;
    ensLinks: string[];
    description?: string;
  }>({
    socials: {},
    ensLinks: []
  });
  
  // Use our ENS resolution hook with proper type checking
  const ensResolution = useEnsResolution(normalizedEnsName, address);
  
  // Effect to update state from the useEnsResolution hook
  useEffect(() => {
    if (ensResolution) {
      if (ensResolution.resolvedAddress) {
        setResolvedAddress(ensResolution.resolvedAddress);
      }
      if (ensResolution.resolvedEns) {
        setResolvedEns(ensResolution.resolvedEns);
      }
      if (ensResolution.avatarUrl) {
        setAvatarUrl(ensResolution.avatarUrl);
      }
      if (ensResolution.ensLinks) {
        setEnsLinks(ensResolution.ensLinks);
        if (ensResolution.ensLinks.description) {
          setEnsBio(ensResolution.ensLinks.description);
        }
      }
    }
  }, [ensResolution]);

  // Use Web3Bio data
  const { isLoading: isLoadingWeb3Bio } = useWeb3BioData(
    normalizedEnsName,
    address,
    !!isEns,
    (newState) => {
      if (newState.resolvedAddress) {
        setResolvedAddress(newState.resolvedAddress);
      }
      if (newState.resolvedEns) {
        setResolvedEns(newState.resolvedEns);
      }
      if (newState.avatarUrl) {
        setAvatarUrl(newState.avatarUrl);
      }
      if (newState.ensBio) {
        setEnsBio(newState.ensBio);
      }
      if (newState.ensLinks?.socials) {
        setEnsLinks(prevLinks => ({
          ...prevLinks,
          socials: {
            ...prevLinks.socials,
            ...newState.ensLinks?.socials
          },
          description: newState.ensLinks?.description || prevLinks.description
        }));
      }
    }
  );

  // Use our new hook for Lens and Farcaster data
  const { 
    lensProfile, 
    farcasterProfile, 
    isLoading: isLoadingLensAndFarcaster
  } = useLensAndFarcaster(normalizedEnsName || address);

  // Merge social links from all sources
  useEffect(() => {
    if (lensProfile || farcasterProfile) {
      const updatedSocials = { ...ensLinks.socials };
        
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
      const updatedBio = ensBio || 
                        lensProfile?.bio || 
                        farcasterProfile?.bio;
        
      // Use Lens or Farcaster avatar if ENS avatar is not available
      const updatedAvatar = avatarUrl || 
                           lensProfile?.avatar || 
                           farcasterProfile?.avatar;
        
      if (updatedBio) {
        setEnsBio(updatedBio);
      }
      
      if (updatedAvatar) {
        setAvatarUrl(updatedAvatar);
      }
      
      setEnsLinks({
        ...ensLinks,
        socials: updatedSocials
      });
    }
  }, [lensProfile, farcasterProfile]);

  return {
    resolvedAddress,
    resolvedEns,
    avatarUrl,
    ensBio,
    ensLinks,
    isLoading: isLoading || isLoadingWeb3Bio || isLoadingLensAndFarcaster,
    error,
    timeoutError
  };
}
