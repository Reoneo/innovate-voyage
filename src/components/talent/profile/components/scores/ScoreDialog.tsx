
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { ScoreProps } from './types';

// Import components correctly with default imports
import TalentScoreDialogContent from './dialogs/TalentScoreDialogContent';
import WebacyDialogContent from './dialogs/WebacyDialogContent';
import TransactionsDialogContent from './dialogs/TransactionsDialogContent';

// Define the type
type ScoreType = 'talent' | 'security' | 'transactions';

interface ScoreDialogProps {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  type: ScoreType;
  scoreProps: ScoreProps;
}

export const ScoreDialog: React.FC<ScoreDialogProps> = ({
  title,
  open,
  setOpen,
  type,
  scoreProps
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{title}</DialogTitle>
          <Button
            onClick={() => setOpen(false)}
            size="icon"
            variant="ghost"
            className="h-7 w-7"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        {type === 'talent' && <TalentScoreDialogContent {...scoreProps} />}
        {type === 'security' && <WebacyDialogContent {...scoreProps} />}
        {type === 'transactions' && <TransactionsDialogContent {...scoreProps} />}
      </DialogContent>
    </Dialog>
  );
};

export default ScoreDialog;
