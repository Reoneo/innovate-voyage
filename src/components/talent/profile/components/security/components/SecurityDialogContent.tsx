
import React from 'react';
import { AlertCircle, Info, Shield } from 'lucide-react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import RiskScoreCard from './RiskScoreCard';
import ContractApprovalsCard from './ContractApprovalsCard';
import WalletActivityCard from './WalletActivityCard';
import RiskHistoryCard from './RiskHistoryCard';
import type { WebacyData } from '../../scores/types';

interface SecurityDialogContentProps {
  securityData: WebacyData | null;
  riskHistory: any[];
  error: string | null;
}

const SecurityDialogContent: React.FC<SecurityDialogContentProps> = ({ 
  securityData, 
  riskHistory,
  error
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-500" />
          Wallet Security Analysis
        </DialogTitle>
        <DialogDescription>
          Powered by Webacy security intelligence
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="flex flex-col gap-4">
          <RiskScoreCard webacyData={securityData} />
          <RiskHistoryCard riskHistory={riskHistory} />
          <ContractApprovalsCard webacyData={securityData} />
          <WalletActivityCard webacyData={securityData} />
          
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            Data provided by Webacy blockchain security
          </div>
        </div>
      </div>
    </>
  );
};

export default SecurityDialogContent;
