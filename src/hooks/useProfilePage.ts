
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import { usePdfExport } from '@/hooks/usePdfExport';
import { isValidEthereumAddress } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { fetchEnsData } from '@/api/services/ethFollowService';

export function useProfilePage() {
  const { ensNameOrAddress, userId } = useParams<{ensNameOrAddress?: string, userId?: string}>();
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [ens, setEns] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [loadingTimeout, setLoadingTimeout] = useState<boolean>(false);
  const navigate = useNavigate();
  
  // Determine which parameter to use (either regular path or recruitment.box path)
  const targetIdentifier = userId || ensNameOrAddress;
  
  useEffect(() => {
    if (targetIdentifier) {
      // Direct address check - immediately use as address if valid
      if (isValidEthereumAddress(targetIdentifier)) {
        console.log(`Valid Ethereum address detected: ${targetIdentifier}`);
        setAddress(targetIdentifier);
        setEns(undefined); // Clear ENS when looking up by address
      } else {
        // Not a valid address, treat as ENS or domain
        const ensValue = targetIdentifier.includes('.') ? targetIdentifier : `${targetIdentifier}.eth`;
        console.log(`Treating as ENS: ${ensValue}`);
        setEns(ensValue);
        setAddress(undefined); // Clear address when looking up by ENS
      }
    }

    const storedWallet = localStorage.getItem('connectedWalletAddress');
    setConnectedWallet(storedWallet);

    // Set a timeout for loading
    const timeoutId = setTimeout(() => {
      setLoadingTimeout(true);
    }, 5000);

    // Always optimize for desktop on profile page
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
    }

    // Add CSS to prevent horizontal scrolling on mobile
    const style = document.createElement('style');
    style.textContent = `
      body, html {
        max-width: 100%;
        overflow-x: hidden;
      }
    `;
    document.head.appendChild(style);

    // Set ENS avatar as favicon for bookmarking
    const updateFavicon = async () => {
      if (ens) {
        try {
          const ensData = await fetchEnsData(ens);
          if (ensData && ensData.ens && ensData.ens.avatar) {
            const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
            if (link) {
              link.href = ensData.ens.avatar;
            } else {
              const newLink = document.createElement('link');
              newLink.rel = 'icon';
              newLink.href = ensData.ens.avatar;
              document.head.appendChild(newLink);
            }
            
            // Set location if available
            if (ensData.ens.records && ensData.ens.records.location) {
              setLocation(ensData.ens.records.location);
            }
          }
        } catch (error) {
          console.error('Error setting ENS avatar as favicon:', error);
        }
      }
    };
    
    updateFavicon();

    return () => {
      clearTimeout(timeoutId);
      // Reset viewport to default when leaving the page
      if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
      // Remove the added style
      document.head.removeChild(style);
      
      // Reset favicon
      const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (link) {
        link.href = '/favicon.ico';
      }
    };
  }, [targetIdentifier, ens]);

  const { loading, passport, blockchainProfile, blockchainExtendedData, avatarUrl } = useProfileData(ens, address);
  
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

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Redirect to the recruitment.box URL format
      window.location.href = `/recruitment.box/${query.trim()}/`;
    }
  };

  return {
    ensNameOrAddress: targetIdentifier,
    loading,
    loadingTimeout,
    passport,
    blockchainProfile,
    avatarUrl,
    profileRef,
    connectedWallet,
    location,
    handleDisconnect,
    handleSaveChanges,
    handleSearch
  };
}
