
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
    handleDisconnect,
    handleSaveChanges
  } = useProfilePage();

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 overflow-x-hidden">
      <div className="container mx-auto px-4" style={{ maxWidth: '800px', width: '100%' }}>
        {/* Navigation Bar - Centered above the profile */}
        <div className="flex justify-center mb-8">
          <ProfileNavbar 
            connectedWallet={connectedWallet}
            onDisconnect={handleDisconnect}
            onSaveChanges={handleSaveChanges}
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
