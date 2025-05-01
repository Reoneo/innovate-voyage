
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import TalentScoreDialogContent from './dialogs/TalentScoreDialogContent';
import TransactionsDialogContent from './dialogs/TransactionsDialogContent';
import { WebacyData } from './types';

interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'talent' | 'transactions';
  data: {
    score?: number | null;
    txCount?: number | null;
    walletAddress: string;
  };
}

const ScoreDialog: React.FC<ScoreDialogProps> = ({ 
  open, 
  onOpenChange, 
  type,
  data
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={type === 'talent' ? "sm:max-w-md" : "sm:max-w-xl"}>
        {type === 'talent' && (
          <TalentScoreDialogContent score={data.score || 0} walletAddress={data.walletAddress} />
        )}
        {type === 'transactions' && (
          <TransactionsDialogContent txCount={data.txCount || 0} walletAddress={data.walletAddress} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScoreDialog;
