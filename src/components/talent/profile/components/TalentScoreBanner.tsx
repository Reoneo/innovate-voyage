import React, { useEffect, useState } from 'react';
import { Star, ShieldAlert, SendHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface TalentScoreBannerProps {
  walletAddress: string;
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

const getBuilderTitle = (score: number) => {
  if (score >= 800) return 'Expert Builder';
  if (score >= 600) return 'Advanced Builder';
  if (score >= 400) return 'Intermediate Builder';
  if (score >= 200) return 'Growing Builder';
  return 'Beginner Builder';
};

const TalentScoreBanner: React.FC<TalentScoreBannerProps> = ({ walletAddress }) => {
  const [score, setScore] = useState<number | null>(null);
  const [webacyData, setWebacyData] = useState<WebacyData | null>(null);
  const [txCount, setTxCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<'talent' | 'webacy' | 'transactions'>('talent');
  const { toast } = useToast();

  useEffect(() => {
    if (!walletAddress) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Talent Protocol Score
        const talentResp = await fetch(
          `https://api.talentprotocol.com/score?id=${walletAddress}&account_source=wallet`,
          {
            headers: {
              "X-API-KEY": "2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f",
            },
          }
        );
        
        if (talentResp.ok) {
          const data = await talentResp.json();
          setScore(data.score?.points ?? null);
        }

        // Fetch Webacy Data
        const [addressData, approvalsData, quickProfileData] = await Promise.all([
          fetch(`https://api.webacy.com/addresses/${walletAddress}`, {
            headers: {
              'X-API-KEY': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
              'Key-ID': 'eujjkt9ao5'
            }
          }).then(r => r.json()),
          fetch(`https://api.webacy.com/addresses/${walletAddress}/approvals`, {
            headers: {
              'X-API-KEY': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
              'Key-ID': 'eujjkt9ao5'
            }
          }).then(r => r.json()),
          fetch(`https://api.webacy.com/quick-profile/${walletAddress}`, {
            headers: {
              'X-API-KEY': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
              'Key-ID': 'eujjkt9ao5'
            }
          }).then(r => r.json())
        ]);

        // Fetch Transaction Count from Etherscan
        const etherscanResp = await fetch(
          `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1000&sort=desc&apikey=5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM`
        );
        
        if (etherscanResp.ok) {
          const data = await etherscanResp.json();
          if (data.status === '1') {
            setTxCount(data.result.length);
          }
        }

        setWebacyData({
          riskScore: addressData.riskScore,
          threatLevel: getThreatLevel(addressData.riskScore),
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

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch score data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [walletAddress]);

  const getThreatLevel = (riskScore?: number): ThreatLevel => {
    if (riskScore === undefined) return 'UNKNOWN';
    if (riskScore < 30) return 'LOW';
    if (riskScore < 70) return 'MEDIUM';
    return 'HIGH';
  };

  const getThreatColor = (level?: ThreatLevel) => {
    switch (level) {
      case 'LOW': return 'text-green-500';
      case 'MEDIUM': return 'text-yellow-500';
      case 'HIGH': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const handleBadgeClick = (type: 'talent' | 'webacy' | 'transactions') => {
    setActiveDialog(type);
    setDialogOpen(true);
  };

  const renderDialogContent = () => {
    switch (activeDialog) {
      case 'talent':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Talent Protocol Score
              </DialogTitle>
              <DialogDescription>
                Builder progression and activity metrics
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Builder Score</h3>
                    <span className="text-xl font-bold text-yellow-500">
                      {score ?? 'N/A'}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">Current Level: {score ? getBuilderTitle(score) : 'Unknown'}</p>
                    <a 
                      href={`https://talentprotocol.com/profile/${walletAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View on Talent Protocol →
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        );

      case 'webacy':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldAlert className={`h-5 w-5 ${getThreatColor(webacyData?.threatLevel)}`} />
                Security Analysis
              </DialogTitle>
              <DialogDescription>
                Wallet security metrics by Webacy
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Risk Score</h3>
                    <span className={`text-xl font-bold ${getThreatColor(webacyData?.threatLevel)}`}>
                      {webacyData?.riskScore !== undefined ? webacyData.riskScore : 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">
                      The wallet has a {webacyData?.threatLevel?.toLowerCase() || 'unknown'} threat level.
                      {webacyData?.threatLevel === 'LOW' && ' This indicates normal blockchain activity.'}
                      {webacyData?.threatLevel === 'MEDIUM' && ' Some suspicious transactions were detected.'}
                      {webacyData?.threatLevel === 'HIGH' && ' High-risk activity detected in this wallet.'}
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
                        {webacyData?.approvals?.count || 0}
                      </span>
                      <span className="text-sm text-muted-foreground">Total Approvals</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-semibold text-amber-600">
                        {webacyData?.approvals?.riskyCount || 0}
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
                        {webacyData?.quickProfile?.transactions || 0}
                      </span>
                      <span className="text-sm text-muted-foreground">Transactions</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-semibold">
                        {webacyData?.quickProfile?.contracts || 0}
                      </span>
                      <span className="text-sm text-muted-foreground">Contracts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        );

      case 'transactions':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <SendHorizontal className="h-5 w-5 text-blue-500" />
                Transaction History
              </DialogTitle>
              <DialogDescription>
                Historical transaction data
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Total Transactions</h3>
                    <span className="text-xl font-bold text-blue-500">
                      {txCount ?? 'N/A'}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <a 
                      href={`https://etherscan.io/address/${walletAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View on Etherscan →
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        );
    }
  };

  if (!walletAddress) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Talent Score */}
        <div 
          onClick={() => handleBadgeClick('talent')}
          className="cursor-pointer transition-all hover:opacity-80"
        >
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-r from-yellow-300/20 to-yellow-100/10">
            {loading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <>
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-yellow-700">Talent Score</h3>
                  <div className="text-3xl font-bold text-yellow-600">{score || 'N/A'}</div>
                  <p className="text-sm text-yellow-600/80">
                    {score ? getBuilderTitle(score) : 'Unknown Level'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Webacy Security Score */}
        <div 
          onClick={() => handleBadgeClick('webacy')}
          className="cursor-pointer transition-all hover:opacity-80"
        >
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-r from-green-300/20 to-green-100/10">
            {loading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <>
                <ShieldAlert className={`h-8 w-8 ${getThreatColor(webacyData?.threatLevel)}`} />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-700">Security Score</h3>
                  <div className={`text-3xl font-bold ${getThreatColor(webacyData?.threatLevel)}`}>
                    {webacyData?.threatLevel || 'N/A'}
                  </div>
                  <p className="text-sm text-gray-600">
                    Risk Score: {webacyData?.riskScore ?? 'Unknown'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Transaction Count */}
        <div 
          onClick={() => handleBadgeClick('transactions')}
          className="cursor-pointer transition-all hover:opacity-80"
        >
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-r from-blue-300/20 to-blue-100/10">
            {loading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <>
                <SendHorizontal className="h-8 w-8 text-blue-500" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-700">Transactions</h3>
                  <div className="text-3xl font-bold text-blue-600">{txCount || 'N/A'}</div>
                  <p className="text-sm text-gray-600">
                    Total Sent
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TalentScoreBanner;
