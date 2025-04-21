
import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface WebacySecurityProps {
  walletAddress?: string;
}

type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';

interface WebacyData {
  riskScore?: number;
  threatLevel?: ThreatLevel;
  approvals?: {
    count: number;
    riskyCount: number;
  };
  quickProfile?: {
    transactions?: number;
    contracts?: number;
    riskLevel?: string;
  };
}

const WebacySecurity: React.FC<WebacySecurityProps> = ({ walletAddress }) => {
  const [securityData, setSecurityData] = useState<WebacyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchWebacyData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch address data
        const addressResponse = await fetch(`https://api.webacy.com/addresses/${walletAddress}`, {
          headers: {
            'X-API-KEY': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
            'Key-ID': 'eujjkt9ao5'
          }
        });
        
        if (!addressResponse.ok) {
          throw new Error('Failed to fetch address data');
        }
        
        const addressData = await addressResponse.json();
        
        // Fetch approvals data
        const approvalsResponse = await fetch(`https://api.webacy.com/addresses/${walletAddress}/approvals`, {
          headers: {
            'X-API-KEY': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
            'Key-ID': 'eujjkt9ao5'
          }
        });
        
        if (!approvalsResponse.ok) {
          throw new Error('Failed to fetch approvals data');
        }
        
        const approvalsData = await approvalsResponse.json();
        
        // Fetch quick profile data
        const quickProfileResponse = await fetch(`https://api.webacy.com/quick-profile/${walletAddress}`, {
          headers: {
            'X-API-KEY': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
            'Key-ID': 'eujjkt9ao5'
          }
        });
        
        if (!quickProfileResponse.ok) {
          throw new Error('Failed to fetch quick profile data');
        }
        
        const quickProfileData = await quickProfileResponse.json();
        
        // Determine threat level
        let threatLevel: ThreatLevel = 'UNKNOWN';
        if (addressData.riskScore !== undefined) {
          if (addressData.riskScore < 30) {
            threatLevel = 'LOW';
          } else if (addressData.riskScore < 70) {
            threatLevel = 'MEDIUM';
          } else {
            threatLevel = 'HIGH';
          }
        }
        
        setSecurityData({
          riskScore: addressData.riskScore,
          threatLevel,
          approvals: {
            count: approvalsData.totalCount || 0,
            riskyCount: approvalsData.riskyCount || 0
          },
          quickProfile: {
            transactions: quickProfileData.numTransactions,
            contracts: quickProfileData.numContracts,
            riskLevel: quickProfileData.riskLevel
          }
        });
      } catch (err) {
        console.error('Error fetching Webacy data:', err);
        setError('Failed to fetch security data');
        setSecurityData({ threatLevel: 'UNKNOWN' });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWebacyData();
  }, [walletAddress]);

  const getThreatBgColor = (level?: ThreatLevel) => {
    switch (level) {
      case 'LOW': return 'bg-green-100 text-green-700';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
      case 'HIGH': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getThreatColor = (level?: ThreatLevel) => {
    switch (level) {
      case 'LOW': return 'text-green-500';
      case 'MEDIUM': return 'text-yellow-500';
      case 'HIGH': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getThreatDescription = (level?: ThreatLevel) => {
    switch (level) {
      case 'LOW': return 'This wallet is safe and poses low to no risk to others.';
      case 'MEDIUM': return 'This wallet has some suspicious activity and poses a moderate risk.';
      case 'HIGH': return 'This wallet has highly suspicious activity and poses a significant risk.';
      default: return 'Unable to determine the security level of this wallet.';
    }
  };

  const handleClick = () => {
    setDialogOpen(true);
  };

  if (!walletAddress) return null;

  return (
    <>
      <div 
        onClick={handleClick}
        className="cursor-pointer transition-all hover:opacity-80"
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-100">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-20" />
            <Skeleton className="h-5 w-48" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-r from-green-300 to-green-100">
            <h3 className="text-lg font-semibold text-green-900">Threat Level</h3>
            <div className={`text-4xl font-bold px-4 py-2 rounded-md ${getThreatBgColor(securityData?.threatLevel)}`}>
              {securityData?.threatLevel || 'UNKNOWN'}
            </div>
            <p className="text-sm text-center text-green-800">
              {getThreatDescription(securityData?.threatLevel)}
            </p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className={`h-5 w-5 ${getThreatColor(securityData?.threatLevel)}`} />
              Wallet Security Analysis
            </DialogTitle>
            <DialogDescription>
              Powered by Webacy security intelligence
            </DialogDescription>
          </DialogHeader>
          
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WebacySecurity;
