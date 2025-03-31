
import React from 'react';
import { Loader2 } from 'lucide-react';

interface TokensTableProps {
  tokens: any[];
  loading: boolean;
}

const TokensTable: React.FC<TokensTableProps> = ({ tokens, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
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
