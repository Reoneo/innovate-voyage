
import React, { useState, useEffect } from 'react';
import { Activity, ExternalLink, Calendar, DollarSign } from 'lucide-react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBlockchainActivity } from '@/hooks/useBlockchainActivity';
import { getLatestTransactions } from '@/api/services/etherscanService';
import { Skeleton } from '@/components/ui/skeleton';

interface BlockchainDialogContentProps {
  walletAddress: string;
}

const BlockchainDialogContent: React.FC<BlockchainDialogContentProps> = ({ walletAddress }) => {
  const { data, loading } = useBlockchainActivity(walletAddress);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTxs, setLoadingTxs] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const txs = await getLatestTransactions(walletAddress, 10);
        setTransactions(txs);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoadingTxs(false);
      }
    };

    if (walletAddress) {
      fetchTransactions();
    }
  }, [walletAddress]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString();
  };

  const formatValue = (value: string) => {
    const ethValue = parseFloat(value) / 1e18;
    return ethValue.toFixed(4);
  };

  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto">
      <DialogHeader className="mb-6">
        <DialogTitle className="flex items-center gap-2 text-2xl">
          <Activity className="h-6 w-6 text-blue-500" />
          Onchain Activity
        </DialogTitle>
        <DialogDescription className="text-lg">
          Complete blockchain activity overview for this wallet
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 flex-1">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                First Transaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Skeleton className="h-8 w-24" /> : data.firstTransaction || 'N/A'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                ETH Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Skeleton className="h-8 w-24" /> : `${data.ethBalance || '0'} ETH`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Outgoing Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Skeleton className="h-8 w-24" /> : data.outgoingTransactions || '0'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingTxs ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((tx, index) => (
                  <div key={tx.hash || index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm">
                          {tx.hash?.substring(0, 10)}...{tx.hash?.substring(tx.hash.length - 8)}
                        </span>
                        <a 
                          href={`https://etherscan.io/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                      <div className="text-sm text-gray-600">
                        {tx.from?.toLowerCase() === walletAddress.toLowerCase() ? 'Sent' : 'Received'} • {formatTimestamp(tx.timeStamp)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatValue(tx.value)} ETH
                      </div>
                      <div className="text-sm text-gray-600">
                        To: {tx.to?.substring(0, 6)}...{tx.to?.substring(tx.to.length - 4)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No transactions found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Etherscan Link */}
        <div className="flex justify-center">
          <a 
            href={`https://etherscan.io/address/${walletAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            View Full History on Etherscan <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlockchainDialogContent;
