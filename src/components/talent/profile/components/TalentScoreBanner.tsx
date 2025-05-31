
import React, { useState } from 'react';
import TalentScoreBadge from './scores/TalentScoreBadge';
import TransactionsBadge from './scores/TransactionsBadge';
import SecurityScoreBadge from './scores/SecurityScoreBadge';
import BlockchainActivityBadge from './scores/BlockchainActivityBadge';
import GitHubActivityBadge from './scores/GitHubActivityBadge';
import ScoreDialog from './scores/ScoreDialog';
import { useScoresData } from '@/hooks/useScoresData';
import { NftCollectionsSection } from './nft/NftCollectionsSection';
import { useWebacyData } from '@/hooks/useWebacyData';
import { useIsMobile } from '@/hooks/use-mobile';

interface TalentScoreBannerProps {
  walletAddress: string;
  githubUsername?: string;
}

const TalentScoreBanner: React.FC<TalentScoreBannerProps> = ({ 
  walletAddress, 
  githubUsername 
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<'talent' | 'webacy' | 'transactions' | 'blockchain' | 'github'>('talent');
  const { score, txCount, loading } = useScoresData(walletAddress);
  const { securityData, isLoading: webacyLoading } = useWebacyData(walletAddress);
  const [showNftCollections, setShowNftCollections] = useState(false);
  const isMobile = useIsMobile();

  const handleBadgeClick = (type: 'talent' | 'webacy' | 'transactions' | 'blockchain' | 'github') => {
    setActiveDialog(type);
    setDialogOpen(true);
  };

  const handleNftButtonClick = () => {
    setShowNftCollections(true);
  };

  if (!walletAddress) return null;

  const showTalentScore = score !== null && score !== undefined;

  return (
    <>
      {/* First row: Blockchain Activity, Builder Score, NFT Collection */}
      <div className={`${
        isMobile 
          ? 'flex flex-col gap-4' 
          : 'grid grid-cols-3 gap-6'
      } mb-6`}>
        <div className="transform hover:scale-105 transition-all duration-200">
          <BlockchainActivityBadge 
            walletAddress={walletAddress}
            onClick={() => handleBadgeClick('blockchain')}
          />
        </div>
        {showTalentScore && (
          <div className="transform hover:scale-105 transition-all duration-200">
            <TalentScoreBadge 
              score={score} 
              onClick={() => handleBadgeClick('talent')}
              isLoading={loading} 
              talentId={walletAddress} 
            />
          </div>
        )}
        <div className="transform hover:scale-105 transition-all duration-200">
          <TransactionsBadge 
            txCount={txCount}
            walletAddress={walletAddress}
            onClick={handleNftButtonClick}
            isLoading={loading} 
          />
        </div>
      </div>

      {/* Second row: Risk Score and GitHub Activity */}
      <div className={`${
        isMobile 
          ? 'flex flex-col gap-4' 
          : 'grid grid-cols-3 gap-6'
      } mb-8`}>
        <div className="transform hover:scale-105 transition-all duration-200">
          <SecurityScoreBadge 
            webacyData={securityData} 
            onClick={() => handleBadgeClick('webacy')}
            isLoading={webacyLoading} 
          />
        </div>
        {githubUsername && (
          <div className="transform hover:scale-105 transition-all duration-200">
            <GitHubActivityBadge 
              username={githubUsername}
              onClick={() => handleBadgeClick('github')}
              isLoading={false} 
            />
          </div>
        )}
        {/* Empty div to maintain grid layout */}
        <div></div>
      </div>

      <NftCollectionsSection 
        walletAddress={walletAddress} 
        showCollections={showNftCollections} 
        onOpenChange={setShowNftCollections}
      />

      <ScoreDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        type={activeDialog}
        data={{
          score,
          webacyData: securityData,
          txCount,
          walletAddress,
          githubUsername
        }}
      />
    </>
  );
};

export default TalentScoreBanner;
