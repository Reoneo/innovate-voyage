
import React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import TalentScoreDialogContent from './dialogs/TalentScoreDialogContent';
import WebacyDialogContent from './dialogs/WebacyDialogContent';
import TransactionsDialogContent from './dialogs/TransactionsDialogContent';
import BlockchainDialogContent from './dialogs/BlockchainDialogContent';
import type { WebacyData } from './types';

interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'talent' | 'webacy' | 'transactions' | 'blockchain';
  data: {
    score: number | null;
    webacyData: WebacyData | null;
    txCount: number | null;
    walletAddress: string;
  };
}

const ScoreDialog: React.FC<ScoreDialogProps> = ({
  open,
  onOpenChange,
  type,
  data
}) => {
  const renderContent = () => {
    switch (type) {
      case 'talent':
        return <TalentScoreDialogContent score={data.score} walletAddress={data.walletAddress} />;
      case 'webacy':
        return <WebacyDialogContent webacyData={data.webacyData} />;
      case 'transactions':
        return <TransactionsDialogContent txCount={data.txCount} walletAddress={data.walletAddress} />;
      case 'blockchain':
        return <BlockchainDialogContent walletAddress={data.walletAddress} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none m-0 rounded-none flex flex-col bg-white text-gray-900 border-0 shadow-2xl p-0">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ScoreDialog;
