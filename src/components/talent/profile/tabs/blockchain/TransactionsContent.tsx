
import React from 'react';
import TokenFilterBadges from './TokenFilterBadges';
import TransactionHistoryChart from '@/components/visualizations/transactions/TransactionHistoryChart';
import TransactionsTable from './TransactionsTable';
import { Loader2 } from 'lucide-react';

interface TransactionsContentProps {
  transactions: any[] | null;
  tokens: any[];
  activeToken: string | null;
  setActiveToken: (token: string | null) => void;
  address: string;
  filteredTransactions: any[] | null;
  loading?: boolean;
}

const TransactionsContent: React.FC<TransactionsContentProps> = ({
  transactions,
  tokens,
  activeToken,
  setActiveToken,
  address,
  filteredTransactions,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading transaction data...</p>
      </div>
    );
  }
  
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No transaction history found for this address
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Token filter chips */}
      {tokens.length > 0 && (
        <TokenFilterBadges 
          tokens={tokens} 
          activeToken={activeToken} 
          setActiveToken={setActiveToken} 
        />
      )}
      
      {/* Transaction chart */}
      <div className="h-64 w-full overflow-x-auto">
        <TransactionHistoryChart 
          transactions={filteredTransactions || []} 
          address={address}
          showLabels={true}
        />
      </div>
      
      {/* Transaction table */}
      <div className="overflow-x-auto">
        <TransactionsTable 
          transactions={filteredTransactions || []} 
          address={address} 
        />
      </div>
    </div>
  );
};

export default TransactionsContent;
