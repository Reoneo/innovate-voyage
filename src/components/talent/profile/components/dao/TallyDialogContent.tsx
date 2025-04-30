
import React from 'react';
import { useTallyData } from '@/hooks/useTallyData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface TallyDialogContentProps {
  walletAddress: string;
}

const TallyDialogContent: React.FC<TallyDialogContentProps> = ({ walletAddress }) => {
  const { tallyData, isLoading, error } = useTallyData(walletAddress);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (error || !tallyData) {
    return (
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">Error</h3>
        <p className="text-muted-foreground">
          {error || "Failed to load DAO data. Please try again later."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white text-black p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-full flex items-center justify-center">
          <img
            src="https://cdn-icons-png.freepik.com/512/7554/7554364.png"
            alt="Tally Logo"
            className="h-12 w-12 object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold">Tally DAO</h2>
      </div>

      <Tabs defaultValue="delegators" className="w-full">
        <TabsList className="w-full bg-gray-100 p-1 rounded-full">
          <TabsTrigger value="delegators" className="rounded-full flex-1">
            Delegators
          </TabsTrigger>
          <TabsTrigger value="delegating" className="rounded-full flex-1">
            Delegating To
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">DAO</h3>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src="https://storage.googleapis.com/zapper-fi-assets/apps/icons/ens.png"
                    alt="ENS"
                    className="h-6 w-6 object-cover"
                  />
                </div>
                <span className="font-bold">{tallyData.daoName}</span>
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                  ENS
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1">Voting Power</h3>
              <p className="font-medium">{tallyData.votingPower}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1">Received Delegations</h3>
              <p className="font-medium">
                {tallyData.delegations} {tallyData.delegations === 1 ? "address" : "addresses"} delegating
              </p>
            </div>
          </div>

          <TabsContent value="delegators">
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              {tallyData.delegations > 0 ? (
                <p>1 address is delegating to this wallet</p>
              ) : (
                <p>No addresses are delegating to this wallet</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="delegating">
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <p>This wallet is not delegating to any addresses</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <div className="mt-6 text-right text-gray-400 text-sm">
        Powered by Tally
      </div>
    </div>
  );
};

export default TallyDialogContent;
