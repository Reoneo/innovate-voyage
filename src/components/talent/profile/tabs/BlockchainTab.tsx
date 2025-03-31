
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CalendarClock, Wallet, Coins } from 'lucide-react';
import TransactionHistoryChart from '@/components/visualizations/transactions/TransactionHistoryChart';
import { 
  getWalletCreationDate, 
  getStakingPositions, 
  getTokensByAddress 
} from '@/api/services/etherscanService';

interface BlockchainTabProps {
  transactions: any[] | null;
  address: string;
}

const BlockchainTab: React.FC<BlockchainTabProps> = ({ transactions, address }) => {
  const [walletCreationDate, setWalletCreationDate] = useState<string | null>(null);
  const [stakingPositions, setStakingPositions] = useState<any[]>([]);
  const [tokens, setTokens] = useState<any[]>([]);
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    walletDate: true,
    staking: true,
    tokens: true
  });
  
  useEffect(() => {
    if (address) {
      // Fetch wallet creation date
      getWalletCreationDate(address).then(date => {
        setWalletCreationDate(date);
        setLoading(prev => ({ ...prev, walletDate: false }));
      });
      
      // Fetch staking positions
      getStakingPositions(address).then(positions => {
        setStakingPositions(positions);
        setLoading(prev => ({ ...prev, staking: false }));
      });
      
      // Fetch token holdings
      getTokensByAddress(address).then(tokensList => {
        setTokens(tokensList);
        setLoading(prev => ({ ...prev, tokens: false }));
      });
    }
  }, [address]);
  
  // Filter transactions by token if a token is selected
  const filteredTransactions = React.useMemo(() => {
    if (!activeToken || !transactions) return transactions;
    
    return transactions.filter(tx => {
      // This is a simplistic filter - in a real implementation, you'd check contract addresses
      // For now, we'll just check if the transaction data contains the token symbol
      return tx.input && tx.input.toLowerCase().includes(activeToken.toLowerCase());
    });
  }, [transactions, activeToken]);
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Unknown';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blockchain Activity</CardTitle>
        <CardDescription>
          On-chain transaction history and assets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Wallet Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Wallet Age</h3>
              </div>
              {loading.walletDate ? (
                <div className="flex items-center justify-center h-6">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <p className="text-lg font-semibold">
                  {walletCreationDate ? formatDate(walletCreationDate) : 'No data available'}
                </p>
              )}
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Total Transactions</h3>
              </div>
              {!transactions ? (
                <div className="flex items-center justify-center h-6">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <p className="text-lg font-semibold">
                  {transactions.length > 0 ? transactions.length : 'No transactions'}
                </p>
              )}
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Token Types</h3>
              </div>
              {loading.tokens ? (
                <div className="flex items-center justify-center h-6">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <p className="text-lg font-semibold">
                  {tokens.length > 0 ? tokens.length : 'No tokens found'}
                </p>
              )}
            </div>
          </div>
          
          {/* Tabs for different data views */}
          <Tabs defaultValue="transactions">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="tokens">Token Holdings</TabsTrigger>
              <TabsTrigger value="staking">Staking</TabsTrigger>
            </TabsList>
            
            {/* Transactions Tab Content */}
            <TabsContent value="transactions">
              {transactions && transactions.length > 0 ? (
                <div className="space-y-6">
                  {/* Token filter chips */}
                  {tokens.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant={activeToken === null ? "secondary" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setActiveToken(null)}
                      >
                        All
                      </Badge>
                      {tokens.map((token, idx) => (
                        <Badge 
                          key={idx}
                          variant={activeToken === token.symbol ? "secondary" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setActiveToken(token.symbol)}
                        >
                          {token.symbol}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Transaction chart */}
                  <div className="h-64">
                    <TransactionHistoryChart 
                      transactions={filteredTransactions || []} 
                      address={address}
                      showLabels={true}
                    />
                  </div>
                  
                  {/* Transaction table */}
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-2 text-left">Date</th>
                          <th className="p-2 text-left">Type</th>
                          <th className="p-2 text-left">Value</th>
                          <th className="p-2 text-left">Hash</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(filteredTransactions || []).slice(0, 10).map((tx, idx) => {
                          const date = new Date(parseInt(tx.timeStamp) * 1000);
                          const isSent = tx.from.toLowerCase() === address.toLowerCase();
                          const value = parseFloat(tx.value) / 1e18;
                          
                          return (
                            <tr key={idx} className="border-t border-border">
                              <td className="p-2">{date.toLocaleDateString()}</td>
                              <td className="p-2">
                                <Badge variant={isSent ? "destructive" : "default"}>
                                  {isSent ? 'Sent' : 'Received'}
                                </Badge>
                              </td>
                              <td className="p-2 font-medium">{value.toFixed(4)} ETH</td>
                              <td className="p-2 truncate max-w-[150px]">
                                <a 
                                  href={`https://etherscan.io/tx/${tx.hash}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  {tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 8)}
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No transaction history found for this address
                </div>
              )}
            </TabsContent>
            
            {/* Tokens Tab Content */}
            <TabsContent value="tokens">
              {loading.tokens ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : tokens.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-2 text-left">Token</th>
                        <th className="p-2 text-left">Symbol</th>
                        <th className="p-2 text-left">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.map((token, idx) => (
                        <tr key={idx} className="border-t border-border">
                          <td className="p-2 font-medium">{token.name}</td>
                          <td className="p-2">{token.symbol}</td>
                          <td className="p-2">{token.balanceFormatted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No token holdings found for this address
                </div>
              )}
            </TabsContent>
            
            {/* Staking Tab Content */}
            <TabsContent value="staking">
              {loading.staking ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : stakingPositions.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-left">Amount</th>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Transaction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stakingPositions.map((position, idx) => (
                        <tr key={idx} className="border-t border-border">
                          <td className="p-2 font-medium">{position.type}</td>
                          <td className="p-2">{position.valueFormatted}</td>
                          <td className="p-2">
                            {new Date(parseInt(position.timestamp) * 1000).toLocaleDateString()}
                          </td>
                          <td className="p-2 truncate max-w-[150px]">
                            <a 
                              href={`https://etherscan.io/tx/${position.hash}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {position.hash.substring(0, 8)}...{position.hash.substring(position.hash.length - 8)}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No staking positions found for this address
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainTab;
