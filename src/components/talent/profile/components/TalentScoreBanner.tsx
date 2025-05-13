
import React, { useState } from 'react';
import { useScoresData } from '@/hooks/useScoresData';
import { Card } from '@/components/ui/card';
import { ScoreDialog } from './scores/ScoreDialog';
import TalentScoreBadge from './scores/TalentScoreBadge';
import SecurityScoreBadge from './scores/SecurityScoreBadge';
import TransactionsBadge from './scores/TransactionsBadge';

interface TalentScoreBannerProps {
  walletAddress?: string;
}

const TalentScoreBanner: React.FC<TalentScoreBannerProps> = ({ walletAddress }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'talent' | 'security' | 'transactions'>('talent');
  const { talentScore, securityScore, transactionsScore, loading } = useScoresData(walletAddress);

  if (loading) {
    return (
      <Card className="w-full shadow-sm p-3 border-0 bg-gray-50/70 backdrop-blur-lg">
        <div className="animate-pulse flex justify-between">
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
          <div className="flex space-x-2">
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  const handleOpenDialog = (tab: 'talent' | 'security' | 'transactions') => {
    setActiveTab(tab);
    setDialogOpen(true);
  };

  return (
    <>
      <Card className="w-full shadow-sm p-3 border-0 bg-gray-50/70 backdrop-blur-lg">
        <div className="flex flex-wrap justify-between items-center">
          <h3 className="text-sm md:text-base font-medium text-gray-700">
            Profile Metrics
          </h3>
          <div className="flex flex-wrap gap-2">
            <TalentScoreBadge 
              score={talentScore} 
              onClick={() => handleOpenDialog('talent')} 
            />
            <SecurityScoreBadge 
              score={securityScore} 
              onClick={() => handleOpenDialog('security')} 
            />
            <TransactionsBadge 
              score={transactionsScore} 
              onClick={() => handleOpenDialog('transactions')} 
            />
          </div>
        </div>
      </Card>

      <ScoreDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        initialTab={activeTab}
        walletAddress={walletAddress}
        score={activeTab === 'talent' ? talentScore : activeTab === 'security' ? securityScore : transactionsScore}
      />
    </>
  );
};

export default TalentScoreBanner;
