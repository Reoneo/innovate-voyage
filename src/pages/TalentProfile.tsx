
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import { usePdfExport } from '@/hooks/usePdfExport';
import { useIsMobile } from '@/hooks/use-mobile';
import { isValidEthereumAddress } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Wallet, LogOut, Save, Download } from 'lucide-react';

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
import ProfileNotFound from '@/components/talent/profile/ProfileNotFound';
import ProfileInfoSection from '@/components/talent/profile/components/ProfileInfoSection';
import { SocialLinks } from '@/components/talent/profile/tabs/social';

const TalentProfile = () => {
  const { 
    ensNameOrAddress, 
    userId // From /recruitment.box/:userId route
  } = useParams<{ 
    ensNameOrAddress: string;
    userId: string;
  }>();
  
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [ens, setEns] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  
  // Determine what identifier we have from the URL
  useEffect(() => {
    const identifier = userId || ensNameOrAddress;
    
    if (identifier) {
      if (isValidEthereumAddress(identifier)) {
        setAddress(identifier);
        setEns(undefined);
      } else {
        const ensValue = identifier.includes('.') ? identifier : `${identifier}.eth`;
        setEns(ensValue);
        setAddress(undefined);
      }
    }

    const storedWallet = localStorage.getItem('connectedWalletAddress');
    setConnectedWallet(storedWallet);
  }, [ensNameOrAddress, userId]);

  const { loading, passport, blockchainProfile, transactions, resolvedEns, blockchainExtendedData, avatarUrl } = useProfileData(
    ens, 
    address
  );
  
  console.log('Profile data:', {
    loading,
    passport,
    bio: passport?.bio,
    blockchainExtendedData,
    additionalEnsDomains: passport?.additionalEnsDomains,
    socialLinks: passport?.socials
  });
  
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

  // Combine social links from all sources
  const combinedSocials = {
    ...(passport?.socials || {}),
    ...(blockchainProfile?.socials || {})
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="container mx-auto px-4 md:px-8" style={{ maxWidth: '21cm' }}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <ProfileNavigationBar />
          </div>
          
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
        
        <div className="mx-auto bg-white shadow-lg rounded-sm border border-gray-200" style={{
          width: '100%',
          maxWidth: '21cm', /* A4 width */
          position: 'relative',
        }}>
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
                socials: combinedSocials,
                bio: '' // Remove bio
              }} />
              
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left column - Profile info */}
                  <div className="md:col-span-1">
                    <ProfileInfoSection 
                      passportId={passport.passport_id}
                      ownerAddress={passport.owner_address}
                      socials={combinedSocials}
                    />
                  </div>
                  
                  {/* Right column - Social Links and Other Data */}
                  <div className="md:col-span-2">
                    <SocialLinks 
                      ensName={resolvedEns || (passport.passport_id?.includes('.eth') ? passport.passport_id : undefined)}
                      links={blockchainProfile?.ensLinks || []}
                      socials={combinedSocials}
                      additionalEnsDomains={passport.additionalEnsDomains}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <ProfileNotFound />
          )}
        </div>
      </div>
    </div>
  );
};

export default TalentProfile;
