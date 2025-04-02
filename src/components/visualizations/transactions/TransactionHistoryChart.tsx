
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Transaction {
  hash: string;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasUsed: string;
  methodId?: string;
}

interface TransactionHistoryChartProps {
  transactions: Transaction[];
}

const TransactionHistoryChart: React.FC<TransactionHistoryChartProps> = ({ transactions }) => {
  // Group transactions by month
  const groupTransactionsByMonth = () => {
    const monthlyData: Record<string, { month: string, count: number }> = {};
    
    transactions.forEach(tx => {
      const date = new Date(parseInt(tx.timeStamp) * 1000);
      const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      
      if (monthlyData[month]) {
        monthlyData[month].count++;
      } else {
        monthlyData[month] = {
          month,
          count: 1
        };
      }
    });
    
    // Return as array sorted by date
    return Object.values(monthlyData).sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });
  };
  
  const transactionData = groupTransactionsByMonth();
  
  if (transactions.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-2">Transaction History</h3>
        <p className="text-muted-foreground">No transaction history available.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Transaction History</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={transactionData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip 
              formatter={(value) => [`${value} transactions`, 'Count']}
              labelFormatter={(label) => `${label}`}
            />
            <Bar 
              dataKey="count" 
              name="Transactions" 
              fill="#6366f1" // indigo-500
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Total transactions: <span className="font-medium">{transactions.length}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          First transaction: <span className="font-medium">
            {new Date(parseInt(transactions[transactions.length - 1]?.timeStamp) * 1000).toLocaleDateString()}
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          Latest transaction: <span className="font-medium">
            {new Date(parseInt(transactions[0]?.timeStamp) * 1000).toLocaleDateString()}
          </span>
        </p>
      </div>
    </Card>
  );
};

export default TransactionHistoryChart;
