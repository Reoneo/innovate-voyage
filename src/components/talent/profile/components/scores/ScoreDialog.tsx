
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WebacyData } from './types';
import TalentScoreDialogContent from './dialogs/TalentScoreDialogContent';
import WebacyDialogContent from './dialogs/WebacyDialogContent';
import TransactionsDialogContent from './dialogs/TransactionsDialogContent';

interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'talent' | 'webacy' | 'transactions';
  data: {
    score: number | null;
    webacyData: WebacyData | null;
    txCount: number | null;
    walletAddress: string;
  };
}

const ScoreDialog: React.FC<ScoreDialogProps> = ({ open, onOpenChange, type, data }) => {
  const getTitleByType = () => {
    switch (type) {
      case 'talent':
        return 'Builder Score';
      case 'webacy':
        return 'Security Score';
      case 'transactions':
        return 'NFT Collection';
      default:
        return 'Score Details';
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'talent':
        return <TalentScoreDialogContent score={data.score} />;
      case 'webacy':
        return <WebacyDialogContent webacyData={data.webacyData} walletAddress={data.walletAddress} />;
      case 'transactions':
        return <TransactionsDialogContent txCount={data.txCount} walletAddress={data.walletAddress} />;
      default:
        return <div>No content available</div>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{getTitleByType()}</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ScoreDialog;
