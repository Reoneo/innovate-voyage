
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import { usePdfExport } from '@/hooks/usePdfExport';
import { isValidEthereumAddress } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Wallet, LogOut, Save, Download, ArrowLeft } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import HeaderContainer from '@/components/talent/profile/components/HeaderContainer';
import ProfileSkeleton from '@/components/talent/profile/ProfileSkeleton';
import AvatarSection from '@/components/talent/profile/components/AvatarSection';
import VerifiedWorkExperience from '@/components/talent/profile/components/VerifiedWorkExperience';

const TalentProfile = () => {
  const { ensNameOrAddress, domain, userId } = useParams<{
    ensNameOrAddress?: string;
    domain?: string;
    userId?: string;
  }>();
  
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [ens, setEns] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  
  useEffect(() => {
    // Handle different URL formats
    let identityToUse: string | undefined;
    
    // Case 1: /recruitment.box/:userId format
    if (userId && domain === 'recruitment.box') {
      identityToUse = `${userId}.box`;
    }
    // Case 2: /:domain/:userId format
    else if (domain && userId) {
      identityToUse = `${userId}.${domain}`;
    }
    // Case 3: /:ensNameOrAddress format (original)
    else if (ensNameOrAddress) {
      identityToUse = ensNameOrAddress;
    }
    
    console.log('Identity to use:', identityToUse);
    
    if (identityToUse) {
      if (isValidEthereumAddress(identityToUse)) {
        setAddress(identityToUse);
      } else {
        const ensValue = identityToUse.includes('.') ? identityToUse : `${identityToUse}.eth`;
        setEns(ensValue);
      }
    }

    const storedWallet = localStorage.getItem('connectedWalletAddress');
    setConnectedWallet(storedWallet);
  }, [ensNameOrAddress, domain, userId]);

  // For display in UI
  const displayIdentity = userId && domain ? `${userId}.${domain}` : ensNameOrAddress;

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
        {/* Back Button */}
        <div className="flex items-center mb-4">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="ml-auto">
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
        
        {/* A4 Profile Page */}
        <div ref={profileRef} id="resume-pdf">
          {loading ? (
            <ProfileSkeleton />
          ) : passport ? (
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
                    displayIdentity={displayIdentity}
                    additionalEnsDomains={passport.additionalEnsDomains}
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
          ) : (
            <HeaderContainer>
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
                <p className="text-muted-foreground mb-6">
                  We couldn't find a profile for {displayIdentity}
                </p>
                <Link to="/">
                  <Button>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Home
                  </Button>
                </Link>
              </div>
            </HeaderContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalentProfile;
