
import React from 'react';
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
    location,
    handleDisconnect,
    handleSaveChanges,
    handleSearch
  } = useProfilePage();

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 overflow-x-hidden">
      <div className="container mx-auto px-4" style={{ maxWidth: '950px', width: '100%' }}>
        {/* Navigation Bar - Centered above the profile and sticky */}
        <div className="flex justify-center mb-6 md:mb-8 sticky top-0 z-50">
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
          location={location}
        />
      </div>
    </div>
  );
};

export default TalentProfile;
