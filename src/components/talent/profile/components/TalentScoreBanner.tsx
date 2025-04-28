
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import TalentScoreBadge from './scores/TalentScoreBadge';
import SecurityScoreBadge from './scores/SecurityScoreBadge';
import TransactionsBadge from './scores/TransactionsBadge';
import ScoreDialog from './scores/ScoreDialog';
import { useScoresData } from '@/hooks/useScoresData';

interface TalentScoreBannerProps {
  walletAddress: string;
}

const TalentScoreBanner: React.FC<TalentScoreBannerProps> = ({ walletAddress }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<'talent' | 'webacy' | 'transactions'>('talent');
  const { score, webacyData, txCount, loading } = useScoresData(walletAddress);

  const handleBadgeClick = (type: 'talent' | 'webacy' | 'transactions') => {
    setActiveDialog(type);
    setDialogOpen(true);
  };

  if (!walletAddress) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TalentScoreBadge 
          score={score} 
          onClick={() => handleBadgeClick('talent')}
          isLoading={loading} 
        />
        <SecurityScoreBadge 
          webacyData={webacyData} 
          onClick={() => handleBadgeClick('webacy')}
          isLoading={loading} 
        />
        <TransactionsBadge 
          txCount={txCount} 
          onClick={() => handleBadgeClick('transactions')}
          isLoading={loading} 
        />
      </div>

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
