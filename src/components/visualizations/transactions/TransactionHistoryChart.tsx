
import React from 'react';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface TransactionHistoryChartProps {
  transactions: any[];
}

const TransactionHistoryChart: React.FC<TransactionHistoryChartProps> = ({ transactions = [] }) => {
  // Group transactions by month
  const groupedData = React.useMemo(() => {
    const data: { name: string; transactions: number }[] = [];
    
    if (!transactions || transactions.length === 0) {
      // Return some placeholder data if no transactions
      return [
        { name: "Jan", transactions: 0 },
        { name: "Feb", transactions: 0 },
        { name: "Mar", transactions: 0 },
        { name: "Apr", transactions: 0 },
      ];
    }
    
    // Create a map of month -> count
    const monthMap = new Map<string, number>();
    
    // Get the last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(now.getMonth() - i);
      const monthName = date.toLocaleString('default', { month: 'short' });
      monthMap.set(monthName, 0);
    }
    
    // Count transactions per month
    transactions.forEach(tx => {
      if (tx.timeStamp) {
        const txDate = new Date(parseInt(tx.timeStamp) * 1000);
        const monthName = txDate.toLocaleString('default', { month: 'short' });
        if (monthMap.has(monthName)) {
          monthMap.set(monthName, (monthMap.get(monthName) || 0) + 1);
        }
      }
    });
    
    // Convert to array format for chart
    monthMap.forEach((count, month) => {
      data.push({ name: month, transactions: count });
    });
    
    return data;
  }, [transactions]);
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Transaction Activity</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={groupedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="transactions" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TransactionHistoryChart;
