import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import TransactionHistoryChart from '@/components/visualizations/transactions/TransactionHistoryChart';

export interface BlockchainTabProps {
  address: string;
  ensName?: string;
  blockchainProfile?: any;
  transactions?: any[];
}

const BlockchainTab: React.FC<BlockchainTabProps> = ({ 
  address, 
  ensName, 
  blockchainProfile,
  transactions = []
}) => {
  if (!address) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Unable to load blockchain data for this profile. No valid address found.
        </AlertDescription>
      </Alert>
    );
  }
  
  const hasTransactions = transactions && transactions.length > 0;
  
  return (
    <div className="space-y-6">
      {/* Blockchain Profile Summary */}
      <Card className="p-6">
        <h2 className="text-xl font-medium mb-4">Blockchain Activity</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Blockchain Identity */}
          <div>
            <h3 className="text-lg font-medium mb-2">Identity</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Address:</span>
                <p className="font-mono text-sm break-all">{address}</p>
              </div>
              {ensName && (
                <div>
                  <span className="text-sm text-muted-foreground">ENS:</span>
                  <p>{ensName}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Blockchain Stats */}
          <div>
            <h3 className="text-lg font-medium mb-2">Stats</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">Transactions:</span>
                <p className="text-lg font-bold">{transactions?.length || 0}</p>
              </div>
              
              {blockchainProfile?.mirrorPosts > 0 && (
                <div className="p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">Mirror Posts:</span>
                  <p className="text-lg font-bold">{blockchainProfile.mirrorPosts}</p>
                </div>
              )}
              
              {blockchainProfile?.lensActivity > 0 && (
                <div className="p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">Lens Activity:</span>
                  <p className="text-lg font-bold">{blockchainProfile.lensActivity}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Transaction History */}
      {hasTransactions ? (
        <TransactionHistoryChart transactions={transactions} />
      ) : (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Transaction History</h3>
          <p className="text-muted-foreground">No transaction history available.</p>
        </Card>
      )}
      
      {/* Other Blockchain Insights */}
      <Card className="p-6">
        <h2 className="text-xl font-medium mb-2">Blockchain Insights</h2>
        <div className="space-y-2">
          {/* Networks */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Active Networks</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-muted">Ethereum</Badge>
              {blockchainProfile?.networks?.optimism && 
                <Badge variant="outline" className="bg-muted">Optimism</Badge>
              }
              {blockchainProfile?.networks?.polygon && 
                <Badge variant="outline" className="bg-muted">Polygon</Badge>
              }
            </div>
          </div>
          
          <Separator />
          
          {/* Token Activity */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Token Activity</h4>
            {blockchainProfile?.tokenActivity ? (
              <p>Token activity data found</p>
            ) : (
              <p className="text-muted-foreground">No significant token activity found</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BlockchainTab;
