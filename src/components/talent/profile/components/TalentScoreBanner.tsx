
import React, { useState } from 'react';
import TalentScoreBadge from './scores/TalentScoreBadge';
import SecurityScoreBadge from './scores/SecurityScoreBadge';
import TransactionsBadge from './scores/TransactionsBadge';
import ScoreDialog from './scores/ScoreDialog';
import { TallyDaoSection } from './governance/TallyDaoSection';
import { useScoresData } from '@/hooks/useScoresData';
import { NftCollectionsSection } from './nft/NftCollectionsSection';

interface TalentScoreBannerProps {
  walletAddress: string;
}

const TalentScoreBanner: React.FC<TalentScoreBannerProps> = ({ walletAddress }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<'talent' | 'webacy' | 'transactions'>('talent');
  const { score, webacyData, txCount, loading } = useScoresData(walletAddress);
  const [showNftCollections, setShowNftCollections] = useState(false);

  const handleBadgeClick = (type: 'talent' | 'webacy' | 'transactions') => {
    if (type === 'transactions') {
      setShowNftCollections(true);
    } else {
      setActiveDialog(type);
      setDialogOpen(true);
    }
  };

  if (!walletAddress) return null;

  // Only show scores if data is available
  const showTalentScore = score !== null && score !== undefined;
  const showRiskScore = webacyData?.riskScore !== undefined && webacyData.riskScore !== null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {showTalentScore && (
          <TalentScoreBadge 
            score={score} 
            onClick={() => handleBadgeClick('talent')}
            isLoading={loading} 
          />
        )}
        {showRiskScore && (
          <SecurityScoreBadge 
            webacyData={webacyData} 
            onClick={() => handleBadgeClick('webacy')}
            isLoading={loading} 
          />
        )}
        <TransactionsBadge 
          txCount={txCount}
          walletAddress={walletAddress}
          onClick={() => handleBadgeClick('transactions')}
          isLoading={loading} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
        <TallyDaoSection walletAddress={walletAddress} />
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
