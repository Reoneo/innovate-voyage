
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import { usePdfExport } from '@/hooks/usePdfExport';
import { useIsMobile } from '@/hooks/use-mobile';
import { isValidEthereumAddress } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Wallet, LogOut, Save, Download, AlertCircle } from 'lucide-react';

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import ProfileSkeleton from '@/components/talent/profile/ProfileSkeleton';
import ProfileHeader from '@/components/talent/profile/ProfileHeader';
import ProfileNavigationBar from '@/components/talent/profile/ProfileNavigationBar';
import ProfileTabsContainer from '@/components/talent/profile/ProfileTabsContainer';
import ProfileNotFound from '@/components/talent/profile/ProfileNotFound';

const TalentProfile = () => {
  const { ensName, address: routeAddress, userId, ensNameOrAddress } = useParams<{ 
    ensName: string; 
    address: string; 
    userId: string;
    ensNameOrAddress: string;
  }>();
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [ens, setEns] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  
  // Determine which parameter to use for identification
  useEffect(() => {
    if (userId) {
      // We're on the /recruitment.box/:userId route
      // Check if it's an ENS or address
      if (isValidEthereumAddress(userId)) {
        setAddress(userId);
      } else {
        // If it's not a valid address, treat it as an ENS
        // If no .eth suffix is provided, add it (for short ENS names)
        const ensValue = userId.includes('.') ? userId : `${userId}.eth`;
        setEns(ensValue);
      }
    } else if (routeAddress) {
      // We're on the /address/:address route
      setAddress(routeAddress);
    } else if (ensName && isValidEthereumAddress(ensName)) {
      // We're on the /talent/:ensName route but it's actually an address
      setAddress(ensName);
    } else if (ensName) {
      // We're on the /talent/:ensName route with an actual ENS name
      // If no .eth suffix is provided, add it
      const ensValue = ensName.includes('.') ? ensName : `${ensName}.eth`;
      setEns(ensValue);
    } else if (ensNameOrAddress) {
      // We're on the /:ensNameOrAddress route
      if (isValidEthereumAddress(ensNameOrAddress)) {
        setAddress(ensNameOrAddress);
      } else {
        // If no .eth suffix is provided, add it
        const ensValue = ensNameOrAddress.includes('.') ? ensNameOrAddress : `${ensNameOrAddress}.eth`;
        setEns(ensValue);
      }
    }

    // Get connected wallet from localStorage
    const storedWallet = localStorage.getItem('connectedWalletAddress');
    setConnectedWallet(storedWallet);
    
    // Add event listener to handle wallet connect button
    const handleWalletConnect = () => {
      if (window.connectWalletModal) {
        window.connectWalletModal.showModal();
      }
    };
    
    document.addEventListener('open-wallet-connect', handleWalletConnect);
    
    return () => {
      document.removeEventListener('open-wallet-connect', handleWalletConnect);
    };
  }, [ensName, routeAddress, userId, ensNameOrAddress]);

  const { loading, passport, blockchainProfile, transactions, resolvedEns, blockchainExtendedData, avatarUrl, error } = useProfileData(
    ens || ((ensName && !isValidEthereumAddress(ensName)) ? ensName : undefined), 
    address || (ensName && isValidEthereumAddress(ensName) ? ensName : undefined)
  );
  
  const { profileRef, exportAsPDF } = usePdfExport();
  const isMobile = useIsMobile();

  // Check if current user is the profile owner
  const isOwner = connectedWallet && passport?.owner_address && 
    connectedWallet.toLowerCase() === passport.owner_address.toLowerCase();
  
  // Handle disconnecting wallet
  const handleDisconnect = () => {
    localStorage.removeItem('connectedWalletAddress');
    setConnectedWallet(null);
    toast({
      title: "Wallet disconnected",
      description: "You've been successfully disconnected from your wallet."
    });
  };
  
  // Handle saving changes
  const handleSaveChanges = () => {
    // This function doesn't need to do anything as changes are saved automatically
    // to localStorage when skills are added, but we'll show a toast for feedback
    toast({
      title: "Changes saved",
      description: "Your profile changes have been saved successfully."
    });
  };

  return (
    <div className={`container mx-auto py-4 md:py-8 ${isMobile ? 'px-2' : 'max-w-5xl'}`}>
      <div className="flex justify-between items-center mb-4">
        <ProfileNavigationBar />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="ml-2">
              <Wallet className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {connectedWallet ? (
              <>
                <DropdownMenuItem onClick={handleSaveChanges}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDisconnect}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={() => document.dispatchEvent(new Event('open-wallet-connect'))}>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={exportAsPDF}>
              <Download className="mr-2 h-4 w-4" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {loading ? (
        <ProfileSkeleton />
      ) : passport ? (
        <div ref={profileRef} className="space-y-4 md:space-y-6" id="resume-pdf">
          <ProfileHeader passport={{
            passport_id: passport.passport_id,
            owner_address: passport.owner_address,
            avatar_url: avatarUrl || passport.avatar_url || '/placeholder.svg',
            name: passport.name,
            score: passport.score,
            category: passport.category,
            socials: passport.socials || {},
            bio: blockchainProfile?.description || blockchainExtendedData?.description || null
          }} />
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Error loading blockchain data: {error.message}
              </AlertDescription>
            </Alert>
          )}
          
          <ProfileTabsContainer 
            passport={passport}
            blockchainProfile={blockchainProfile}
            transactions={transactions}
            resolvedEns={resolvedEns}
            onExportPdf={exportAsPDF}
            blockchainExtendedData={blockchainExtendedData}
            avatarUrl={avatarUrl}
            ownerAddress={passport.owner_address}
            additionalEnsDomains={passport.additionalEnsDomains || []}
            blockchainError={error}
          />
        </div>
      ) : (
        <ProfileNotFound />
      )}
    </div>
  );
};

export default TalentProfile;
