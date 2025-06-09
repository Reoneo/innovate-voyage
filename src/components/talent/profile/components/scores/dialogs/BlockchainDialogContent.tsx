
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBlockchainActivity } from '@/hooks/useBlockchainActivity';
import { Calendar, Coins, ArrowUpRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface BlockchainDialogContentProps {
  walletAddress: string;
}

const BlockchainDialogContent: React.FC<BlockchainDialogContentProps> = ({
  walletAddress
}) => {
  const { data, loading } = useBlockchainActivity(walletAddress);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <img 
            src="https://socialbubbles.ae/wp-content/uploads/2024/08/etherscan-image.png" 
            alt="Etherscan" 
            className="w-6 h-6"
          />
          Blockchain Activity Details
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6 pt-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <div className="grid gap-4">
            {data.firstTransaction && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>First Transaction:</span>
                </div>
                <span className="text-sm font-medium">{data.firstTransaction}</span>
              </div>
            )}
            
            {data.ethBalance && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Coins className="h-4 w-4" />
                  <span>ETH Balance:</span>
                </div>
                <span className="text-sm font-medium">{data.ethBalance} ETH</span>
              </div>
            )}
            
            {data.outgoingTransactions !== null && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>Outgoing Transactions:</span>
                </div>
                <span className="text-sm font-medium">{data.outgoingTransactions}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BlockchainDialogContent;
