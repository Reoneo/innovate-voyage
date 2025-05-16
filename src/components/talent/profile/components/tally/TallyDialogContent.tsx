
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useTallyData } from '@/hooks/useTallyData';
import { TallyData } from '@/types/tally';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronRight, Users, Vote } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TallyDialogContentProps {
  walletAddress: string;
}

const TallyDialogContent: React.FC<TallyDialogContentProps> = ({ walletAddress }) => {
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

  if (!tallyData) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <img 
          src="https://assets.tally.xyz/tally-logo.svg" 
          alt="Tally" 
          className="h-20 w-20 mb-4 opacity-50"
        />
        <p className="text-gray-500 font-medium">No governance data found</p>
        <p className="text-gray-500 text-sm mt-2">
          This wallet isn't participating in any DAOs tracked by Tally
        </p>
      </div>
    );
  }

  const { governorInfo, votingInfo } = tallyData;

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <img 
          src={governorInfo.iconUrl || "https://assets.tally.xyz/tally-logo.svg"} 
          alt={governorInfo.name || "Tally"} 
          className="h-16 w-16 rounded-md"
        />
        <div>
          <h3 className="text-xl font-bold">{governorInfo.name}</h3>
          <div className="flex items-center mt-1">
            <Badge variant="outline" className="mr-2">{governorInfo.symbol}</Badge>
            <span className="text-sm text-muted-foreground">
              {votingInfo.votingPowerPercent && `${votingInfo.votingPowerPercent} of supply`}
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="voting">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="voting">Voting Power</TabsTrigger>
          <TabsTrigger value="proposals">Recent Votes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="voting" className="mt-4 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Vote className="h-4 w-4 mr-2 text-purple-500" />
              <h4 className="font-medium text-gray-700">Voting Power</h4>
            </div>
            <p className="text-xl font-bold">{votingInfo.votingPower || "0"}</p>
            <p className="text-sm text-gray-500 mt-1">{votingInfo.votingPowerPercent || "0%"} of total supply</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Users className="h-4 w-4 mr-2 text-purple-500" />
              <h4 className="font-medium text-gray-700">Received Delegations</h4>
            </div>
            <p className="text-lg">{votingInfo.receivedDelegations || "None"}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <h4 className="font-medium text-gray-700">Delegating To</h4>
            </div>
            {votingInfo.delegatesTo ? (
              <div className="flex items-center justify-between">
                <p>{votingInfo.delegatesTo}</p>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            ) : (
              <p className="text-gray-500">Self-delegated</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="proposals" className="mt-4">
          {votingInfo.recentVotes && votingInfo.recentVotes.length > 0 ? (
            <div className="space-y-4">
              {votingInfo.recentVotes.map((vote, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <Badge 
                      variant="outline" 
                      className={vote.choice === 'for' ? 'bg-green-100 text-green-800' : 
                        vote.choice === 'against' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'}
                    >
                      {vote.choice.toUpperCase()}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(vote.timestamp, { addSuffix: true })}
                    </div>
                  </div>
                  <p className="font-medium mt-2">{vote.proposalTitle}</p>
                  <p className="text-xs text-gray-500 mt-1">Proposal #{vote.proposalId}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No recent votes found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-6">
        <a 
          href={`https://www.tally.xyz/gov/${governorInfo.id}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-purple-500 hover:text-purple-700 text-sm flex items-center"
        >
          View on Tally.xyz 
          <ChevronRight className="h-4 w-4 ml-1" />
        </a>
      </div>
    </div>
  );
};

export default TallyDialogContent;
