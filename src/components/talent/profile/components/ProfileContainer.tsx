
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TooltipProvider } from "@/components/ui/tooltip";
import { BlockchainPassport } from '@/lib/utils';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import ProfileHeader from '@/components/talent/profile/ProfileHeader';
import ProfileTabsContainer from '@/components/talent/profile/ProfileTabsContainer';
import ErrorAlert from './ErrorAlert';

interface ProfileContainerProps {
  passport: BlockchainPassport;
  blockchainProfile?: BlockchainProfile | null;
  transactions?: any[] | null;
  resolvedEns?: string;
  onExportPdf: () => void;
  blockchainExtendedData?: {
    mirrorPosts: number;
    lensActivity: number;
    boxDomains: string[];
    snsActive: boolean;
    description?: string;
  };
  avatarUrl?: string;
  error: Error | null;
  profileRef: React.RefObject<HTMLDivElement>;
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({
  passport,
  blockchainProfile,
  transactions,
  resolvedEns,
  onExportPdf,
  blockchainExtendedData,
  avatarUrl,
  error,
  profileRef
}) => {
  return (
    <TooltipProvider>
      <div ref={profileRef} className="space-y-4 md:space-y-6" id="resume-pdf">
        <ProfileHeader passport={{
          passport_id: passport.passport_id,
          owner_address: passport.owner_address,
          avatar_url: avatarUrl || passport.avatar_url || '/placeholder.svg',
          name: passport.name,
          category: passport.category || 'Blockchain User',
          socials: passport.socials || {},
          bio: blockchainProfile?.description || blockchainExtendedData?.description
        }} />
        
        <ErrorAlert error={error} />
        
        <ProfileTabsContainer 
          passport={{
            ...passport,
            category: passport.category || 'Blockchain User'
          }}
          blockchainProfile={blockchainProfile}
          transactions={transactions}
          resolvedEns={resolvedEns}
          onExportPdf={onExportPdf}
          blockchainExtendedData={blockchainExtendedData}
          avatarUrl={avatarUrl}
          ownerAddress={passport.owner_address}
          additionalEnsDomains={passport.additionalEnsDomains || []}
          blockchainError={error}
        />
      </div>
    </TooltipProvider>
  );
};

export default ProfileContainer;
