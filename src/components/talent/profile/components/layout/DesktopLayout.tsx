
import React from 'react';
import TalentScoreBanner from '../TalentScoreBanner';
import BlockchainActivitySection from '../blockchain/BlockchainActivitySection';
import PoapSection from '../poap/PoapSection';
import GitHubContributionGraph from '../github/GitHubContributionGraph';
import FarcasterCastsSection from '../farcaster/FarcasterCastsSection';

interface DesktopLayoutProps {
  passport: any;
  ensNameOrAddress?: string;
  showGitHubSection: boolean;
  githubUsername: string | null;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  passport,
  ensNameOrAddress,
  showGitHubSection,
  githubUsername
}) => {
  return (
    <div className="w-full grid grid-cols-2 gap-8">
      {/* Column 1: POAP Section */}
      <div className="space-y-6">
        <PoapSection walletAddress={passport.owner_address} />
      </div>
      
      {/* Column 2: Scores, Blockchain Activity, GitHub, Farcaster */}
      <div className="space-y-6">
        <TalentScoreBanner walletAddress={passport.owner_address} />
        
        {/* Blockchain Activity Section */}
        {passport.owner_address && (
          <BlockchainActivitySection walletAddress={passport.owner_address} />
        )}
        
        {/* GitHub Section */}
        {showGitHubSection && (
          <GitHubContributionGraph username={githubUsername!} />
        )}
        
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
