
import React from 'react';
import AvatarSection from '../AvatarSection';
import MobileActivityColumn from './MobileActivityColumn';
import { Separator } from '@/components/ui/separator';

interface MobileLayoutProps {
  passport: any;
  ensNameOrAddress?: string;
  githubUsername: string | null;
  showGitHubSection: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  passport,
  ensNameOrAddress,
  githubUsername,
  showGitHubSection
}) => {
  if (!passport) {
    return <div>Loading profile...</div>; // Or some skeleton
  }

  return (
    <div className="flex flex-col w-full px-2 pt-4 pb-20 space-y-6 overflow-y-auto h-screen"> {/* Added pb-20 for scroll room */}
      <AvatarSection
        avatarUrl={passport.avatar_url}
        name={passport.name}
        ownerAddress={passport.owner_address}
        socials={passport.socials}
        additionalEnsDomains={passport.additionalEnsDomains}
        bio={passport.bio}
        displayIdentity={ensNameOrAddress}
        keywords={passport.ensLinks?.keywords} // Pass keywords
      />
      
      <Separator className="my-4" />
      
      <MobileActivityColumn
        passport={passport}
        githubUsername={githubUsername}
        showGitHubSection={showGitHubSection}
        ensNameOrAddress={ensNameOrAddress}
      />
    </div>
  );
};

export default MobileLayout;
