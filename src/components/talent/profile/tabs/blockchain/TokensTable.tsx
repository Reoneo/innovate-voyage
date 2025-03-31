
import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TokensTableProps {
  tokens: any[];
  loading: boolean;
  error?: Error | null;
}

const TokensTable: React.FC<TokensTableProps> = ({ tokens, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load token data: {error.message}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (tokens.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No token holdings found for this address
      </div>
    );
  }
  
  return (
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
  );
};

export default TokensTable;
