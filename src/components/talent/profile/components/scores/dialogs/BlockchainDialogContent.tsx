
import React from 'react';
import { Activity, ExternalLink, Clock, DollarSign, Send } from 'lucide-react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useBlockchainActivity } from '@/hooks/useBlockchainActivity';
import { Skeleton } from '@/components/ui/skeleton';

interface BlockchainDialogContentProps {
  walletAddress: string;
}

const BlockchainDialogContent: React.FC<BlockchainDialogContentProps> = ({ walletAddress }) => {
  const { data, loading } = useBlockchainActivity(walletAddress);

  return (
    <div className="max-w-3xl mx-auto bg-white text-gray-900 rounded-2xl overflow-hidden shadow border border-gray-200 p-0">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[320px]">
        {/* Left: stat summary */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#fcfcff] via-[#f1f6fb] to-[#f3f4fa] p-8 md:border-r border-gray-100">
          <Activity className="h-12 w-12 text-blue-600 mb-2" />
          <div className="text-md font-semibold text-blue-900 mb-4">Blockchain Activity</div>
          {loading ? (
            <Skeleton className="h-16 w-32 mb-2" />
          ) : (
            <div className="space-y-2 w-full">
              <div>
                <span className="block text-xs text-gray-400">First txn</span>
                <span className="block text-lg font-bold text-blue-700">{data.firstTransaction ?? 'N/A'}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400">ETH</span>
                <span className="block text-lg font-bold text-green-700">{data.ethBalance ?? '0.0000'}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400">Sent</span>
                <span className="block text-lg font-bold text-purple-700">{data.outgoingTransactions ?? 0}</span>
              </div>
            </div>
          )}
          <div className="mt-4 text-xs text-gray-400">
            Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
        </div>
        {/* Right: description/detail */}
        <div className="flex flex-col justify-center p-8 space-y-6">
          <div>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                Blockchain Activity Details
              </DialogTitle>
              <DialogDescription>
                Complete on-chain activity analysis
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="text-sm">
            <div className="mb-2">
              <strong>First Transaction:</strong> {loading ? <span className="inline-block w-14 h-3 bg-gray-200 rounded" /> : data.firstTransaction ?? 'N/A'}
            </div>
            <div className="mb-2">
              <strong>ETH Balance:</strong> {loading ? <span className="inline-block w-12 h-3 bg-gray-200 rounded" /> : (data.ethBalance ?? '0.0000')} ETH
            </div>
            <div className="mb-2">
              <strong>Outgoing Txns:</strong> {loading ? <span className="inline-block w-8 h-3 bg-gray-200 rounded" /> : data.outgoingTransactions ?? 0}
            </div>
            <div className="mt-3">
              <a 
                href={`https://etherscan.io/address/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline text-[15px] font-medium"
              >
                <ExternalLink size={15}/> View on Etherscan
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainDialogContent;
