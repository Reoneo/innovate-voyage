
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import TalentScoreDialogContent from './dialogs/TalentScoreDialogContent';
import TransactionsDialogContent from './dialogs/TransactionsDialogContent';
import WebacyDialogContent from './dialogs/WebacyDialogContent';
import { ScoreData } from './types';

export interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ScoreData;
  activeType: 'talent' | 'transactions' | 'webacy';
}

export function ScoreDialog({ open, onOpenChange, data, activeType }: ScoreDialogProps) {
  const { score, webacyData, txCount, walletAddress } = data;
  
  const renderDialogTitle = () => {
    switch (activeType) {
      case 'talent':
        return 'Talent Score';
      case 'transactions':
        return 'Transaction History';
      case 'webacy':
        return 'Security Score';
      default:
        return 'Details';
    }
  };

  const renderDialogDescription = () => {
    switch (activeType) {
      case 'talent':
        return 'Details about your talent score and reputation.';
      case 'transactions':
        return 'Overview of your on-chain transaction history.';
      case 'webacy':
        return 'Details about your wallet security.';
      default:
        return '';
    }
  };

  const renderDialogContent = () => {
    switch (activeType) {
      case 'talent':
        return <TalentScoreDialogContent score={score || 0} />;
      case 'transactions':
        return <TransactionsDialogContent txCount={txCount || 0} walletAddress={walletAddress} />;
      case 'webacy':
        return <WebacyDialogContent webacyData={webacyData} />;
      default:
        return <div>No content available</div>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{renderDialogTitle()}</DialogTitle>
          <DialogDescription>{renderDialogDescription()}</DialogDescription>
        </DialogHeader>
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );
}
