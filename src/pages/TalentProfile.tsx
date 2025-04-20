
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useProfilePage } from '@/hooks/useProfilePage';
import ProfileNavbar from '@/components/talent/profile/ProfileNavbar';
import ProfileContent from '@/components/talent/profile/ProfileContent';

const TalentProfile = () => {
  const { 
    ensNameOrAddress,
    loading, 
    loadingTimeout,
    passport, 
    profileRef,
    connectedWallet,
    blockchainProfile,
    avatarUrl,
    handleDisconnect,
    handleSaveChanges,
    handleExportPdf
  } = useProfilePage();

  // Update page title and favicon dynamically
  useEffect(() => {
    if (passport?.name) {
      document.title = passport.name;
      
      // Update favicon and apple touch icon
      const avatarUrl = passport.avatar_url || '/placeholder.svg';
      document.getElementById('dynamic-favicon')?.setAttribute('href', avatarUrl);
      document.getElementById('dynamic-apple-touch-icon')?.setAttribute('href', avatarUrl);
      document.getElementById('dynamic-og-image')?.setAttribute('content', avatarUrl);
      
      // Update apple mobile web app title
      document.querySelector('meta[name="apple-mobile-web-app-title"]')?.setAttribute('content', passport.name);
    }
  }, [passport]);

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="container mx-auto px-4">
        <ProfileNavbar 
          connectedWallet={connectedWallet}
          onDisconnect={handleDisconnect}
          onSaveChanges={handleSaveChanges}
          onExportPdf={handleExportPdf}
        />
        
        <ProfileContent 
          loading={loading}
          loadingTimeout={loadingTimeout}
          passport={passport}
          profileRef={profileRef}
          ensNameOrAddress={ensNameOrAddress}
        />
      </div>
    </div>
  );
};

export default TalentProfile;
