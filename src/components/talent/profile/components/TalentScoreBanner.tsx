
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { ListChecks, Shield, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TALENT_PROTOCOL_API_KEY = "2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f";
const WEBACY_API_KEY = "e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb";
const WEBACY_KEY_ID = "eujjkt9ao5";

interface TalentScoreBannerProps {
  walletAddress: string;
}

interface TalentProtocolScoreResponse {
  score: {
    points: number;
    last_calculated_at: string;
  };
}

type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';

interface WebacyQuickProfileData {
  numTransactions?: number;
  numContracts?: number;
  riskLevel?: string;
}

interface WebacyData {
  riskScore?: number;
  threatLevel?: ThreatLevel;
  approvals?: {
    count: number;
    riskyCount: number;
  };
  quickProfile?: WebacyQuickProfileData;
}

// Get talent level based on score
const getTalentLevel = (score: number): string => {
  if (score >= 80) return "Expert Builder";
  if (score >= 60) return "Advanced Builder";
  if (score >= 40) return "Skilled Builder";
  if (score >= 20) return "Growing Builder";
  return "Beginner Builder";
};

// Get color for threat level
const getThreatColor = (level?: ThreatLevel) => {
  switch (level) {
    case 'LOW': return "text-green-500";
    case 'MEDIUM': return "text-yellow-500";
    case 'HIGH': return "text-red-500";
    default: return "text-gray-500";
  }
};

// Badge style for all badges
const badgeStyle = "bg-gradient-to-r from-[#9b87f5]/80 via-[#0FA0CE]/60 to-[#1EAEDB]/70 shadow-[0_1.5px_5px_#7e69ab55] px-5 py-3 rounded-xl flex flex-col items-center border-0 cursor-pointer hover:from-[#9b87f5]/90 hover:to-[#1EAEDB]/80 transition-all duration-300";

const TalentScoreBanner: React.FC<TalentScoreBannerProps> = ({ walletAddress }) => {
  const [talentScore, setTalentScore] = useState<number | null>(null);
  const [talentLoading, setTalentLoading] = useState(false);
  const [calculatedAt, setCalculatedAt] = useState<string | null>(null);
  
  const [securityData, setSecurityData] = useState<WebacyData | null>(null);
  const [securityLoading, setSecurityLoading] = useState(false);
  
  const [txCount, setTxCount] = useState<number | null>(null);
  const [txLoading, setTxLoading] = useState(false);
  
  // Fetch talent score
  useEffect(() => {
    if (!walletAddress) return;
    const fetchScore = async () => {
      setTalentLoading(true);
      try {
        const resp = await fetch(
          `https://api.talentprotocol.com/score?id=${walletAddress}&account_source=wallet`,
          {
            headers: {
              "X-API-KEY": TALENT_PROTOCOL_API_KEY,
            },
          }
        );
        if (resp.ok) {
          const data: TalentProtocolScoreResponse = await resp.json();
          setTalentScore(data.score?.points ?? null);
          setCalculatedAt(data.score?.last_calculated_at ?? null);
        } else {
          setTalentScore(null);
        }
      } catch (e) {
        console.error("Error fetching talent score:", e);
        setTalentScore(null);
      } finally {
        setTalentLoading(false);
      }
    };

    fetchScore();
  }, [walletAddress]);
  
  // Fetch webacy security data
  useEffect(() => {
    if (!walletAddress) return;
    
    const fetchWebacyData = async () => {
      setSecurityLoading(true);
      try {
        // Fetch address data
        const addressResponse = await fetch(`https://api.webacy.com/addresses/${walletAddress}`, {
          headers: {
            'X-API-KEY': WEBACY_API_KEY,
            'Key-ID': WEBACY_KEY_ID
          }
        });
        
        if (!addressResponse.ok) {
          throw new Error('Failed to fetch address data');
        }
        
        const addressData = await addressResponse.json();
        
        // Fetch approvals data
        const approvalsResponse = await fetch(`https://api.webacy.com/addresses/${walletAddress}/approvals`, {
          headers: {
            'X-API-KEY': WEBACY_API_KEY,
            'Key-ID': WEBACY_KEY_ID
          }
        });
        
        let approvalsData = { totalCount: 0, riskyCount: 0 };
        if (approvalsResponse.ok) {
          approvalsData = await approvalsResponse.json();
        }
        
        // Fetch quick profile data
        const quickProfileResponse = await fetch(`https://api.webacy.com/quick-profile/${walletAddress}`, {
          headers: {
            'X-API-KEY': WEBACY_API_KEY,
            'Key-ID': WEBACY_KEY_ID
          }
        });
        
        let quickProfileData: WebacyQuickProfileData = {};
        if (quickProfileResponse.ok) {
          const responseData = await quickProfileResponse.json();
          
          // Safely extract properties that might not exist
          quickProfileData = {
            numTransactions: responseData.numTransactions,
            numContracts: responseData.numContracts,
            riskLevel: responseData.riskLevel
          };
        }
        
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
          quickProfile: quickProfileData
        });
      } catch (err) {
        console.error('Error fetching Webacy data:', err);
        setSecurityData({ threatLevel: 'UNKNOWN' });
      } finally {
        setSecurityLoading(false);
      }
    };
    
    fetchWebacyData();
  }, [walletAddress]);
  
  // Fetch transaction count
  useEffect(() => {
    if (!walletAddress) return;
    
    const fetchTxCount = async () => {
      setTxLoading(true);
      try {
        const apiKey = "5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM";
        const response = await fetch(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionCount&address=${walletAddress}&tag=latest&apikey=${apiKey}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.result) {
            // Convert hex to decimal
            setTxCount(parseInt(data.result, 16));
          } else {
            setTxCount(0);
          }
        } else {
          setTxCount(0);
        }
      } catch (error) {
        console.error('Error fetching transaction count:', error);
        setTxCount(0);
      } finally {
        setTxLoading(false);
      }
    };
    
    fetchTxCount();
  }, [walletAddress]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
      {/* Talent Score Badge */}
      <Dialog>
        <DialogTrigger asChild>
          <div className={badgeStyle}>
            <span className="uppercase text-xs font-bold text-sky-50/90 tracking-widest mb-0.5 flex items-center">
              <ListChecks className="h-3.5 w-3.5 mr-1" /> Talent Score
            </span>
            {talentLoading ? (
              <span className="text-lg font-semibold text-white/80 animate-pulse">Loading...</span>
            ) : talentScore !== null ? (
              <>
                <span className="text-2xl font-bold text-sky-50 drop-shadow">{talentScore} pts</span>
                <span className="text-xs text-sky-100/80 mt-1">{getTalentLevel(talentScore)}</span>
              </>
            ) : (
              <span className="text-lg text-slate-200/80">Not available</span>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              Talent Protocol Score
            </DialogTitle>
            <DialogDescription>
              {talentScore !== null ? `${getTalentLevel(talentScore)} with ${talentScore} points` : 'Score information unavailable'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {talentScore !== null ? (
              <>
                <div className="text-sm">
                  <p className="mb-2">This score represents your activity and contributions in the web3 ecosystem.</p>
                  <p className="mb-2">Score level: <span className="font-medium">{getTalentLevel(talentScore)}</span></p>
                  {calculatedAt && (
                    <p className="text-xs text-muted-foreground">Last updated: {new Date(calculatedAt).toLocaleDateString()}</p>
                  )}
                </div>
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => window.open(`https://www.talentprotocol.com/profile/${walletAddress}`, '_blank')}
                >
                  View Talent Protocol Profile
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Could not retrieve your Talent Protocol score. Try again later or check if your wallet is connected to Talent Protocol.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Security Badge */}
      <Dialog>
        <DialogTrigger asChild>
          <div className={badgeStyle}>
            <span className="uppercase text-xs font-bold text-sky-50/90 tracking-widest mb-0.5 flex items-center">
              <Shield className="h-3.5 w-3.5 mr-1" /> Security
            </span>
            {securityLoading ? (
              <span className="text-lg font-semibold text-white/80 animate-pulse">Loading...</span>
            ) : securityData?.threatLevel ? (
              <>
                <span className={`text-2xl font-bold drop-shadow ${getThreatColor(securityData.threatLevel)}`}>
                  {securityData.threatLevel}
                </span>
                <span className="text-xs text-sky-100/80 mt-1">Threat Level</span>
              </>
            ) : (
              <span className="text-lg text-slate-200/80">Not available</span>
            )}
          </div>
        </DialogTrigger>
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
            {securityData ? (
              <>
                <div className="p-4 rounded-lg border">
                  <h3 className="font-medium mb-1">Risk Score</h3>
                  <div className="flex justify-between">
                    <span>
                      {securityData.riskScore !== undefined 
                        ? `${securityData.riskScore} / 100` 
                        : 'Unknown'}
                    </span>
                    <span className={`font-medium ${getThreatColor(securityData.threatLevel)}`}>
                      {securityData.threatLevel || 'UNKNOWN'} RISK
                    </span>
                  </div>
                </div>
                
                {securityData.approvals && (
                  <div className="p-4 rounded-lg border">
                    <h3 className="font-medium mb-2">Contract Approvals</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="text-xl font-medium">{securityData.approvals.count}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Risky</p>
                        <p className="text-xl font-medium text-amber-500">{securityData.approvals.riskyCount}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => window.open(`https://app.webacy.com/wallet/${walletAddress}`, '_blank')}
                >
                  View Full Security Analysis
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Could not retrieve security data for this wallet. Try again later.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Transaction Badge */}
      <Dialog>
        <DialogTrigger asChild>
          <div className={badgeStyle}>
            <span className="uppercase text-xs font-bold text-sky-50/90 tracking-widest mb-0.5 flex items-center">
              <Coins className="h-3.5 w-3.5 mr-1" /> Transactions
            </span>
            {txLoading ? (
              <span className="text-lg font-semibold text-white/80 animate-pulse">Loading...</span>
            ) : txCount !== null ? (
              <>
                <span className="text-2xl font-bold text-sky-50 drop-shadow">{txCount}</span>
                <span className="text-xs text-sky-100/80 mt-1">Tx Sent</span>
              </>
            ) : (
              <span className="text-lg text-slate-200/80">Not available</span>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              Transaction History
            </DialogTitle>
            <DialogDescription>
              Ethereum blockchain activity
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {txCount !== null ? (
              <>
                <div className="p-4 rounded-lg border">
                  <h3 className="font-medium mb-1">Total Transactions</h3>
                  <span className="text-2xl font-medium">{txCount}</span>
                </div>
                
                <div className="text-sm">
                  <p>This wallet has sent {txCount} transactions on the Ethereum blockchain.</p>
                  <p className="mt-2 text-xs text-muted-foreground">Transaction count is an indicator of blockchain activity level.</p>
                </div>
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => window.open(`https://etherscan.io/address/${walletAddress}`, '_blank')}
                >
                  View on Etherscan
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Could not retrieve transaction data for this wallet. Try again later.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TalentScoreBanner;
