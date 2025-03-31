
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getWalletCreationDate, 
  getStakingPositions, 
  getTokensByAddress 
} from '@/api/services/etherscanService';
import { Loader2 } from 'lucide-react';

// Import our refactored components
import WalletStatsCards from './blockchain/WalletStatsCards';
import TokensTable from './blockchain/TokensTable';
import StakingTable from './blockchain/StakingTable';
import TransactionsContent from './blockchain/TransactionsContent';

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
    tokens: true,
    transactions: true
  });
  
  useEffect(() => {
    if (address) {
      // Start with all loading states true
      setLoading({
        walletDate: true,
        staking: true,
        tokens: true,
        transactions: !!transactions // Only show loading if we're expecting transactions
      });
      
      // Fetch wallet creation date
      getWalletCreationDate(address)
        .then(date => {
          setWalletCreationDate(date);
        })
        .catch(err => console.error('Error fetching wallet creation date:', err))
        .finally(() => setLoading(prev => ({ ...prev, walletDate: false })));
      
      // Fetch staking positions
      getStakingPositions(address)
        .then(positions => {
          setStakingPositions(positions);
        })
        .catch(err => console.error('Error fetching staking positions:', err))
        .finally(() => setLoading(prev => ({ ...prev, staking: false })));
      
      // Fetch token holdings
      getTokensByAddress(address)
        .then(tokensList => {
          setTokens(tokensList);
        })
        .catch(err => console.error('Error fetching tokens:', err))
        .finally(() => setLoading(prev => ({ ...prev, tokens: false })));
      
      // Mark transactions as loaded if we have them
      if (transactions) {
        setLoading(prev => ({ ...prev, transactions: false }));
      }
    }
  }, [address, transactions]);
  
  // Filter transactions by token if a token is selected
  const filteredTransactions = React.useMemo(() => {
    if (!activeToken || !transactions) return transactions;
    
    return transactions.filter(tx => {
      // This is a simplistic filter - in a real implementation, you'd check contract addresses
      return tx.input && tx.input.toLowerCase().includes(activeToken.toLowerCase());
    });
  }, [transactions, activeToken]);
  
  // If all loading states are true, show a loading indicator
  const allLoading = loading.walletDate && loading.staking && loading.tokens && loading.transactions;
  
  if (allLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Activity</CardTitle>
          <CardDescription>
            On-chain transaction history and assets
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading blockchain data...</p>
        </CardContent>
      </Card>
    );
  }

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
          {/* Wallet Stats Cards */}
          <WalletStatsCards
            walletCreationDate={walletCreationDate}
            transactions={transactions}
            tokens={tokens}
            loading={{
              walletDate: loading.walletDate,
              tokens: loading.tokens
            }}
          />
          
          {/* Tabs for different data views */}
          <Tabs defaultValue="transactions">
            <TabsList className="grid grid-cols-3 mb-4 w-full">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="tokens">Token Holdings</TabsTrigger>
              <TabsTrigger value="staking">Staking</TabsTrigger>
            </TabsList>
            
            {/* Transactions Tab Content */}
            <TabsContent value="transactions">
              <div className="overflow-x-auto">
                <TransactionsContent 
                  transactions={transactions}
                  tokens={tokens}
                  activeToken={activeToken}
                  setActiveToken={setActiveToken}
                  address={address}
                  filteredTransactions={filteredTransactions}
                  loading={loading.transactions}
                />
              </div>
            </TabsContent>
            
            {/* Tokens Tab Content */}
            <TabsContent value="tokens">
              <div className="overflow-x-auto">
                <TokensTable 
                  tokens={tokens} 
                  loading={loading.tokens} 
                />
              </div>
            </TabsContent>
            
            {/* Staking Tab Content */}
            <TabsContent value="staking">
              <div className="overflow-x-auto">
                <StakingTable 
                  stakingPositions={stakingPositions} 
                  loading={loading.staking} 
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainTab;
