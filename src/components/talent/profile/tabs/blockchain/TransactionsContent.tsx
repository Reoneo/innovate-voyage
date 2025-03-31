
import React from 'react';
import TokenFilterBadges from './TokenFilterBadges';
import TransactionHistoryChart from '@/components/visualizations/transactions/TransactionHistoryChart';
import TransactionsTable from './TransactionsTable';

interface TransactionsContentProps {
  transactions: any[] | null;
  tokens: any[];
  activeToken: string | null;
  setActiveToken: (token: string | null) => void;
  address: string;
  filteredTransactions: any[] | null;
}

const TransactionsContent: React.FC<TransactionsContentProps> = ({
  transactions,
  tokens,
  activeToken,
  setActiveToken,
  address,
  filteredTransactions
}) => {
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
      <div className="h-64">
        <TransactionHistoryChart 
          transactions={filteredTransactions || []} 
          address={address}
          showLabels={true}
        />
      </div>
      
      {/* Transaction table */}
      <TransactionsTable 
        transactions={filteredTransactions || []} 
        address={address} 
      />
    </div>
  );
};

export default TransactionsContent;
