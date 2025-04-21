
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import { usePdfExport } from '@/hooks/usePdfExport';
import { isValidEthereumAddress } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { normalizeInput } from '@/utils/normalizeInput';

// For postal code detection placeholder
function isPostalCode(str: string): boolean {
  // Simple check: any string that is 4-8 chars, alphanumeric, optional space
  return /^[A-Za-z0-9 ]{4,8}$/.test(str) && /[0-9]/.test(str); // simplistic
}

export function useProfilePage() {
  const { ensNameOrAddress, userId } = useParams<{ ensNameOrAddress?: string, userId?: string }>();
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [ens, setEns] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [loadingTimeout, setLoadingTimeout] = useState<boolean>(false);
  
  // Determine which parameter to use (either regular path or recruitment.box path)
  const targetIdentifier = userId || ensNameOrAddress;

  useEffect(() => {
    if (targetIdentifier) {
      // Normalize with updated logic (no brute-forcing)
      const normalized = normalizeInput(targetIdentifier, isPostalCode);

      // Handle routing
      if (/^0x[0-9A-Fa-f]{40}$/.test(normalized)) {
        setAddress(normalized);
        setEns(undefined);
      } else if (/\.eth$/i.test(normalized)) {
        setEns(normalized);
        setAddress(undefined);
      } else {
        setEns(normalized);
        setAddress(undefined);
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
      metaViewport.setAttribute('content', 'width=1024, initial-scale=1.0');
    }

    return () => {
      clearTimeout(timeoutId);
      // Reset viewport to mobile-friendly when leaving the page
      if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, [targetIdentifier]);

  const { loading, passport, blockchainProfile, blockchainExtendedData, avatarUrl } = useProfileData(ens, address);
  const { profileRef, exportAsPDF } = usePdfExport();

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

  const handleExportPdf = () => {
    exportAsPDF();
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
    handleDisconnect,
    handleSaveChanges,
    handleExportPdf
  };
}
