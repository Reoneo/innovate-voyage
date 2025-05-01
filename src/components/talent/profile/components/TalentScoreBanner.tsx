
import React, { useState } from 'react';
import TalentScoreBadge from './scores/TalentScoreBadge';
import TransactionsBadge from './scores/TransactionsBadge';
import ScoreDialog from './scores/ScoreDialog';
import { useScoresData } from '@/hooks/useScoresData';
import { NftCollectionsSection } from './nft/NftCollectionsSection';

interface TalentScoreBannerProps {
  walletAddress: string;
}

const TalentScoreBanner: React.FC<TalentScoreBannerProps> = ({ walletAddress }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<'talent' | 'webacy' | 'transactions'>('talent');
  const { score, txCount, loading } = useScoresData(walletAddress);
  const [showNftCollections, setShowNftCollections] = useState(false);

  const handleBadgeClick = (type: 'talent' | 'webacy' | 'transactions') => {
    setActiveDialog(type);
    setDialogOpen(true);
  };

  const handleNftButtonClick = () => {
    setShowNftCollections(true);
  };

  if (!walletAddress) return null;

  // Only show scores if data is available
  const showTalentScore = score !== null && score !== undefined;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showTalentScore && (
          <TalentScoreBadge 
            score={score} 
            onClick={() => handleBadgeClick('talent')}
            isLoading={loading} 
          />
        )}
        <TransactionsBadge 
          txCount={txCount}
          walletAddress={walletAddress}
          onClick={handleNftButtonClick}
          isLoading={loading} 
        />
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
          webacyData: null,
          txCount,
          walletAddress
        }}
      />
    </>
  );
};

export default TalentScoreBanner;
