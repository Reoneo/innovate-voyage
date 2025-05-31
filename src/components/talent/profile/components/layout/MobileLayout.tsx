
import React from 'react';
import TalentScoreBanner from '../TalentScoreBanner';
import BlockchainActivitySection from '../blockchain/BlockchainActivitySection';
import PoapSection from '../poap/PoapSection';
import GitHubContributionGraph from '../github/GitHubContributionGraph';
import FarcasterCastsSection from '../farcaster/FarcasterCastsSection';

interface MobileLayoutProps {
  passport: any;
  ensNameOrAddress?: string;
  showGitHubSection: boolean;
  githubUsername: string | null;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  passport,
  ensNameOrAddress,
  showGitHubSection,
  githubUsername
}) => {
  return (
    <div className="w-full space-y-4 md:space-y-6">
      <TalentScoreBanner walletAddress={passport.owner_address} />
      
      {/* Blockchain Activity Section */}
      {passport.owner_address && (
        <div className="w-full">
          <BlockchainActivitySection walletAddress={passport.owner_address} />
        </div>
      )}
      
      {/* POAP Section */}
      <div className="w-full">
        <PoapSection walletAddress={passport.owner_address} />
      </div>
      
      {/* GitHub Section */}
      {showGitHubSection && (
        <div className="w-full">
          <GitHubContributionGraph username={githubUsername!} />
        </div>
      )}
      
      {/* Farcaster Section */}
      <div className="w-full">
        <FarcasterCastsSection 
          ensName={ensNameOrAddress?.includes('.') ? ensNameOrAddress : undefined}
          address={passport.owner_address}
        />
      </div>
    </div>
  );
};

export default MobileLayout;
