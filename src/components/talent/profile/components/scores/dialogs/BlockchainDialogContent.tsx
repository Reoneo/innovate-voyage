
import React from "react";
import { ExternalLink, Copy, Check, Box, X } from "lucide-react";
import { DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { useBlockchainProfile } from "@/hooks/useEtherscan";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface BlockchainDialogContentProps {
  walletAddress: string;
}

const BlockchainDialogContent: React.FC<BlockchainDialogContentProps> = ({
  walletAddress
}) => {
  const { data: profile, isLoading } = useBlockchainProfile(walletAddress);
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast({ title: "Copied!", description: "Wallet address copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full h-[96vh] max-w-4xl mx-auto flex flex-col justify-center bg-white text-gray-900 rounded-2xl overflow-hidden shadow border border-gray-200 p-0">
      <DialogClose asChild>
        <button className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50">
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </button>
      </DialogClose>
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[420px]">
        {/* Left: summary/visual */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#f7fafd] via-[#f9f6fa] to-[#eef3fa] p-10 md:border-r border-gray-100">
          <Box className="h-16 w-16 text-purple-400 mb-3" />
          <div className="text-lg font-semibold text-purple-700 mb-2">
            Blockchain Details
          </div>
          <div className="text-5xl font-extrabold text-purple-600 mb-1">
            {isLoading ? (
              <Skeleton className="w-20 h-10" />
            ) : (
              profile?.transactionCount ?? "N/A"
            )}
          </div>
          <div className="mt-1 text-xs text-gray-500 uppercase tracking-wider">
            Transactions
          </div>
        </div>

        {/* Right: details */}
        <div className="flex flex-col justify-center p-10 space-y-6">
          <DialogHeader className="text-left">
            <DialogTitle className="flex items-center gap-2 text-2xl">
              Onchain Footprint
            </DialogTitle>
            <DialogDescription>
              A summary of this wallet's onchain activity.
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs bg-gray-100 p-2 rounded-md">
                {walletAddress}
              </span>
              <button onClick={handleCopy} className="p-2 hover:bg-gray-100 rounded-full">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-3/4 rounded-sm" />
                <Skeleton className="h-6 w-1/2 rounded-sm" />
              </>
            ) : profile ? (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="font-semibold text-gray-800">ETH Balance</div>
                  <div className="text-gray-600">{profile.balance} ETH</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Transactions</div>
                  <div className="text-gray-600">{profile.transactionCount}</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Token Transfers</div>
                  <div className="text-gray-600">{profile.tokenTransfers?.length ?? 0}</div>
                </div>
              </div>
            ) : (
              <div>No activity data found.</div>
            )}
          </div>
           <div className="mt-4">
              <a
                href={`https://etherscan.io/address/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline text-[15px] font-medium"
              >
                View on Etherscan <ExternalLink size={14} />
              </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainDialogContent;
