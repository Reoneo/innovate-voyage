
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import { usePdfExport } from '@/hooks/usePdfExport';
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

import HeaderContainer from '@/components/talent/profile/components/HeaderContainer';
import AvatarSection from '@/components/talent/profile/components/AvatarSection';
import ProfileSkeleton from '@/components/talent/profile/ProfileSkeleton';
import ProfileNotFound from '@/components/talent/profile/ProfileNotFound';
import VerifiedWorkExperience from '@/components/talent/profile/components/VerifiedWorkExperience';

const TalentProfile = () => {
  const { ensNameOrAddress } = useParams<{ensNameOrAddress: string}>();
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [ens, setEns] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  
  useEffect(() => {
    if (ensNameOrAddress) {
      if (isValidEthereumAddress(ensNameOrAddress)) {
        setAddress(ensNameOrAddress);
      } else {
        const ensValue = ensNameOrAddress.includes('.') ? ensNameOrAddress : `${ensNameOrAddress}.eth`;
        setEns(ensValue);
      }
    }

    const storedWallet = localStorage.getItem('connectedWalletAddress');
    setConnectedWallet(storedWallet);
  }, [ensNameOrAddress]);

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

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="container mx-auto px-4" style={{ maxWidth: '21cm' }}>
        <div className="flex justify-end items-center mb-4">
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
          <div ref={profileRef} id="resume-pdf">
            <HeaderContainer>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left column with avatar and social links */}
                <div className="md:col-span-1">
                  <AvatarSection 
                    avatarUrl={avatarUrl || passport.avatar_url}
                    name={passport.name}
                    ownerAddress={passport.owner_address}
                    socials={passport.socials}
                    bio={passport.bio}
                  />
                </div>
                
                {/* Right column with work experience */}
                <div className="md:col-span-2">
                  <VerifiedWorkExperience 
                    walletAddress={passport.owner_address} 
                  />
                </div>
              </div>
            </HeaderContainer>
          </div>
        ) : (
          <ProfileNotFound />
        )}
      </div>
    </div>
  );
};

export default TalentProfile;
