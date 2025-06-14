
import React from 'react';
import MobileProfileColumn from './MobileProfileColumn';
import MobileActivityColumn from './MobileActivityColumn';
import EducationSection from '../education/EducationSection';

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
  // Normalize socials data for components
  const normalizedSocials = {
    twitter: passport.socials?.twitter,
    github: passport.socials?.github,
    linkedin: passport.socials?.linkedin,
    discord: passport.socials?.discord,
    website: passport.socials?.website,
    email: passport.socials?.email,
    telegram: passport.socials?.telegram,
    instagram: passport.socials?.instagram,
    youtube: passport.socials?.youtube,
    facebook: passport.socials?.facebook
  };

  const telephone = passport.socials?.telephone || passport.telephone;
  const displayName = passport.name || ensNameOrAddress || 'Anonymous';

  return (
    <div className="flex flex-col space-y-4 p-4 w-full h-full overflow-y-auto">
      {/* Profile Column */}
      <MobileProfileColumn 
        passport={passport}
        ensNameOrAddress={ensNameOrAddress}
        normalizedSocials={normalizedSocials}
        telephone={telephone}
        isOwner={false}
        displayName={displayName}
      />
      
      {/* Education Section */}
      <EducationSection walletAddress={passport.owner_address} />
      
      {/* Activity Column */}
      <MobileActivityColumn 
        passport={passport}
        ensNameOrAddress={ensNameOrAddress}
        githubUsername={githubUsername}
        showGitHubSection={showGitHubSection}
        normalizedSocials={normalizedSocials}
      />
    </div>
  );
};

export default MobileLayout;
