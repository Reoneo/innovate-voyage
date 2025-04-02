
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import { usePdfExport } from '@/hooks/usePdfExport';
import { isValidEthereumAddress } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Wallet, LogOut, Save, Download, ArrowLeft, AlertTriangle } from 'lucide-react';
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
import { useEnsResolver } from '@/hooks/useEnsResolver';

const TalentProfile = () => {
  const { ensNameOrAddress } = useParams<{ensNameOrAddress: string}>();
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [ens, setEns] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [loadStartTime, setLoadStartTime] = useState<number>(Date.now());
  const [loadTimeout, setLoadTimeout] = useState<boolean>(false);
  
  useEffect(() => {
    if (ensNameOrAddress) {
      setLoadStartTime(Date.now());
      setLoadTimeout(false);
      
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

  // Use useEnsResolver directly to access the timeoutError
  const { timeoutError } = useEnsResolver(ens, address);
  
  // Get profile data
  const { loading, passport, blockchainProfile, blockchainExtendedData, avatarUrl } = useProfileData(ens, address);
  
  // Check for timeout after 4 seconds
  useEffect(() => {
    const timeoutCheck = setTimeout(() => {
      if (loading && Date.now() - loadStartTime > 4000) {
        setLoadTimeout(true);
      }
    }, 4000);
    
    return () => clearTimeout(timeoutCheck);
  }, [loading, loadStartTime]);

  // Update timeout state when we get the timeoutError from useEnsResolver
  useEffect(() => {
    if (timeoutError) {
      setLoadTimeout(true);
    }
  }, [timeoutError]);
  
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

  // Show error state if loading takes too long
  if ((loadTimeout || timeoutError) && loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 md:py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Profile Loading Error</h2>
            <p className="text-muted-foreground mb-6">
              The profile for <span className="font-medium">{ensNameOrAddress}</span> is taking too long to load. Please try again later.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
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
                    displayIdentity={ensNameOrAddress}
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
                  We couldn't find a profile for {ensNameOrAddress}
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
