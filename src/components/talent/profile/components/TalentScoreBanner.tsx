
import React, { useState } from 'react';
import TalentScoreBadge from './scores/TalentScoreBadge';
import TransactionsBadge from './scores/TransactionsBadge';
import BlockchainActivityBadge from './scores/BlockchainActivityBadge';
import ScoreDialog from './scores/ScoreDialog';
import { useScoresData } from '@/hooks/useScoresData';
import { NftCollectionsSection } from './nft/NftCollectionsSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card } from '@/components/ui/card';

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

  // Use card-style grid like your screenshot, with shadow and spacing
  return (
    <>
      <div className="grid grid-cols-1">
        <div className="flex justify-between items-stretch gap-4 mb-6">
          {/* Card-like appearance for all stat badges */}
          <Card className="flex-1 p-0 shadow-md rounded-2xl bg-white border transition hover:shadow-lg hover:scale-[1.01] duration-150">
            <BlockchainActivityBadge walletAddress={walletAddress} onClick={() => handleBadgeClick('blockchain')} />
          </Card>
          {showTalentScore && (
            <Card className="flex-1 p-0 shadow-md rounded-2xl bg-white border transition hover:shadow-lg hover:scale-[1.01] duration-150">
              <TalentScoreBadge score={score} onClick={() => handleBadgeClick('talent')} isLoading={loading} talentId={walletAddress} />
            </Card>
          )}
          <Card className="flex-1 p-0 shadow-md rounded-2xl bg-white border transition hover:shadow-lg hover:scale-[1.01] duration-150">
            <TransactionsBadge txCount={txCount} walletAddress={walletAddress} onClick={handleNftButtonClick} isLoading={loading} />
          </Card>
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
    </>
  );
};
export default TalentScoreBanner;
