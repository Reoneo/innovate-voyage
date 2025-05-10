
import React from 'react';
import { WebacyData } from '../types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Shield, AlertTriangle, Check } from 'lucide-react';
import { getThreatColor } from '../utils/scoreUtils';

interface WebacyDialogContentProps {
  webacyData: WebacyData | null;
  walletAddress: string;
}

const WebacyDialogContent: React.FC<WebacyDialogContentProps> = ({ webacyData, walletAddress }) => {
  if (!webacyData) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="h-10 w-10 mx-auto text-yellow-500 mb-4" />
        <h3 className="text-lg font-medium">Security data unavailable</h3>
        <p className="text-sm text-gray-500 mt-2">
          We couldn't fetch security data for this wallet address.
        </p>
      </div>
    );
  }

  const { riskScore, threatLevel, approvals, quickProfile } = webacyData;

  const renderThreatLevelIcon = () => {
    switch (threatLevel) {
      case 'LOW':
        return <Check className="h-8 w-8 text-green-500" />;
      case 'MEDIUM':
        return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
      case 'HIGH':
        return <Shield className="h-8 w-8 text-red-500" />;
      default:
        return <Shield className="h-8 w-8 text-gray-400" />;
    }
  };

  const threatLevelText = {
    LOW: 'Low Risk',
    MEDIUM: 'Medium Risk',
    HIGH: 'High Risk',
    UNKNOWN: 'Unknown Risk'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Wallet Security Score</h2>
          <p className="text-sm text-muted-foreground">
            Powered by Webacy
          </p>
        </div>
        <div className="flex items-center gap-2">
          <img 
            src="https://img.cryptorank.io/coins/webacy1675847088001.png" 
            alt="Webacy Logo" 
            className="h-8 w-8"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Risk Score</CardTitle>
            <CardDescription>Overall security assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className={`text-3xl font-bold ${getThreatColor(threatLevel)}`}>
                {riskScore !== undefined ? riskScore : 'N/A'}
              </div>
              {renderThreatLevelIcon()}
            </div>
            <p className={`text-sm mt-1 ${getThreatColor(threatLevel)}`}>
              {threatLevelText[threatLevel]}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Contract Approvals</CardTitle>
            <CardDescription>Permissions granted to contracts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {approvals?.count || 0}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {approvals?.riskyCount ? (
                <span className="text-red-500">
                  {approvals.riskyCount} risky approvals
                </span>
              ) : 'No risky approvals detected'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Wallet Activity</CardTitle>
            <CardDescription>Transaction history overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {quickProfile?.transactions || 0}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Interacted with {quickProfile?.contracts || 0} contracts
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        <p>
          This security assessment is based on various factors including transaction history,
          contract interactions, and approval patterns. A lower score indicates less security risk.
        </p>
      </div>
    </div>
  );
};

export default WebacyDialogContent;
