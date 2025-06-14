
import React from "react";
import { ExternalLink, UserCircle2, BadgeDollarSign } from "lucide-react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useBlockchainProfile } from "@/hooks/useEtherscan";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityDialogContentProps {
  txCount: number | null;
  walletAddress: string;
}

const ActivityDialogContent: React.FC<ActivityDialogContentProps> = ({
  txCount,
  walletAddress
}) => {
  const { data: profile, isLoading } = useBlockchainProfile(walletAddress);

  return (
    <div className="w-full h-[96vh] max-w-4xl mx-auto flex flex-col justify-center bg-white text-gray-900 rounded-2xl overflow-hidden shadow border border-gray-200 p-0">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[420px]">
        {/* Left: summary/visual */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#f7fafd] via-[#f9f6fa] to-[#eef3fa] p-10 md:border-r border-gray-100">
          <UserCircle2 className="h-16 w-16 text-blue-400 mb-3" />
          <div className="text-lg font-semibold text-blue-700 mb-2">
            NFT and Onchain Activity
          </div>
          <div className="text-5xl font-extrabold text-blue-600 mb-1">
            {txCount ?? (isLoading ? <Skeleton className="w-20 h-10" /> : "N/A")}
          </div>
          <div className="mt-1 text-xs text-gray-400">
            Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
        </div>
        {/* Right: details */}
        <div className="flex flex-col justify-center p-10 space-y-8">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              Your Activity
            </DialogTitle>
            <DialogDescription>
              All onchain activity and NFT ownership for this wallet
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm space-y-3">
            {isLoading ? (
              <Skeleton className="h-6 w-3/4 rounded-sm" />
            ) : profile ? (
              <>
                <div>
                  <BadgeDollarSign className="inline-block h-4 w-4 text-orange-400 mr-1" />
                  <span className="font-semibold mr-1">ETH Balance:</span>
                  <span className="text-gray-700">{profile.balance} ETH</span>
                </div>
                <div>
                  <span className="font-semibold">Transactions:</span> {profile.transactionCount}
                </div>
                <div>
                  <span className="font-semibold">Token Transfers:</span> {profile.tokenTransfers?.length ?? 0}
                </div>
                <div>
                  <span className="font-semibold">Recent Transactions:</span>
                  <ul className="pl-5 text-xs mt-1 space-y-1 max-h-24 overflow-auto">
                    {(profile.latestTransactions || []).slice(0, 3).map(tx => (
                      <li key={tx.hash}>
                        <span className="text-muted-foreground">{new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString()}</span>
                        {" — "}
                        <span>{parseFloat(tx.value) / 1e18} ETH</span>
                      </li>
                    ))}
                  </ul>
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
              </>
            ) : (
              <div>No activity data found for this wallet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDialogContent;
