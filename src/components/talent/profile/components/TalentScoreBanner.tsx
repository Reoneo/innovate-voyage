
import React, { useState } from 'react';
import TalentScoreBadge from './scores/TalentScoreBadge';
import TransactionsBadge from './scores/TransactionsBadge';
import BlockchainActivityBadge from './scores/BlockchainActivityBadge';
import ScoreDialog from './scores/ScoreDialog';
import { useScoresData } from '@/hooks/useScoresData';
import { NftCollectionsSection } from './nft/NftCollectionsSection';
import { useIsMobile } from '@/hooks/use-mobile';
interface TalentScoreBannerProps {
  walletAddress: string;
}
const TalentScoreBanner: React.FC<TalentScoreBannerProps> = ({
  walletAddress
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<'talent' | 'webacy' | 'transactions' | 'blockchain'>('talent');
  const {
    score,
    txCount,
    loading
  } = useScoresData(walletAddress);
  // SECURITY BADGE REMOVED per request

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
  return <>
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6`}
      >
        <div className="w-full">
          <BlockchainActivityBadge walletAddress={walletAddress} onClick={() => handleBadgeClick('blockchain')} />
        </div>
        {/* SECURITY BADGE REMOVED */}
        {showTalentScore && (
          <div className="w-full">
            <TalentScoreBadge score={score} onClick={() => handleBadgeClick('talent')} isLoading={loading} talentId={walletAddress} />
          </div>
        )}
        <div className="w-full">
          <TransactionsBadge txCount={txCount} walletAddress={walletAddress} onClick={handleNftButtonClick} isLoading={loading} />
        </div>
      </div>

      {/* Center NFT row for spacing */}
      <div>
        <NftCollectionsSection walletAddress={walletAddress} showCollections={showNftCollections} onOpenChange={setShowNftCollections} />
      </div>

      <ScoreDialog open={dialogOpen} onOpenChange={setDialogOpen} type={activeDialog} data={{
        score,
        webacyData: null, // Not passed, security feature disabled for now
        txCount,
        walletAddress
      }} />
    </>;
};
export default TalentScoreBanner;
