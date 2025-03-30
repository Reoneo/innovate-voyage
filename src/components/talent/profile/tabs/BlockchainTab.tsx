
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Info } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface BlockchainTabProps {
  transactions?: any[] | null;
  address: string;
  simplified?: boolean; 
}

const BlockchainTab: React.FC<BlockchainTabProps> = ({ transactions, address, simplified = false }) => {
  const truncateAddress = (addr: string) => {
    return addr.slice(0, 6) + '...' + addr.slice(-4);
  };

  // Function to get recent transactions
  const getRecentTransactions = () => {
    if (!transactions || transactions.length === 0) {
      return [];
    }
    
    // For simplified view, only show up to 3 transactions
    return simplified ? transactions.slice(0, 3) : transactions.slice(0, 10);
  };

  const recentTransactions = getRecentTransactions();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Blockchain Activity</CardTitle>
            {!simplified && (
              <CardDescription>Recent transactions and on-chain activity</CardDescription>
            )}
          </div>
          
          {!simplified && (
            <a 
              href={`https://etherscan.io/address/${address}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-600 hover:underline"
            >
              View on Etherscan
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {recentTransactions.map((tx, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {tx.type === 'sent' ? 'Sent to:' : 'Received from:'}
                    </span>
                    <span className="text-muted-foreground">
                      {truncateAddress(tx.to || tx.from || '')}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(tx.timestamp * 1000).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center">
                  <Badge variant={tx.type === 'sent' ? 'outline' : 'default'}>
                    {tx.value} ETH
                  </Badge>
                  
                  {!simplified && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="ml-2">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Transaction Hash: {truncateAddress(tx.hash || '')}</p>
                        <p>Gas Used: {tx.gasUsed || 'N/A'}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            ))}
            
            {simplified && transactions && transactions.length > 3 && (
              <div className="text-center mt-2">
                <a 
                  href={`https://etherscan.io/address/${address}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View more transactions on Etherscan
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              No blockchain activity found for this address
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlockchainTab;
