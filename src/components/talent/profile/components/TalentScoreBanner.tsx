import React, { useState } from 'react';
import TalentScoreBadge from './scores/TalentScoreBadge';
import TransactionsBadge from './scores/TransactionsBadge';
import SecurityScoreBadge from './scores/SecurityScoreBadge';
import BlockchainActivityBadge from './scores/BlockchainActivityBadge';
import ScoreDialog from './scores/ScoreDialog';
import { useScoresData } from '@/hooks/useScoresData';
import { NftCollectionsSection } from './nft/NftCollectionsSection';
import GitHubContributionGraph from './github/GitHubContributionGraph';
import { useWebacyData } from '@/hooks/useWebacyData';
import { useIsMobile } from '@/hooks/use-mobile';
interface TalentScoreBannerProps {
  walletAddress: string;
  githubUsername?: string | null;
  showGitHubSection?: boolean;
}
const TalentScoreBanner: React.FC<TalentScoreBannerProps> = ({
  walletAddress,
  githubUsername,
  showGitHubSection
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<'talent' | 'webacy' | 'transactions' | 'blockchain'>('talent');
  const {
    score,
    txCount,
    loading
  } = useScoresData(walletAddress);
  const {
    securityData,
    isLoading: webacyLoading
  } = useWebacyData(walletAddress);
  const [showNftCollections, setShowNftCollections] = useState(false);
  const isMobile = useIsMobile();
  const handleBadgeClick = (type: 'talent' | 'webacy' | 'transactions' | 'blockchain') => {
    setActiveDialog(type);
    setDialogOpen(true);
  };
  const handleNftButtonClick = () => {
    setShowNftCollections(true);
  };
  if (!walletAddress) return null;
  const showTalentScore = score !== null && score !== undefined;
  return <div className="bg-white rounded-lg p-4 shadow-sm border py-[17px]">
      {/* Main scores grid - More compact */}
      <div className={`${isMobile ? 'grid grid-cols-2 gap-2 mb-4' : 'grid grid-cols-4 gap-4 mb-6'}`}>
        <div className="transform hover:scale-105 transition-all duration-200">
          <BlockchainActivityBadge walletAddress={walletAddress} onClick={() => handleBadgeClick('blockchain')} />
        </div>
        <div className="transform hover:scale-105 transition-all duration-200">
          <SecurityScoreBadge webacyData={securityData} onClick={() => handleBadgeClick('webacy')} isLoading={webacyLoading} />
        </div>
        {showTalentScore && <div className="transform hover:scale-105 transition-all duration-200">
            <TalentScoreBadge score={score} onClick={() => handleBadgeClick('talent')} isLoading={loading} talentId={walletAddress} />
          </div>}
        <div className="transform hover:scale-105 transition-all duration-200">
          <TransactionsBadge txCount={txCount} walletAddress={walletAddress} onClick={handleNftButtonClick} isLoading={loading} />
        </div>
      </div>

      {/* GitHub Contributions - Compact */}
      {showGitHubSection && githubUsername && <div className="mb-4">
          <GitHubContributionGraph username={githubUsername} />
        </div>}

      <NftCollectionsSection walletAddress={walletAddress} showCollections={showNftCollections} onOpenChange={setShowNftCollections} />

      <ScoreDialog open={dialogOpen} onOpenChange={setDialogOpen} type={activeDialog} data={{
      score,
      webacyData: securityData,
      txCount,
      walletAddress
    }} />
    </div>;
};
export default TalentScoreBanner;