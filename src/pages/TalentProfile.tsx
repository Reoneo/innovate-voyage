
import React from 'react';
import { useParams } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import { usePdfExport } from '@/hooks/usePdfExport';
import { useIsMobile } from '@/hooks/use-mobile';

import ProfileSkeleton from '@/components/talent/profile/ProfileSkeleton';
import ProfileHeader from '@/components/talent/profile/ProfileHeader';
import ProfileNavigationBar from '@/components/talent/profile/ProfileNavigationBar';
import ProfileTabsContainer from '@/components/talent/profile/ProfileTabsContainer';
import ProfileNotFound from '@/components/talent/profile/ProfileNotFound';

const TalentProfile = () => {
  const { ensName, address } = useParams<{ ensName: string; address: string }>();
  const { loading, passport, blockchainProfile, transactions, resolvedEns, blockchainExtendedData, avatarUrl } = useProfileData(ensName, address);
  const { profileRef, exportAsPDF } = usePdfExport();
  const isMobile = useIsMobile();

  return (
    <div className={`container mx-auto py-4 md:py-8 ${isMobile ? 'px-2' : 'max-w-5xl'}`}>
      <ProfileNavigationBar onExportPdf={exportAsPDF} />
      
      {loading ? (
        <ProfileSkeleton />
      ) : passport ? (
        <div ref={profileRef} className="space-y-4 md:space-y-6" id="resume-pdf">
          <ProfileHeader passport={{
            passport_id: passport.passport_id,
            owner_address: passport.owner_address,
            avatar_url: avatarUrl || passport.avatar_url || '/placeholder.svg',
            name: passport.name,
            score: passport.score,
            category: passport.category,
            socials: passport.socials || {}
          }} />
          <ProfileTabsContainer 
            passport={passport}
            blockchainProfile={blockchainProfile}
            transactions={transactions}
            resolvedEns={resolvedEns}
            onExportPdf={exportAsPDF}
            blockchainExtendedData={blockchainExtendedData}
            avatarUrl={avatarUrl}
          />
        </div>
      ) : (
        <ProfileNotFound />
      )}
    </div>
  );
};

export default TalentProfile;
