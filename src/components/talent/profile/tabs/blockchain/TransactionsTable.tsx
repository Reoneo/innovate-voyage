
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TransactionsTableProps {
  transactions: any[];
  address: string;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions, address }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No transaction history found for this address
      </div>
    );
  }
  
  return (
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
          {transactions.slice(0, 10).map((tx, idx) => {
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
  );
};

export default TransactionsTable;
