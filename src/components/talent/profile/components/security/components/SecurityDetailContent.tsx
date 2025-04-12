
import React from 'react';
import { AlertCircle, Info, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { WebacyData } from '../hooks/useWebacyData';
import { getThreatColor } from '../utils/securityUtils';

interface SecurityDetailContentProps {
  securityData: WebacyData | null;
  error: string | null;
}

const SecurityDetailContent: React.FC<SecurityDetailContentProps> = ({ 
  securityData, 
  error 
}) => {
  return (
    <div className="space-y-4 py-4">
      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Risk Score</h3>
              <span className={`text-xl font-bold ${getThreatColor(securityData?.threatLevel)}`}>
                {securityData?.riskScore !== undefined ? securityData.riskScore : 'Unknown'}
              </span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">
                The wallet has a {securityData?.threatLevel?.toLowerCase() || 'unknown'} threat level.
                {securityData?.threatLevel === 'LOW' && ' This indicates normal blockchain activity.'}
                {securityData?.threatLevel === 'MEDIUM' && ' Some suspicious transactions were detected.'}
                {securityData?.threatLevel === 'HIGH' && ' High-risk activity detected in this wallet.'}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Contract Approvals</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-xl font-semibold">
                  {securityData?.approvals?.count || 0}
                </span>
                <span className="text-sm text-muted-foreground">Total Approvals</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-amber-600">
                  {securityData?.approvals?.riskyCount || 0}
                </span>
                <span className="text-sm text-muted-foreground">Risky Approvals</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Wallet Activity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-xl font-semibold">
                  {securityData?.quickProfile?.transactions || 0}
                </span>
                <span className="text-sm text-muted-foreground">Transactions</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold">
                  {securityData?.quickProfile?.contracts || 0}
                </span>
                <span className="text-sm text-muted-foreground">Contracts</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
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
  );
};

export default SecurityDetailContent;
