
import React from 'react';
import { Loader2, CalendarClock, Wallet, Coins } from 'lucide-react';

interface WalletStatsCardsProps {
  walletCreationDate: string | null;
  transactions: any[] | null;
  tokens: any[];
  loading: {
    walletDate: boolean;
    tokens: boolean;
  };
}

const WalletStatsCards: React.FC<WalletStatsCardsProps> = ({ 
  walletCreationDate, 
  transactions, 
  tokens, 
  loading 
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Unknown';
    }
  };

  return (
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
  );
};

export default WalletStatsCards;
