
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScoreDialogProps } from './types';
import TalentScoreDialogContent from './dialogs/TalentScoreDialogContent';
import WebacyDialogContent from './dialogs/WebacyDialogContent';
import TransactionsDialogContent from './dialogs/TransactionsDialogContent';
import { X } from 'lucide-react';

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
      <DialogContent className="sm:max-w-md bg-black border-gray-800 p-0 overflow-hidden relative">
        <button 
          onClick={() => onOpenChange(false)} 
          className="absolute right-4 top-4 rounded-full p-1 bg-transparent hover:bg-gray-800 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-white" />
        </button>
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ScoreDialog;
