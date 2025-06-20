
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const ScoreDialog: React.FC<ScoreDialogProps> = ({ open, onOpenChange, type, data }) => {
  const getDialogContent = () => {
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

  const getDialogTitle = () => {
    switch (type) {
      case 'talent':
        return 'Builder Score Details';
      case 'webacy':
        return 'Security Score Details';
      case 'transactions':
        return 'Transaction Details';
      case 'blockchain':
        return 'Blockchain Activity Details';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        {getDialogContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ScoreDialog;
