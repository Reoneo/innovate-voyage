
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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
    handleDisconnect,
    handleSaveChanges,
    handleSearch,
    avatarUrl
  } = useProfilePage();

  // Set meta tags for the profile
  useEffect(() => {
    // Apply scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 overflow-x-hidden">
      <Helmet>
        <title>{ensNameOrAddress ? `${ensNameOrAddress} | Profile` : 'Profile'}</title>
        <meta name="description" content={`View ${ensNameOrAddress}'s blockchain profile`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={ensNameOrAddress ? `${ensNameOrAddress} | Profile` : 'Profile'} />
        <meta property="og:description" content={`View ${ensNameOrAddress}'s blockchain profile`} />
        {avatarUrl && <meta property="og:image" content={avatarUrl} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={ensNameOrAddress ? `${ensNameOrAddress} | Profile` : 'Profile'} />
        <meta name="twitter:description" content={`View ${ensNameOrAddress}'s blockchain profile`} />
        {avatarUrl && <meta name="twitter:image" content={avatarUrl} />}
        
        {/* Favicon for browser tabs and saved favorites */}
        {avatarUrl && <link rel="icon" type="image/png" href={avatarUrl} />}
        {avatarUrl && <link rel="apple-touch-icon" href={avatarUrl} />}
      </Helmet>
      
      <div className="container mx-auto px-4" style={{ maxWidth: '950px', width: '100%' }}>
        {/* Navigation Bar - Fixed at top */}
        <div className="flex justify-center sticky top-0 z-50 mb-6 md:mb-8">
          <ProfileNavbar 
            connectedWallet={connectedWallet}
            onDisconnect={handleDisconnect}
            onSaveChanges={handleSaveChanges}
            onSearch={handleSearch}
          />
        </div>
        
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
  );
};

export default TalentProfile;
