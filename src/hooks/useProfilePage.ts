import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import { usePdfExport } from '@/hooks/usePdfExport';
import { isValidEthereumAddress } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function useProfilePage() {
  const { ensNameOrAddress, userId } = useParams<{ensNameOrAddress?: string, userId?: string}>();
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [ens, setEns] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [loadingTimeout, setLoadingTimeout] = useState<boolean>(false);
  
  // Determine which parameter to use (either regular path or recruitment.box path)
  const targetIdentifier = userId || ensNameOrAddress;
  
  useEffect(() => {
    console.log(`useProfilePage: Processing identifier: ${targetIdentifier}`);
    
    // Hard-coded address fallbacks for common domains to speed up loading
    const knownAddressMap: Record<string, string> = {
      'vitalik.eth': '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      'poap.eth': '0x6023e55814DC00f094386d4eb7e17Ce49ab1A190',
      'smith.box': '0xC05501d710B3Cdb2D2C279d0A6b9A2975b3DD096',
      'smith.eth': '0xC05501d710B3Cdb2D2C279d0A6b9A2975b3DD096' // Add explicit .eth mapping too
    };
    
    if (targetIdentifier) {
      // Convert the identifier to lowercase for case-insensitive search
      const normalizedIdentifier = targetIdentifier.toLowerCase();
      console.log(`useProfilePage: Normalized identifier: ${normalizedIdentifier}`);
      
      // Check if we have a known address for this identifier
      if (knownAddressMap[normalizedIdentifier]) {
        console.log(`Using known address mapping for ${normalizedIdentifier}: ${knownAddressMap[normalizedIdentifier]}`);
        setAddress(knownAddressMap[normalizedIdentifier]);
        setEns(normalizedIdentifier);
      }
      // Direct address check - immediately use as address if valid
      else if (isValidEthereumAddress(normalizedIdentifier)) {
        console.log(`Valid Ethereum address detected: ${normalizedIdentifier}`);
        setAddress(normalizedIdentifier);
        setEns(undefined); // Clear ENS when looking up by address
      } 
      else {
        // Not a valid address, treat as ENS or domain
        let ensValue = normalizedIdentifier;
        
        // If no TLD, add .eth
        if (!normalizedIdentifier.includes('.')) {
          ensValue = `${normalizedIdentifier}.eth`;
        } 
        
        console.log(`Treating as ENS: ${ensValue}`);
        setEns(ensValue);
        setAddress(undefined); // Clear address when looking up by ENS
      }
    }

    const storedWallet = localStorage.getItem('connectedWalletAddress');
    setConnectedWallet(storedWallet);

    // Set an even faster timeout for loading - 1.5s instead of 3s
    const timeoutId = setTimeout(() => {
      setLoadingTimeout(true);
    }, 1500);

    // Always optimize for desktop on profile page
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }

    // Clean URL - remove timestamp query parameter and fix duplicate recruitment.box
    if (window.history) {
      let cleanUrl = window.location.pathname;
      
      // Fix duplicate recruitment.box in URL
      if (cleanUrl.includes('recruitment.box/recruitment.box/')) {
        cleanUrl = cleanUrl.replace('recruitment.box/recruitment.box/', 'recruitment.box/');
      }
      
      // Remove timestamp parameter
      if (window.location.href.includes('?t=')) {
        window.history.replaceState({}, document.title, cleanUrl);
      }
      // Fix duplicate recruitment.box without a timestamp parameter
      else if (cleanUrl !== window.location.pathname) {
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
    
    // Prefetch placeholder and robohash avatars to reduce content jumps
    const prefetchCommonAvatars = () => {
      // Prefetch placeholder avatar
      const placeholderImg = new Image();
      placeholderImg.src = "/placeholder.svg";
      
      // Prefetch common domains' avatars
      for (const domain of Object.keys(knownAddressMap)) {
        const avatarImg = new Image();
        avatarImg.src = `https://metadata.ens.domains/mainnet/avatar/${domain}`;
      }
      
      // Prefetch robohash fallback
      const robohashImg = new Image();
      robohashImg.src = `https://robohash.org/${targetIdentifier || 'default'}?set=set4`;
    };
    
    prefetchCommonAvatars();

    return () => {
      clearTimeout(timeoutId);
      // Reset viewport when leaving the page
      if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, [targetIdentifier]);

  // Use a more aggressive loading strategy - load both the ENS and address in parallel
  console.log(`useProfilePage: Using ENS: ${ens}, Address: ${address}`);
  const { loading, passport, blockchainProfile, blockchainExtendedData, avatarUrl, hasTalentProtocolData } = useProfileData(ens, address);
  
  const { profileRef } = usePdfExport();

  const handleDisconnect = () => {
    localStorage.removeItem('connectedWalletAddress');
    setConnectedWallet(null);
    toast({
      title: "Wallet disconnected",
      description: "You've been successfully disconnected from your wallet."
    });
  };
  
  const handleSaveChanges = () => {
    toast({
      title: "Changes saved",
      description: "Your profile changes have been saved successfully."
    });
  };

  return {
    ensNameOrAddress: targetIdentifier,
    loading,
    loadingTimeout,
    passport: passport ? { ...passport, hasTalentProtocolData } : null,
    blockchainProfile,
    avatarUrl,
    profileRef,
    connectedWallet,
    handleDisconnect,
    handleSaveChanges,
    hasTalentProtocolData
  };
}
