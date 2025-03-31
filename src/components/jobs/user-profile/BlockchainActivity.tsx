
import React from 'react';
import { useBlockchainProfile } from '@/hooks/useEtherscan';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDownUp, Coins, AlignJustify, AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [apiKeyChecked, setApiKeyChecked] = React.useState(false);

  // Check if API key is present and display appropriate toast
  React.useEffect(() => {
    if (!apiKeyChecked && error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('API key')) {
        toast({
          title: "API Key Issue",
          description: "Unable to fetch blockchain data due to API key limitations.",
          variant: "destructive",
        });
      } else if (errorMessage.includes('rate limit')) {
        toast({
          title: "Rate Limit Exceeded",
          description: "Etherscan API rate limit reached. Please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Blockchain Data Error",
          description: "There was an error fetching blockchain data.",
          variant: "destructive",
        });
      }
      setApiKeyChecked(true);
    }
  }, [error, toast, apiKeyChecked]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between mt-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Separator className="my-2" />
        <Skeleton className="h-4 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Blockchain Data Error</AlertTitle>
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
        <div className="text-sm">
          <p className="text-muted-foreground mt-2">
            This may be due to API rate limiting or connectivity issues. Try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No blockchain data available</AlertTitle>
          <AlertDescription>
            No blockchain activity found for this address.
          </AlertDescription>
        </Alert>
        <div className="text-sm">
          <p className="text-muted-foreground mt-2">
            Some ENS names may not map directly to Ethereum addresses or may have resolution issues.
            If you're seeing this error, try viewing the profile by Ethereum address instead.
          </p>
        </div>
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
      
      {profile.latestTransactions && profile.latestTransactions.length > 0 ? (
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
      ) : (
        <div className="text-sm text-muted-foreground py-2">
          No recent transactions found
        </div>
      )}
    </div>
  );
};

export default BlockchainActivity;
