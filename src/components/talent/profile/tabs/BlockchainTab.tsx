
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getWalletCreationDate, 
  getStakingPositions, 
  getTokensByAddress 
} from '@/api/services/etherscanService';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Import our refactored components
import WalletStatsCards from './blockchain/WalletStatsCards';
import TokensTable from './blockchain/TokensTable';
import StakingTable from './blockchain/StakingTable';
import TransactionsContent from './blockchain/TransactionsContent';

interface BlockchainTabProps {
  transactions: any[] | null;
  address: string;
  error?: Error | null;
}

const BlockchainTab: React.FC<BlockchainTabProps> = ({ transactions, address, error: transactionsError }) => {
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
  const [errors, setErrors] = useState({
    walletDate: null as Error | null,
    staking: null as Error | null,
    tokens: null as Error | null
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
          setErrors(prev => ({ ...prev, walletDate: null }));
        })
        .catch(err => {
          console.error('Error fetching wallet creation date:', err);
          setErrors(prev => ({ ...prev, walletDate: err }));
        })
        .finally(() => setLoading(prev => ({ ...prev, walletDate: false })));
      
      // Fetch staking positions
      getStakingPositions(address)
        .then(positions => {
          setStakingPositions(positions);
          setErrors(prev => ({ ...prev, staking: null }));
        })
        .catch(err => {
          console.error('Error fetching staking positions:', err);
          setErrors(prev => ({ ...prev, staking: err }));
        })
        .finally(() => setLoading(prev => ({ ...prev, staking: false })));
      
      // Fetch token holdings
      getTokensByAddress(address)
        .then(tokensList => {
          setTokens(tokensList);
          setErrors(prev => ({ ...prev, tokens: null }));
        })
        .catch(err => {
          console.error('Error fetching tokens:', err);
          setErrors(prev => ({ ...prev, tokens: err }));
        })
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
  
  // Check if there are any errors from Etherscan API
  const hasEtherscanErrors = transactionsError || errors.walletDate || errors.staking || errors.tokens;
  
  if (hasEtherscanErrors && !allLoading) {
    const errorMessage = transactionsError?.message || 
                         errors.walletDate?.message || 
                         errors.staking?.message || 
                         errors.tokens?.message || 
                         'Unknown error fetching blockchain data';
                         
    if (errorMessage.includes('API key') || errorMessage.includes('rate limit')) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Blockchain Activity</CardTitle>
            <CardDescription>
              On-chain transaction history and assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Etherscan API Error: {errorMessage}. Please try again later or check your API key configuration.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      );
    }
  }
  
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
            errors={{
              walletDate: errors.walletDate,
              tokens: errors.tokens
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
                  error={transactionsError}
                />
              </div>
            </TabsContent>
            
            {/* Tokens Tab Content */}
            <TabsContent value="tokens">
              <div className="overflow-x-auto">
                <TokensTable 
                  tokens={tokens} 
                  loading={loading.tokens} 
                  error={errors.tokens}
                />
              </div>
            </TabsContent>
            
            {/* Staking Tab Content */}
            <TabsContent value="staking">
              <div className="overflow-x-auto">
                <StakingTable 
                  stakingPositions={stakingPositions} 
                  loading={loading.staking} 
                  error={errors.staking}
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
