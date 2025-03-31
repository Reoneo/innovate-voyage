
import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface StakingTableProps {
  stakingPositions: any[];
  loading: boolean;
  error?: Error | null;
}

const StakingTable: React.FC<StakingTableProps> = ({ stakingPositions, loading, error }) => {
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
          Failed to load staking data: {error.message}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (stakingPositions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No staking positions found for this address
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Amount</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Transaction</th>
          </tr>
        </thead>
        <tbody>
          {stakingPositions.map((position, idx) => (
            <tr key={idx} className="border-t border-border">
              <td className="p-2 font-medium">{position.type}</td>
              <td className="p-2">{position.valueFormatted}</td>
              <td className="p-2">
                {new Date(parseInt(position.timestamp) * 1000).toLocaleDateString()}
              </td>
              <td className="p-2 truncate max-w-[150px]">
                <a 
                  href={`https://etherscan.io/tx/${position.hash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {position.hash.substring(0, 8)}...{position.hash.substring(position.hash.length - 8)}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StakingTable;
