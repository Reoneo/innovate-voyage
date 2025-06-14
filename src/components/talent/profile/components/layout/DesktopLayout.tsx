import React from 'react';
import AvatarSection from '../AvatarSection';
import TalentScoreBanner from '../TalentScoreBanner';
import FarcasterCastsSection from '../farcaster/FarcasterCastsSection';
import PoapSection from '../poap/PoapSection';

interface DesktopLayoutProps {
  passport: any;
  ensNameOrAddress?: string;
  githubUsername: string | null;
  showGitHubSection: boolean;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  passport,
  ensNameOrAddress,
  githubUsername,
  showGitHubSection
}) => {
  return (
    <div className="hidden md:grid md:grid-cols-2 gap-8 w-full">
      {/* Left Column: Avatar, Social Links, POAPs */}
      <div className="space-y-6">
        <div className="scale-[0.6] origin-top">
          <AvatarSection
            avatarUrl={passport.avatar_url}
            name={passport.name}
            ownerAddress={passport.owner_address}
            socials={{
              ...passport.socials,
              linkedin: undefined
            }}
            bio={passport.bio}
            displayIdentity={ensNameOrAddress}
            additionalEnsDomains={passport.additionalEnsDomains}
          />
        </div>
        
        {/* POAPs at bottom of left column */}
        <div className="mt-8">
          <PoapSection walletAddress={passport.owner_address} />
        </div>
      </div>
      
      {/* Right Column: Scores, GitHub, Farcaster */}
      <div className="space-y-6">
        {/* Talent Score Banner at top */}
        <TalentScoreBanner walletAddress={passport.owner_address} />
        
        {/* GitHub Section Removed */}
        
        {/* Farcaster Section */}
        <FarcasterCastsSection 
          ensName={ensNameOrAddress?.includes('.') ? ensNameOrAddress : undefined}
          address={passport.owner_address}
        />
      </div>
    </div>
  );
};

export default DesktopLayout;
