
import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { X } from 'lucide-react';
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
      <DialogContent className="w-screen h-screen max-w-none max-h-none top-0 left-0 translate-x-0 translate-y-0 rounded-none bg-black text-white border-none shadow-lg overflow-y-auto p-6">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <X className="h-6 w-6 text-white" />
        </button>
        {getDialogContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ScoreDialog;
