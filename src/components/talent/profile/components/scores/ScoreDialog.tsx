
import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import TalentScoreDialogContent from './dialogs/TalentScoreDialogContent';
import SecurityDialogContent from './dialogs/SecurityDialogContent';
import TransactionsDialogContent from './dialogs/TransactionsDialogContent';
import BlockchainDialogContent from './dialogs/BlockchainDialogContent';
import type { ScoreDialogData, DialogType } from './types';

interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: DialogType;
  data: ScoreDialogData;
}

const ScoreDialog: React.FC<ScoreDialogProps> = ({ open, onOpenChange, type, data }) => {
  const getDialogContent = () => {
    switch (type) {
      case 'talent':
        return <TalentScoreDialogContent score={data.score} walletAddress={data.walletAddress} />;
      case 'security':
        return <SecurityDialogContent />;
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
      <DialogContent className="max-w-3xl bg-white text-gray-800 border border-gray-200 shadow-lg max-h-[80vh] overflow-y-auto">
        {getDialogContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ScoreDialog;
