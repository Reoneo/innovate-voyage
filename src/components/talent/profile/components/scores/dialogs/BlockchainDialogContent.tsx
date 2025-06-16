
import React from 'react';
import { Activity, ExternalLink, Clock, DollarSign, Send } from 'lucide-react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBlockchainActivity } from '@/hooks/useBlockchainActivity';
import { Skeleton } from '@/components/ui/skeleton';

interface BlockchainDialogContentProps {
  walletAddress: string;
}

const BlockchainDialogContent: React.FC<BlockchainDialogContentProps> = ({ walletAddress }) => {
  const { data, loading } = useBlockchainActivity(walletAddress);

  return (
    <>
      <DialogHeader className="border-b border-gray-700 pb-3">
        <DialogTitle className="flex items-center gap-2 text-white">
          <Activity className="h-6 w-6 text-gray-400" />
          Blockchain Activity
        </DialogTitle>
        <DialogDescription className="text-gray-400">A summary of on-chain activity for this address.</DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full bg-gray-800" />
            <Skeleton className="h-24 w-full bg-gray-800" />
            <Skeleton className="h-24 w-full bg-gray-800" />
          </div>
        ) : (
          <>
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <Clock className="h-5 w-5 text-gray-400" />
                  First Transaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {data.firstTransaction || 'N/A'}
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Date of first on-chain activity
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  ETH Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {data.ethBalance || '0.0000'} ETH
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Current Ethereum balance
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <Send className="h-5 w-5 text-gray-400" />
                  Outgoing Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {data.outgoingTransactions ?? 0}
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Total transactions sent
                </p>
              </CardContent>
            </Card>
          </>
        )}

        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            asChild
          >
            <a 
              href={`https://etherscan.io/address/${walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={16} /> View on Etherscan
            </a>
          </Button>
        </div>
      </div>
    </>
  );
};

export default BlockchainDialogContent;
