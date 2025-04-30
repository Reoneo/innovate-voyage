
import React, { useState } from 'react';
import TalentScoreBadge from './scores/TalentScoreBadge';
import SecurityScoreBadge from './scores/SecurityScoreBadge';
import TransactionsBadge from './scores/TransactionsBadge';
import TallyBadge from './tally/TallyBadge';
import ScoreDialog from './scores/ScoreDialog';
import { useScoresData } from '@/hooks/useScoresData';
import { NftCollectionsSection } from './nft/NftCollectionsSection';
import WebacySecurity from './security/WebacySecurity';

interface TalentScoreBannerProps {
  walletAddress: string;
}

const TalentScoreBanner: React.FC<TalentScoreBannerProps> = ({ walletAddress }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<'talent' | 'webacy' | 'transactions' | 'tally'>('talent');
  const { score, webacyData, txCount, loading } = useScoresData(walletAddress);
  const [showNftCollections, setShowNftCollections] = useState(false);

  const handleBadgeClick = (type: 'talent' | 'webacy' | 'transactions' | 'tally') => {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {showTalentScore && (
          <TalentScoreBadge 
            score={score} 
            onClick={() => handleBadgeClick('talent')}
            isLoading={loading} 
          />
        )}
        <WebacySecurity walletAddress={walletAddress} />
        <TransactionsBadge 
          txCount={txCount}
          walletAddress={walletAddress}
          onClick={handleNftButtonClick}
          isLoading={loading} 
        />
      </div>
      
      {/* Second row of buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div></div> {/* Empty space under TalentScoreBadge */}
        <TallyBadge 
          walletAddress={walletAddress}
          onClick={() => handleBadgeClick('tally')}
          isLoading={loading}
        />
        <div></div> {/* Empty space under TransactionsBadge */}
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
          webacyData,
          txCount,
          walletAddress
        }}
      />
    </>
  );
};

export default TalentScoreBanner;
