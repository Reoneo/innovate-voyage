
import React from 'react';
import { useBlockchainProfile } from '@/hooks/useEtherscan';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDownUp, Coins, AlignJustify } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlockchainActivityProps {
  address: string;
}

function formatTimeStamp(timestamp: string): string {
  const date = new Date(parseInt(timestamp) * 1000);
  return date.toLocaleDateString();
}

function formatEther(wei: string): string {
  const ether = parseFloat(wei) / 1e18;
  return ether.toFixed(4);
}

const BlockchainActivity: React.FC<BlockchainActivityProps> = ({ address }) => {
  const { data: profile, isLoading, error } = useBlockchainProfile(address);
  const { toast } = useToast();

  // Display toast when there's an API key error
  React.useEffect(() => {
    if (error) {
      toast({
        title: "API Key Missing",
        description: "Using mock blockchain data. Set VITE_ETHERSCAN_API_KEY in your environment to see real data.",
        variant: "default",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-sm text-muted-foreground">
        Could not load blockchain data. Using mock data instead.
      </div>
    );
  }

  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-primary" />
          <span className="font-medium">ETH Balance:</span>
        </div>
        <span className="font-medium">{profile.balance} ETH</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlignJustify className="h-4 w-4 text-primary" />
          <span className="font-medium">Transactions:</span>
        </div>
        <span className="font-medium">{profile.transactionCount}</span>
      </div>
      
      {profile.latestTransactions && profile.latestTransactions.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="text-xs font-medium mb-2">Recent Activity</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {profile.latestTransactions.slice(0, 3).map((tx) => (
                <div key={tx.hash} className="text-xs flex gap-2 items-center">
                  <ArrowDownUp className={`h-3 w-3 ${tx.from.toLowerCase() === address.toLowerCase() ? 'text-red-500' : 'text-green-500'}`} />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">{formatTimeStamp(tx.timeStamp)}</span>
                      <span className="font-medium">
                        {formatEther(tx.value)} ETH
                      </span>
                    </div>
                    <div className="text-muted-foreground truncate w-40">
                      {tx.from.toLowerCase() === address.toLowerCase() ? 'To: ' : 'From: '}
                      {tx.from.toLowerCase() === address.toLowerCase() ? tx.to : tx.from}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BlockchainActivity;
