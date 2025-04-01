
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import { usePdfExport } from '@/hooks/usePdfExport';
import { useProfileIdentity } from '@/hooks/useProfileIdentity';
import { useConnectedWallet } from '@/hooks/useConnectedWallet';

import ProfileHeader from '@/components/talent/profile/components/ProfileHeader';
import ProfileWalletMenu from '@/components/talent/profile/components/ProfileWalletMenu';
import ProfileContent from '@/components/talent/profile/components/ProfileContent';

const TalentProfile = () => {
  const navigate = useNavigate();
  const { address, ens, displayIdentity } = useProfileIdentity();
  const { connectedWallet } = useConnectedWallet();
  
  // Redirect if no valid identity found
  useEffect(() => {
    if (!address && !ens) {
      console.error("No valid identity found in URL");
      navigate('/');
    }
  }, [address, ens, navigate]);

  const { loading, passport, blockchainProfile, blockchainExtendedData, avatarUrl } = useProfileData(ens, address);
  const { profileRef, exportAsPDF } = usePdfExport();

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="container mx-auto px-4" style={{ maxWidth: '21cm' }}>
        {/* Page Header with back button and wallet dropdown */}
        <ProfileHeader>
          <ProfileWalletMenu 
            connectedWallet={connectedWallet} 
            onExportPDF={exportAsPDF} 
          />
        </ProfileHeader>
        
        {/* A4 Profile Page */}
        <div ref={profileRef} id="resume-pdf">
          <ProfileContent 
            loading={loading}
            passport={passport}
            displayIdentity={displayIdentity}
            profileRef={profileRef}
          />
        </div>
      </div>
    </div>
  );
};

export default TalentProfile;
