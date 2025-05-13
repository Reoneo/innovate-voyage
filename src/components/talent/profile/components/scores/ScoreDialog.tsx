
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TalentScoreDialogContent } from './dialogs/TalentScoreDialogContent';
import { WebacyDialogContent } from './dialogs/WebacyDialogContent';
import { TransactionsDialogContent } from './dialogs/TransactionsDialogContent';
import { ScoreType } from './types';

interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: ScoreType;
  walletAddress?: string;
  score?: any;
}

export function ScoreDialog({
  open,
  onOpenChange,
  initialTab = 'talent',
  walletAddress,
  score
}: ScoreDialogProps) {
  const [activeTab, setActiveTab] = useState<ScoreType>(initialTab);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'talent':
        return <TalentScoreDialogContent walletAddress={walletAddress} score={score} />;
      case 'security':
        return <WebacyDialogContent walletAddress={walletAddress} />;
      case 'transactions':
        return <TransactionsDialogContent walletAddress={walletAddress} />;
      default:
        return <TalentScoreDialogContent walletAddress={walletAddress} score={score} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {activeTab === 'talent' ? 'Talent Score Details' : 
             activeTab === 'security' ? 'Security Score Details' : 
             'Transaction History'}
          </DialogTitle>
          <DialogDescription>
            {activeTab === 'talent' ? 'Web3 expertise analysis' : 
             activeTab === 'security' ? 'Wallet security assessment' : 
             'Transaction patterns and history'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex border-b mb-4">
          <TabButton 
            active={activeTab === 'talent'} 
            onClick={() => setActiveTab('talent')}
            label="Talent Score"
          />
          <TabButton 
            active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')}
            label="Security Score"
          />
          <TabButton 
            active={activeTab === 'transactions'} 
            onClick={() => setActiveTab('transactions')}
            label="Transactions"
          />
        </div>

        {renderTabContent()}
      </DialogContent>
    </Dialog>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, label }) => (
  <button
    className={`px-4 py-2 text-sm font-medium ${
      active 
        ? 'border-b-2 border-primary text-primary' 
        : 'text-gray-500 hover:text-gray-700'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);
