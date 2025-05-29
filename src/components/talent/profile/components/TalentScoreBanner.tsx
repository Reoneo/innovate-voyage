
import React, { useState } from 'react';
import TalentScoreBadge from './scores/TalentScoreBadge';
import TransactionsBadge from './scores/TransactionsBadge';
import SecurityScoreBadge from './scores/SecurityScoreBadge';
import ScoreDialog from './scores/ScoreDialog';
import { useScoresData } from '@/hooks/useScoresData';
import { NftCollectionsSection } from './nft/NftCollectionsSection';
import { useWebacyData } from '@/hooks/useWebacyData';

interface TalentScoreBannerProps {
  walletAddress: string;
}

const TalentScoreBanner: React.FC<TalentScoreBannerProps> = ({ walletAddress }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<'talent' | 'webacy' | 'transactions'>('talent');
  const { score, txCount, loading } = useScoresData(walletAddress);
  const { securityData, isLoading: webacyLoading } = useWebacyData(walletAddress);
  const [showNftCollections, setShowNftCollections] = useState(false);

  const handleBadgeClick = (type: 'talent' | 'webacy' | 'transactions') => {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        <div className="transform hover:scale-105 transition-all duration-200">
          <SecurityScoreBadge 
            webacyData={securityData} 
            onClick={() => handleBadgeClick('webacy')}
            isLoading={webacyLoading} 
          />
        </div>
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
          walletAddress
        }}
      />
    </>
  );
};

export default TalentScoreBanner;
