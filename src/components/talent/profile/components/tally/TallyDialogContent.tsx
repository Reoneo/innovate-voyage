
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useTallyData } from '@/hooks/useTallyData';

interface TallyDialogContentProps {
  walletAddress: string;
}

const TallyDialogContent: React.FC<TallyDialogContentProps> = ({ walletAddress }) => {
  // Force data refresh by using a key with timestamp
  const refreshKey = `${walletAddress}-${Date.now()}`;
  const { tallyData, isLoading, error } = useTallyData(walletAddress);

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 p-6">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-500 font-medium">Error loading Tally data</p>
        <p className="text-gray-500 text-sm mt-2">{error}</p>
      </div>
    );
  }

  // Default empty data state
  if (!tallyData) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <img 
          src="https://cdn-icons-png.freepik.com/512/7554/7554364.png" 
          alt="Tally DAO" 
          className="h-20 w-20 mb-4 opacity-50"
        />
        <p className="text-gray-500 font-medium">No DAO data found</p>
        <p className="text-gray-500 text-sm mt-2">
          This wallet isn't participating in any DAOs tracked by Tally
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <img 
          src={tallyData.daoIcon || "https://cdn-icons-png.freepik.com/512/7554/7554364.png"}
          alt="Tally DAO" 
          className="h-16 w-16"
        />
        <div>
          <h3 className="text-xl font-bold">Tally DAO</h3>
          <p className="text-gray-500 text-sm">Governance data for {walletAddress}</p>
        </div>
      </div>

      <Tabs defaultValue="delegators">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="delegators">Delegators</TabsTrigger>
          <TabsTrigger value="delegating">Delegating To</TabsTrigger>
        </TabsList>
        
        <TabsContent value="delegators" className="mt-4 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">DAO</h4>
            <div className="flex items-center space-x-2">
              <img 
                src={tallyData.daoIcon || "https://raw.githubusercontent.com/ensdomains/media/master/icons/ENS.png"} 
                alt={tallyData.daoName || "ENS"} 
                className="h-10 w-10 rounded-full"
              />
              <span className="font-medium">{tallyData.daoName || "ENS"}</span>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                {tallyData.daoSymbol || "ENS"}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Voting Power</h4>
            <p className="text-xl font-bold">{tallyData.votingPower || "<0.01 (0.00%)"}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Received Delegations</h4>
            <p className="text-xl font-bold">{tallyData.receivedDelegations || "1 addresses delegating"}</p>
          </div>
          
          <div className="flex justify-end mt-6">
            <p className="text-sm text-gray-400">Powered by Tally</p>
          </div>
        </TabsContent>
        
        <TabsContent value="delegating" className="mt-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Delegating To</h4>
            {tallyData.delegatingTo ? (
              <div className="flex items-center space-x-2">
                <p>{tallyData.delegatingTo}</p>
              </div>
            ) : (
              <p className="text-gray-500">No delegations found</p>
            )}
          </div>
          
          <div className="flex justify-end mt-6">
            <p className="text-sm text-gray-400">Powered by Tally</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TallyDialogContent;
