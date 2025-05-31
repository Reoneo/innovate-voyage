
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import TalentScoreDialogContent from './dialogs/TalentScoreDialogContent';
import WebacyDialogContent from './dialogs/WebacyDialogContent';
import TransactionsDialogContent from './dialogs/TransactionsDialogContent';
import BlockchainDialogContent from './dialogs/BlockchainDialogContent';
import type { DialogType, ScoreDialogData } from './types';

interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: DialogType;
  data: ScoreDialogData;
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
        return <TalentScoreDialogContent score={data.score} />;
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ScoreDialog;
