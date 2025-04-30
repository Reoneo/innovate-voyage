
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScoreDialogProps } from './types';
import TalentScoreDialogContent from './dialogs/TalentScoreDialogContent';
import WebacyDialogContent from './dialogs/WebacyDialogContent';
import TransactionsDialogContent from './dialogs/TransactionsDialogContent';

const ScoreDialog: React.FC<ScoreDialogProps> = ({ open, onOpenChange, type, data }) => {
  const { score, webacyData, txCount, walletAddress } = data;

  const renderDialogContent = () => {
    switch (type) {
      case 'talent':
        return <TalentScoreDialogContent score={score} walletAddress={walletAddress} />;
      case 'webacy':
        return <WebacyDialogContent webacyData={webacyData} />;
      case 'transactions':
        return <TransactionsDialogContent txCount={txCount} walletAddress={walletAddress} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ScoreDialog;
