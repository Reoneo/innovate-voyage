
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Box, CircleDollarSign, HardDrive, ListFilter } from 'lucide-react';
import { truncateAddress } from '@/lib/utils';
import { TransactionHistoryChart } from '@/components/visualizations/transactions/TransactionHistoryChart';

export interface BlockchainTabProps {
  address?: string;
  ensName?: string;
  blockchainProfile?: any;
  transactions?: any[];
}

const BlockchainTab: React.FC<BlockchainTabProps> = ({ 
  address,
  ensName,
  blockchainProfile,
  transactions
}) => {
  const ethereumScanLink = address 
    ? `https://etherscan.io/address/${address}`
    : '';

  return (
    <div className="space-y-6">
      {/* Blockchain Header Info */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div>
            <h2 className="text-xl font-medium flex items-center gap-2">
              <Box className="h-5 w-5" />
              Blockchain Activity
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {ensName ? `${ensName} (${truncateAddress(address || '')})` : address ? truncateAddress(address) : 'N/A'}
            </p>
          </div>
          
          {address && (
            <a 
              href={ethereumScanLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View on Etherscan <ArrowUpRight className="h-3 w-3" />
            </a>
          )}
        </div>
      </Card>
      
      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Transactions Count */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-2xl font-bold">
                {blockchainProfile?.transactionCount || '0'}
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <ListFilter className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>
        
        {/* ETH Balance */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">ETH Balance</p>
              <p className="text-2xl font-bold">
                {blockchainProfile?.balance 
                  ? parseFloat(blockchainProfile.balance).toFixed(4)
                  : '0.0000'}
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <CircleDollarSign className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>
        
        {/* First Transaction */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">First Transaction</p>
              <p className="text-lg font-medium">
                {transactions && transactions.length > 0
                  ? new Date(parseInt(transactions[transactions.length - 1]?.timeStamp || '0') * 1000).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <HardDrive className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>
        
        {/* Latest Transaction */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Latest Transaction</p>
              <p className="text-lg font-medium">
                {transactions && transactions.length > 0
                  ? new Date(parseInt(transactions[0]?.timeStamp || '0') * 1000).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <ArrowUpRight className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>
      </div>
      
      {/* Transaction History Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Transaction History</h3>
        <div className="h-80">
          <TransactionHistoryChart address={address} />
        </div>
      </Card>
    </div>
  );
};

export default BlockchainTab;
