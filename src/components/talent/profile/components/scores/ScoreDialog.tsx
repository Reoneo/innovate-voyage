
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import TalentScoreDialogContent from './dialogs/TalentScoreDialogContent';
import WebacyDialogContent from './dialogs/WebacyDialogContent';
import TransactionsDialogContent from './dialogs/TransactionsDialogContent';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'talent' | 'webacy' | 'transactions';
  data: {
    score?: number;
    webacyData?: any;
    txCount?: number;
    walletAddress?: string;
  };
}

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

  const getDialogTitle = () => {
    switch (type) {
      case 'talent':
        return 'Builder Score';
      case 'webacy':
        return 'Security Score';
      case 'transactions':
        return 'Transaction History';
    }
  };

  const getDialogClass = () => {
    return type === 'webacy' ? 'max-w-md' : 'max-w-4xl';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${getDialogClass()} max-h-[80vh] overflow-y-auto p-0 ${type === 'webacy' ? 'bg-white text-black' : 'bg-black text-white'}`}>
        {type !== 'webacy' && (
          <div className={`sticky top-0 z-10 bg-black text-white flex justify-between items-center pb-2 p-4`}>
            <div className="flex items-center gap-3">
              {type === 'talent' && (
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/40d7073c-ed54-450e-874c-6e2255570950/logomark_dark.jpg?table=block&id=403db4f5-f028-4827-b704-35095d3bdd15&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1746064800000&signature=NrmlObpAbCJOzeEZfVJ7zb-a2H4jiI9HQ1OcbvA6ckY&downloadName=logomark_dark.jpg" 
                    alt="Builder Score" 
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <h2 className="text-lg font-semibold">
                {getDialogTitle()}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className={`rounded-full h-8 w-8 text-white hover:bg-gray-800`}
            >
              <X size={18} />
            </Button>
          </div>
        )}
        <div className={`p-0 ${type === 'webacy' ? 'bg-white text-black' : 'bg-black'}`}>
          {renderDialogContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScoreDialog;
