
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
import ProfileNotFound from '@/components/talent/profile/ProfileNotFound';
import AvatarSection from '@/components/talent/profile/components/AvatarSection';
import VerifiedWorkExperience from '@/components/talent/profile/components/VerifiedWorkExperience';
import SkillsCard from '@/components/talent/profile/components/SkillsCard';
import PoapSection from '@/components/talent/profile/components/poap/PoapSection';

const TalentProfile = () => {
  const { ensNameOrAddress } = useParams<{ensNameOrAddress: string}>();
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [ens, setEns] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [loadingTimeout, setLoadingTimeout] = useState<boolean>(false);
  
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

  // Handler for the export PDF dropdown item
  const handleExportPdf = () => {
    // This correctly calls the function returned by useReactToPrint
    exportAsPDF();
  };

  // If loading timeout occurred and still loading, show error message
  if (loadingTimeout && loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 md:py-8">
        <div className="container mx-auto px-4" style={{ maxWidth: '21cm' }}>
          <HeaderContainer>
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't load the profile for {ensNameOrAddress}. The request timed out.
              </p>
              <Link to="/">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Home
                </Button>
              </Link>
            </div>
          </HeaderContainer>
        </div>
      </div>
    );
  }

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
                <DropdownMenuItem onClick={handleExportPdf}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* A4 Profile Page */}
        <div ref={profileRef} id="resume-pdf">
          {loading && !loadingTimeout ? (
            <ProfileSkeleton />
          ) : passport ? (
            <HeaderContainer>
              <div className="grid grid-cols-1 md:grid-cols-10 gap-8">
                {/* Left column with avatar and social links - 30% width */}
                <div className="md:col-span-3">
                  <div className="flex flex-col items-center">
                    <AvatarSection 
                      avatarUrl={avatarUrl || passport.avatar_url}
                      name={passport.name}
                      ownerAddress={passport.owner_address}
                      socials={{
                        ...passport.socials,
                        linkedin: passport.socials.linkedin ? "https://www.linkedin.com/in/thirdweb" : undefined
                      }}
                      bio={passport.bio}
                      displayIdentity={ensNameOrAddress}
                      additionalEnsDomains={passport.additionalEnsDomains}
                    />
                  </div>
                </div>
                
                {/* Right column with work experience - 70% width */}
                <div className="md:col-span-7">
                  <VerifiedWorkExperience 
                    walletAddress={passport.owner_address} 
                  />
                  <SkillsCard
                    walletAddress={passport.owner_address}
                    skills={passport.skills}
                  />
                  <PoapSection
                    walletAddress={passport.owner_address}
                  />
                </div>
              </div>
            </HeaderContainer>
          ) : (
            <ProfileNotFound />
          )}
        </div>
      </div>
    </div>
  );
};

export default TalentProfile;
