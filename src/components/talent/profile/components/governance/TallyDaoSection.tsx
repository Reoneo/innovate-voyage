
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useTallyData } from '@/hooks/useTallyData';
import { formatEther } from 'ethers';

interface TallyDaoSectionProps {
  walletAddress?: string;
}

export const TallyDaoSection: React.FC<TallyDaoSectionProps> = ({ walletAddress }) => {
  const { governances, loading, error } = useTallyData(walletAddress);
  const hasData = Object.keys(governances).length > 0;

  if (!walletAddress || (loading === false && !hasData && !error)) {
    return null;
  }

  return (
    <Card className="overflow-hidden bg-white border border-gray-100 shadow-md rounded-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <img 
            src="https://substackcdn.com/image/fetch/w_1360,c_limit,f_webp,q_auto:best,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F16e04a51-6718-44ad-b41e-01598da994b6_1280x1280.png" 
            alt="Tally DAO" 
            className="w-8 h-8 object-contain"
          />
          <CardTitle className="text-lg font-semibold text-gray-900">Tally DAO</CardTitle>
        </div>
      </CardHeader>

      <Tabs defaultValue="delegators" className="w-full">
        <div className="px-6 pt-2 border-b">
          <TabsList className="bg-gray-100 w-full grid grid-cols-2 p-1 rounded-md">
            <TabsTrigger value="delegators" className="text-sm py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Delegators
            </TabsTrigger>
            <TabsTrigger value="delegating" className="text-sm py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Delegating To
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="p-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-4 text-gray-500">
              <p>Failed to load governance data</p>
            </div>
          ) : !hasData ? (
            <div className="text-center py-4 text-gray-500">
              <p>No DAO participation found</p>
            </div>
          ) : (
            <>
              <TabsContent value="delegators" className="mt-0">
                <div className="space-y-6">
                  {Object.entries(governances).map(([govId, gov]) => (
                    <div key={govId} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-blue-100 w-8 h-8 flex items-center justify-center">
                            <span className="font-medium text-blue-600">{gov.symbol.substring(0, 3)}</span>
                          </div>
                          <span className="font-medium">{gov.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {gov.symbol}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-500">Voting Power</p>
                          <p className="font-medium mt-1">
                            {parseFloat(formatEther(BigInt(gov.votingPower || "0"))).toFixed(4)} 
                            <span className="text-gray-400 text-xs ml-1">({gov.symbol})</span>
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-500">Received Delegations</p>
                          <p className="font-medium mt-1">
                            {gov.receivedDelegations} {gov.receivedDelegations === 1 ? 'address' : 'addresses'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="delegating" className="mt-0">
                <div className="py-6 text-center text-gray-500">
                  <p>No delegations found</p>
                </div>
              </TabsContent>
            </>
          )}
        </CardContent>
      </Tabs>
      <CardFooter className="bg-gray-50 py-2 px-6 flex justify-end">
        <div className="text-xs text-gray-500">
          Powered by <span className="font-medium">Tally</span>
        </div>
      </CardFooter>
    </Card>
  );
};
