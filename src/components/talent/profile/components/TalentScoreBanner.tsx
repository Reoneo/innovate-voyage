
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TalentScoreBadge from './scores/TalentScoreBadge';
import SecurityScoreBadge from './scores/SecurityScoreBadge';
import TransactionsBadge from './scores/TransactionsBadge';
import ScoreDialog from './scores/ScoreDialog';
import { useScoresData } from '@/hooks/useScoresData';

interface TalentScoreBannerProps {
  walletAddress: string;
}

const TalentScoreBanner: React.FC<TalentScoreBannerProps> = ({ walletAddress }) => {
  const { talentScore, securityScore, transactionData, loading } = useScoresData(walletAddress);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'talent' | 'security' | 'transactions'>('talent');
  const [dialogTitle, setDialogTitle] = useState('');

  const openDialog = (type: 'talent' | 'security' | 'transactions', title: string) => {
    setDialogType(type);
    setDialogTitle(title);
    setDialogOpen(true);
  };

  return (
    <Card className="flex flex-col md:flex-row items-center justify-between p-4 bg-white/90 backdrop-blur-sm shadow-md rounded-lg">
      <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 w-full">
        {/* Talent Score */}
        <div className="w-full md:w-1/3 h-28 p-2">
          <TalentScoreBadge 
            score={talentScore.score} 
            loading={loading}
            onClick={() => openDialog('talent', 'Talent Score')}
          />
        </div>
        
        {/* Security Score */}
        <div className="w-full md:w-1/3 h-28 p-2">
          <SecurityScoreBadge 
            score={securityScore.score} 
            loading={loading}
            onClick={() => openDialog('security', 'Security Score')}
          />
        </div>
        
        {/* Transaction History */}
        <div className="w-full md:w-1/3 h-28 p-2">
          <TransactionsBadge 
            txCount={transactionData.txCount} 
            walletAddress={walletAddress}
            loading={loading}
            onClick={() => openDialog('transactions', 'Transaction History')}
          />
        </div>
      </div>

      <ScoreDialog
        title={dialogTitle}
        open={dialogOpen}
        setOpen={setDialogOpen}
        type={dialogType}
        scoreProps={{ walletAddress }}
      />
    </Card>
  );
};

export default TalentScoreBanner;
