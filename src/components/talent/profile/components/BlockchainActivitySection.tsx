
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useBlockchainProfile } from '@/hooks/useEtherscan';
import { Calendar, Coins, Activity, ArrowUpDown, Clock, Network, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { 
  getAccountBalance, 
  getTransactionCount, 
  getFirstTransaction, 
  getLatestTransactions,
  getOptimismTransactions,
  getTokenTransfers,
  getAccountAge,
  getApiStatus
} from '@/api/services/etherscanService';

interface BlockchainActivitySectionProps {
  walletAddress?: string;
}

interface ApiResult<T> {
  data: T;
  source: string;
  error?: string;
}

const BlockchainActivitySection: React.FC<BlockchainActivitySectionProps> = ({ walletAddress }) => {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<ApiResult<string>>({ data: '0', source: 'Loading...' });
  const [txCount, setTxCount] = useState<ApiResult<number>>({ data: 0, source: 'Loading...' });
  const [firstTx, setFirstTx] = useState<ApiResult<any>>({ data: null, source: 'Loading...' });
  const [latestTxs, setLatestTxs] = useState<ApiResult<any[]>>({ data: [], source: 'Loading...' });
  const [optimismTxs, setOptimismTxs] = useState<ApiResult<any[]>>({ data: [], source: 'Loading...' });
  const [tokenTransfers, setTokenTransfers] = useState<ApiResult<any[]>>({ data: [], source: 'Loading...' });
  const [accountAge, setAccountAge] = useState<ApiResult<number>>({ data: 0, source: 'Loading...' });
  const [apiStatus, setApiStatus] = useState<any>({});

  useEffect(() => {
    if (!walletAddress) return;

    const fetchAllData = async () => {
      console.log('🚀 Starting blockchain data fetch for:', walletAddress);
      setLoading(true);

      try {
        // Fetch all data in parallel and track sources
        const [
          balanceResult,
          txCountResult,
          firstTxResult,
          latestTxsResult,
          optimismTxsResult,
          tokenTransfersResult,
          accountAgeResult
        ] = await Promise.all([
          getAccountBalance(walletAddress),
          getTransactionCount(walletAddress),
          getFirstTransaction(walletAddress),
          getLatestTransactions(walletAddress, 10),
          getOptimismTransactions(walletAddress, 5),
          getTokenTransfers(walletAddress, 5),
          getAccountAge(walletAddress)
        ]);

        // Update state with results and sources
        setBalance({ data: balanceResult.balance, source: balanceResult.source, error: balanceResult.error });
        setTxCount({ data: txCountResult.count, source: txCountResult.source, error: txCountResult.error });
        setFirstTx({ data: firstTxResult.transaction, source: firstTxResult.source, error: firstTxResult.error });
        setLatestTxs({ data: latestTxsResult.transactions, source: latestTxsResult.source, error: latestTxsResult.error });
        setOptimismTxs({ data: optimismTxsResult.transactions, source: optimismTxsResult.source, error: optimismTxsResult.error });
        setTokenTransfers({ data: tokenTransfersResult.transfers, source: tokenTransfersResult.source, error: tokenTransfersResult.error });
        setAccountAge({ data: accountAgeResult.age, source: accountAgeResult.source, error: accountAgeResult.error });

        // Get API status for debugging
        setApiStatus(getApiStatus());

        console.log('✅ All blockchain data fetched successfully');
      } catch (error) {
        console.error('💥 Error fetching blockchain data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [walletAddress]);

  if (!walletAddress) return null;

  const formatDate = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAccountAge = () => {
    if (!accountAge.data) return 'Unknown';
    
    const days = accountAge.data;
    if (days > 365) {
      const years = Math.floor(days / 365);
      const remainingDays = days % 365;
      return `${years}y ${Math.floor(remainingDays / 30)}m`;
    }
    if (days > 30) {
      return `${Math.floor(days / 30)} months`;
    }
    return `${days} days`;
  };

  const getExperienceLevel = () => {
    const txs = txCount.data;
    const age = accountAge.data;
    
    if (txs > 1000 && age > 1095) return 'Expert';
    if (txs > 500 && age > 730) return 'Advanced';
    if (txs > 100 && age > 365) return 'Intermediate';
    if (txs > 10) return 'Beginner';
    return 'Newcomer';
  };

  const getSourceIcon = (hasError: boolean, hasData: boolean) => {
    if (hasError) return <XCircle className="h-3 w-3 text-red-500" />;
    if (hasData) return <CheckCircle className="h-3 w-3 text-green-500" />;
    return <AlertCircle className="h-3 w-3 text-yellow-500" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Blockchain Activity & Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <>
            {/* API Status Debug Section */}
            <div className="border rounded-lg p-4 bg-gray-50/50">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Network className="h-4 w-4" />
                API Status & Data Sources
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Balance:</span>
                    <div className="flex items-center gap-1">
                      {getSourceIcon(!!balance.error, !!balance.data && balance.data !== '0')}
                      <span className="text-muted-foreground">{balance.source}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Transactions:</span>
                    <div className="flex items-center gap-1">
                      {getSourceIcon(!!txCount.error, txCount.data > 0)}
                      <span className="text-muted-foreground">{txCount.source}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>First Transaction:</span>
                    <div className="flex items-center gap-1">
                      {getSourceIcon(!!firstTx.error, !!firstTx.data)}
                      <span className="text-muted-foreground">{firstTx.source}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Latest Transactions:</span>
                    <div className="flex items-center gap-1">
                      {getSourceIcon(!!latestTxs.error, latestTxs.data.length > 0)}
                      <span className="text-muted-foreground">{latestTxs.source}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Optimism:</span>
                    <div className="flex items-center gap-1">
                      {getSourceIcon(!!optimismTxs.error, optimismTxs.data.length > 0)}
                      <span className="text-muted-foreground">{optimismTxs.source}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Token Transfers:</span>
                    <div className="flex items-center gap-1">
                      {getSourceIcon(!!tokenTransfers.error, tokenTransfers.data.length > 0)}
                      <span className="text-muted-foreground">{tokenTransfers.source}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Professional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Coins className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">ETH Balance</span>
                </div>
                <div className="text-lg font-bold">{balance.data} ETH</div>
                {balance.error && (
                  <div className="text-xs text-red-500 mt-1">{balance.error}</div>
                )}
              </div>
              
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <ArrowUpDown className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Total Transactions</span>
                </div>
                <div className="text-lg font-bold">{txCount.data}</div>
                {txCount.error && (
                  <div className="text-xs text-red-500 mt-1">{txCount.error}</div>
                )}
              </div>

              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Account Age</span>
                </div>
                <div className="text-sm font-bold">{formatAccountAge()}</div>
                {accountAge.error && (
                  <div className="text-xs text-red-500 mt-1">{accountAge.error}</div>
                )}
              </div>

              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Experience Level</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {getExperienceLevel()}
                </Badge>
              </div>
            </div>

            {/* First Transaction - Most Important for CV */}
            {firstTx.data ? (
              <div className="border rounded-lg p-4 bg-blue-50/50 border-blue-200">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  First Transaction Details (CV Key Info)
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date Started:</span>
                    <span className="font-medium">{formatDate(firstTx.data.timeStamp)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">First Transaction Hash:</span>
                    <a 
                      href={`https://etherscan.io/tx/${firstTx.data.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-xs"
                    >
                      {firstTx.data.hash.substring(0, 10)}...{firstTx.data.hash.substring(firstTx.data.hash.length - 8)}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Age:</span>
                    <span className="font-medium">{formatAccountAge()} old</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Source:</span>
                    <Badge variant="outline" className="text-xs">{firstTx.source}</Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-red-50/50 border-red-200">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  First Transaction - Not Found
                </h4>
                <div className="text-sm text-red-600">
                  {firstTx.error || 'No first transaction data available'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Source: {firstTx.source}
                </div>
              </div>
            )}

            {/* Multi-chain Activity */}
            {optimismTxs.data.length > 0 && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Multi-chain Experience
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ethereum Mainnet:</span>
                    <span className="font-medium">{txCount.data} transactions</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Optimism:</span>
                    <span className="font-medium">{optimismTxs.data.length}+ transactions</span>
                  </div>
                  <Badge variant="secondary" className="mt-2">Multi-chain User</Badge>
                </div>
              </div>
            )}

            {/* Professional Summary */}
            <div className="border rounded-lg p-4 bg-green-50/50 border-green-200">
              <h4 className="font-medium mb-3 text-green-900">Professional Blockchain Summary</h4>
              <div className="text-sm text-green-800 space-y-1">
                <p>• {getExperienceLevel()} blockchain user with {formatAccountAge()} of on-chain experience</p>
                <p>• {txCount.data} total transactions demonstrating active engagement</p>
                {firstTx.data && (
                  <p>• Blockchain journey started on {formatDate(firstTx.data.timeStamp)}</p>
                )}
                {optimismTxs.data.length > 0 && (
                  <p>• Multi-chain experience across Ethereum and Layer 2 solutions</p>
                )}
                {tokenTransfers.data.length > 0 && (
                  <p>• DeFi ecosystem participant with token interaction experience</p>
                )}
              </div>
            </div>

            {/* Error Summary if any APIs failed */}
            {(balance.error || txCount.error || firstTx.error) && (
              <div className="border rounded-lg p-4 bg-yellow-50/50 border-yellow-200">
                <h4 className="font-medium mb-3 text-yellow-900">API Issues Detected</h4>
                <div className="text-sm text-yellow-800 space-y-1">
                  {balance.error && <p>• Balance API: {balance.error}</p>}
                  {txCount.error && <p>• Transaction Count API: {txCount.error}</p>}
                  {firstTx.error && <p>• First Transaction API: {firstTx.error}</p>}
                  <p className="mt-2 text-xs">Check console for detailed API debugging information.</p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BlockchainActivitySection;
