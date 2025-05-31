
import React from 'react';
import AvatarSection from '../AvatarSection';
import TalentScoreBanner from '../TalentScoreBanner';
import GitHubContributionGraph from '../github/GitHubContributionGraph';
import FarcasterCastsSection from '../farcaster/FarcasterCastsSection';
import { useIsMobile } from '@/hooks/use-mobile';

interface TwoColumnDesktopLayoutProps {
  passport: any;
  ensNameOrAddress?: string;
  githubUsername: string | null;
  showGitHubSection: boolean;
}

const TwoColumnDesktopLayout: React.FC<TwoColumnDesktopLayoutProps> = ({
  passport,
  ensNameOrAddress,
  githubUsername,
  showGitHubSection
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    // Mobile layout - single column
    return (
      <div className="w-full space-y-4 md:space-y-6">
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
        
        <TalentScoreBanner walletAddress={passport.owner_address} />
        
        {showGitHubSection && (
          <GitHubContributionGraph username={githubUsername!} />
        )}
        
        <FarcasterCastsSection 
          ensName={ensNameOrAddress?.includes('.') ? ensNameOrAddress : undefined}
          address={passport.owner_address}
        />
      </div>
    );
  }

  // Desktop layout - two columns with 30:70 ratio
  return (
    <div className="hidden md:grid md:grid-cols-10 gap-8 w-full">
      {/* Column 1: Screenshot div (30% - 3 columns) */}
      <div className="col-span-3">
        <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Profile Screenshot</h3>
            <div className="bg-gray-100 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
              <p className="text-gray-500">Screenshot placeholder</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Column 2: Main content (70% - 7 columns) */}
      <div className="col-span-7 space-y-6">
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
        
        <TalentScoreBanner walletAddress={passport.owner_address} />
        
        {showGitHubSection && (
          <GitHubContributionGraph username={githubUsername!} />
        )}
        
        <FarcasterCastsSection 
          ensName={ensNameOrAddress?.includes('.') ? ensNameOrAddress : undefined}
          address={passport.owner_address}
        />
      </div>
    </div>
  );
};

export default TwoColumnDesktopLayout;
