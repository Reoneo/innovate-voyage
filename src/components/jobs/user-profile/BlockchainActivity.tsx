
import React from 'react';
import { useBlockchainProfile } from '@/hooks/useEtherscan';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDownUp, Coins, AlignJustify, AlertCircle } from 'lucide-react';
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
    if (!apiKeyChecked) {
      const apiKey = "5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM";
      
      if (!apiKey) {
        toast({
          title: "API Key Missing",
          description: "Using mock blockchain data. Set VITE_ETHERSCAN_API_KEY in your environment to see real data.",
          variant: "default",
        });
      } else if (error) {
        toast({
          title: "Etherscan API Error",
          description: "There was an error fetching blockchain data. This may be due to rate limiting or an invalid address.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Etherscan API Connected",
          description: "Using real blockchain data from Etherscan.",
          variant: "default",
        });
      }
      setApiKeyChecked(true);
    }
  }, [error, toast, apiKeyChecked]);

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
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading blockchain data</AlertTitle>
          <AlertDescription>
            {error ? 
              `Error: ${error instanceof Error ? error.message : 'Unable to fetch blockchain data'}` : 
              'Could not retrieve blockchain activity for this address. Using mock data instead.'}
          </AlertDescription>
        </Alert>
        <div className="text-sm">
          <p className="text-muted-foreground mt-2">
            Note: Some ENS names may not map directly to Ethereum addresses or may have resolution issues.
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
