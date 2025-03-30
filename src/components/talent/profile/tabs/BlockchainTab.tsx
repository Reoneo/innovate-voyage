
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TransactionHistoryChart from '@/components/visualizations/transactions/TransactionHistoryChart';

interface BlockchainTabProps {
  transactions: any[] | null;
  address: string;
}

const BlockchainTab: React.FC<BlockchainTabProps> = ({ transactions, address }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          Recent blockchain transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions && transactions.length > 0 ? (
          <div className="space-y-8">
            <div className="h-64">
              <TransactionHistoryChart 
                transactions={transactions} 
                address={address}
                showLabels={true}
              />
            </div>
            
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
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No transaction history found for this address
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlockchainTab;
