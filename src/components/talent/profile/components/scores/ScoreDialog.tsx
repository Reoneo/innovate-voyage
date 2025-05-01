
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import TalentScoreDialogContent from './dialogs/TalentScoreDialogContent';
import TransactionsDialogContent from './dialogs/TransactionsDialogContent';
import type { WebacyData } from './types';

interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'talent' | 'transactions';
  data: {
    score: number | null;
    webacyData: WebacyData | null;
    txCount: number | null;
    walletAddress: string;
  };
}

const ScoreDialog: React.FC<ScoreDialogProps> = ({ open, onOpenChange, type, data }) => {
  let dialogContent;

  switch (type) {
    case 'talent':
      dialogContent = <TalentScoreDialogContent score={data.score} walletAddress={data.walletAddress} />;
      break;
    case 'transactions':
      dialogContent = <TransactionsDialogContent txCount={data.txCount} walletAddress={data.walletAddress} />;
      break;
    default:
      dialogContent = <div>No content available</div>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
};

export default ScoreDialog;
