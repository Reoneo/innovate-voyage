
import React, { useEffect } from 'react';
import { useProfilePage } from '@/hooks/useProfilePage';
import ProfileNavbar from '@/components/talent/profile/ProfileNavbar';
import ProfileContent from '@/components/talent/profile/ProfileContent';
import { Helmet } from 'react-helmet-async';

const TalentProfile = () => {
  const { 
    ensNameOrAddress,
    loading, 
    loadingTimeout,
    passport, 
    profileRef,
    connectedWallet,
    handleDisconnect,
    handleSaveChanges,
    handleSearch,
    avatarUrl
  } = useProfilePage();

  // Use the avatar image for the document favicon
  useEffect(() => {
    if (avatarUrl) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = avatarUrl;
      }
    }
  }, [avatarUrl]);

  return (
    <>
      <Helmet>
        <title>{ensNameOrAddress || 'Profile'} | Blockchain Passport</title>
        <meta name="description" content={`View ${ensNameOrAddress}'s blockchain passport and credentials`} />
        {avatarUrl && <meta property="og:image" content={avatarUrl} />}
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        {/* Navigation Bar - Fixed at the top */}
        <ProfileNavbar 
          connectedWallet={connectedWallet}
          onDisconnect={handleDisconnect}
          onSaveChanges={handleSaveChanges}
          onSearch={handleSearch}
          avatarUrl={avatarUrl}
        />
        
        {/* Content with small gap after navbar - added profile-container class */}
        <div className="container mx-auto px-4 pt-6 pb-8 profile-container" style={{ maxWidth: '950px', width: '100%' }}>
          {/* Profile Content */}
          <ProfileContent 
            loading={loading}
            loadingTimeout={loadingTimeout}
            passport={passport}
            profileRef={profileRef}
            ensNameOrAddress={ensNameOrAddress}
          />
        </div>
      </div>
    </>
  );
};

export default TalentProfile;
