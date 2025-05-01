import React, { useState, useEffect } from 'react';
import { AlertCircle, Info, Shield, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ThreatLevelCard from './components/ThreatLevelCard';
import RiskScoreCard from './components/RiskScoreCard';
import ContractApprovalsCard from './components/ContractApprovalsCard';
import WalletActivityCard from './components/WalletActivityCard';
import type { WebacyData, ThreatLevel } from '../scores/types';

interface WebacySecurityProps {
  walletAddress?: string;
}

const WebacySecurity: React.FC<WebacySecurityProps> = ({ walletAddress }) => {
  const [securityData, setSecurityData] = useState<WebacyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [riskHistory, setRiskHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchWebacyData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
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
          walletAddress,
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

    const fetchRiskHistory = async () => {
      try {
        const response = await fetch(`https://api.webacy.com/quick-profile/${walletAddress}`, {
          headers: {
            'accept': 'application/json',
            'x-api-key': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
            'Key-ID': 'eujjkt9ao5'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setRiskHistory(data.riskHistory || []);
        }
      } catch (err) {
        console.error('Error fetching risk history:', err);
      }
    };

    fetchRiskHistory();
  }, [walletAddress]);

  const handleClick = () => {
    setDialogOpen(true);
  };

  const getThreatColor = (threatLevel: ThreatLevel) => {
    switch (threatLevel) {
      case 'LOW':
        return 'text-green-500';
      case 'MEDIUM':
        return 'text-yellow-500';
      case 'HIGH':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  if (!walletAddress) return null;

  return (
    <>
      <div 
        onClick={handleClick}
        className="cursor-pointer transition-all hover:opacity-80"
      >
        <ThreatLevelCard 
          securityData={securityData} 
          isLoading={isLoading} 
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
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
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Risk History</h3>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {riskHistory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 rounded bg-muted/50">
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      <span className={getThreatColor(item.riskLevel)}>{item.score}</span>
                    </div>
                  ))}
                  {riskHistory.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center">No risk history available</p>
                  )}
                </div>
              </div>

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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WebacySecurity;
