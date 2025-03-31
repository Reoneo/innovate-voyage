import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import { usePdfExport } from '@/hooks/usePdfExport';
import { useIsMobile } from '@/hooks/use-mobile';
import { isValidEthereumAddress } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Wallet, LogOut, Save, Download, Maximize, Minimize } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import ProfileSkeleton from '@/components/talent/profile/ProfileSkeleton';
import ProfileHeader from '@/components/talent/profile/ProfileHeader';
import ProfileNavigationBar from '@/components/talent/profile/ProfileNavigationBar';
import ProfileTabsContainer from '@/components/talent/profile/ProfileTabsContainer';
import ProfileNotFound from '@/components/talent/profile/ProfileNotFound';
import { TooltipProvider } from '@/components/ui/tooltip';

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
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  useEffect(() => {
    if (userId) {
      if (isValidEthereumAddress(userId)) {
        setAddress(userId);
      } else {
        const ensValue = userId.includes('.') ? userId : `${userId}.eth`;
        setEns(ensValue);
      }
    } else if (routeAddress) {
      setAddress(routeAddress);
    } else if (ensName && isValidEthereumAddress(ensName)) {
      setAddress(ensName);
    } else if (ensName) {
      const ensValue = ensName.includes('.') ? ensName : `${ensName}.eth`;
      setEns(ensValue);
    } else if (ensNameOrAddress) {
      if (isValidEthereumAddress(ensNameOrAddress)) {
        setAddress(ensNameOrAddress);
      } else {
        const ensValue = ensNameOrAddress.includes('.') ? ensNameOrAddress : `${ensNameOrAddress}.eth`;
        setEns(ensValue);
      }
    }

    const storedWallet = localStorage.getItem('connectedWalletAddress');
    setConnectedWallet(storedWallet);
  }, [ensName, routeAddress, userId, ensNameOrAddress]);

  const { loading, passport, blockchainProfile, transactions, resolvedEns, blockchainExtendedData, avatarUrl, poaps, loadingPoaps } = useProfileData(
    ens || ((ensName && !isValidEthereumAddress(ensName)) ? ensName : undefined), 
    address || (ensName && isValidEthereumAddress(ensName) ? ensName : undefined)
  );
  
  const { profileRef, exportAsPDF } = usePdfExport();
  const isMobile = useIsMobile();

  const isOwner = connectedWallet && passport?.owner_address && 
    connectedWallet.toLowerCase() === passport.owner_address.toLowerCase();
  
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

  const getShareableUrl = () => {
    const baseUrl = window.location.origin;
    const profileId = passport?.passport_id || passport?.owner_address;
    return `${baseUrl}/${profileId}`;
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`container mx-auto py-4 md:py-8 ${isMobile ? 'px-2' : 'max-w-5xl'}`}>
      <div className="flex justify-between items-center mb-4">
        <ProfileNavigationBar />
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleExpanded}
          >
            {isExpanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
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
              <DropdownMenuItem onClick={exportAsPDF}>
                <Download className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {loading ? (
        <ProfileSkeleton />
      ) : passport ? (
        <div ref={profileRef} className={`${isExpanded ? 'min-h-[800px]' : ''}`} id="resume-pdf">
          <div className={`relative ${isExpanded ? 'h-[800px]' : 'h-[700px]'} border rounded-lg overflow-hidden`}>
            <TooltipProvider>
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
              
              <ProfileTabsContainer 
                passport={passport}
                blockchainProfile={blockchainProfile}
                transactions={transactions}
                resolvedEns={resolvedEns}
                onExportPdf={exportAsPDF}
                blockchainExtendedData={blockchainExtendedData}
                avatarUrl={avatarUrl}
                ownerAddress={passport.owner_address}
                poaps={poaps}
                isLoadingPoaps={loadingPoaps}
              />
            </TooltipProvider>
          </div>
        </div>
      ) : (
        <ProfileNotFound />
      )}
    </div>
  );
};

export default TalentProfile;
