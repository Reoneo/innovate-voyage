
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useTallyData } from '@/hooks/useTallyData';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface TallyDialogContentProps {
  walletAddress: string;
}

const TallyDialogContent: React.FC<TallyDialogContentProps> = ({ walletAddress }) => {
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const { tallyData, isLoading, error } = useTallyData(walletAddress);

  const handleRefresh = () => {
    setRefreshKey(Date.now());
  };

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
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          className="mt-4"
          size="sm"
        >
          <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
        </Button>
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img 
            src={tallyData.daoIcon || "https://cdn-icons-png.freepik.com/512/7554/7554364.png"}
            alt="Tally DAO" 
            className="h-16 w-16"
          />
          <div>
            <h3 className="text-xl font-bold">{tallyData.daoName}</h3>
            <p className="text-gray-500 text-sm">Governance data for {walletAddress}</p>
          </div>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="ghost" 
          size="sm"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
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
            <p className="text-lg font-medium mb-2">{tallyData.receivedDelegations || "No delegations"}</p>
            
            {tallyData.delegators && tallyData.delegators.length > 0 ? (
              <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                <h5 className="text-sm font-medium text-gray-600">Delegator Addresses:</h5>
                {tallyData.delegators.map((delegator, index) => (
                  <div key={index} className="bg-gray-100 p-2 rounded text-sm flex justify-between items-center">
                    <span className="font-mono truncate max-w-[200px]">{delegator.address}</span>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">{delegator.votingPower}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">No addresses delegating to this wallet</p>
            )}
          </div>
          
          <div className="flex justify-end mt-6">
            <p className="text-sm text-gray-400">Powered by Tally</p>
          </div>
        </TabsContent>
        
        <TabsContent value="delegating" className="mt-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Delegating To</h4>
            {tallyData.delegations && tallyData.delegations.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {tallyData.delegations.map((delegation, index) => (
                  <div key={index} className="bg-gray-100 p-2 rounded text-sm flex justify-between items-center">
                    <span className="font-mono truncate max-w-[200px]">{delegation.address}</span>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">{delegation.votingPower}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Not delegating to any addresses</p>
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
