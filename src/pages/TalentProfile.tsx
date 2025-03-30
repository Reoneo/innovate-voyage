
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import { usePdfExport } from '@/hooks/usePdfExport';
import { useIsMobile } from '@/hooks/use-mobile';
import { isValidEthereumAddress } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Wallet, LogOut, Save, Download, Copy } from 'lucide-react';

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import ProfileSkeleton from '@/components/talent/profile/ProfileSkeleton';
import ProfileNavigationBar from '@/components/talent/profile/ProfileNavigationBar';
import ProfileContent from '@/components/talent/profile/ProfileContent';
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
  }, [ensName, routeAddress, userId, ensNameOrAddress]);

  const { loading, passport, blockchainProfile, transactions, resolvedEns, blockchainExtendedData, avatarUrl } = useProfileData(
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
    toast({
      title: "Changes saved",
      description: "Your profile changes have been saved successfully."
    });
  };

  // Copy address to clipboard
  const copyAddressToClipboard = () => {
    if (passport?.owner_address) {
      navigator.clipboard.writeText(passport.owner_address);
      toast({
        title: "Address copied",
        description: "Address has been copied to clipboard"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      <div className={`container mx-auto py-4 md:py-8 ${isMobile ? 'px-2' : 'max-w-5xl'}`}>
        <div className="flex justify-between items-center mb-4">
          <ProfileNavigationBar />
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={exportAsPDF}>
              <Download className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {loading ? (
          <ProfileSkeleton />
        ) : passport ? (
          <div ref={profileRef} className="space-y-4" id="resume-pdf">
            <ProfileContent 
              passport={passport}
              blockchainProfile={blockchainProfile}
              transactions={transactions}
              resolvedEns={resolvedEns}
              blockchainExtendedData={blockchainExtendedData}
              avatarUrl={avatarUrl}
              onCopyAddress={copyAddressToClipboard}
              isOwner={isOwner}
            />
          </div>
        ) : (
          <ProfileNotFound />
        )}
      </div>
    </div>
  );
};

export default TalentProfile;
