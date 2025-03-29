
import React from 'react';
import { useParams } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import { usePdfExport } from '@/hooks/usePdfExport';

import ProfileSkeleton from '@/components/talent/profile/ProfileSkeleton';
import ProfileHeader from '@/components/talent/profile/ProfileHeader';
import ProfileNavigationBar from '@/components/talent/profile/ProfileNavigationBar';
import ProfileTabsContainer from '@/components/talent/profile/ProfileTabsContainer';
import ProfileNotFound from '@/components/talent/profile/ProfileNotFound';

const TalentProfile = () => {
  const { ensName, address } = useParams<{ ensName: string; address: string }>();
  const { loading, passport, blockchainProfile, transactions, resolvedEns } = useProfileData(ensName, address);
  const { profileRef, exportAsPDF } = usePdfExport();

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <ProfileNavigationBar onExportPdf={exportAsPDF} />
      
      {loading ? (
        <ProfileSkeleton />
      ) : passport ? (
        <div ref={profileRef} className="space-y-6">
          <ProfileHeader passport={passport} />
          <ProfileTabsContainer 
            passport={{
              ...passport,
              skills: passport.skills || [],
              socials: passport.socials || {}
            }}
            blockchainProfile={blockchainProfile}
            transactions={transactions}
            resolvedEns={resolvedEns}
            onExportPdf={exportAsPDF}
          />
        </div>
      ) : (
        <ProfileNotFound />
      )}
    </div>
  );
};

export default TalentProfile;
