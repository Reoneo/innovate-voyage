
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Vote, Users, TrendingUp } from 'lucide-react';
import { useTallyData } from '@/hooks/useTallyData';

interface TallyDialogContentProps {
  walletAddress: string;
}

const TallyDialogContent: React.FC<TallyDialogContentProps> = ({ walletAddress }) => {
  const { tallyData, isLoading, error } = useTallyData(walletAddress);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">
          <Vote className="h-12 w-12 mx-auto mb-4 opacity-50" />
        </div>
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Governance Data</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Unable to fetch governance information from Tally.xyz
        </p>
        <p className="text-xs text-muted-foreground">
          This could be due to API rate limits or the wallet not participating in any DAOs.
        </p>
      </div>
    );
  }

  if (!tallyData) {
    return (
      <div className="text-center py-8">
        <Vote className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Governance Activity</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This wallet doesn't appear to have any governance activity on tracked DAOs.
        </p>
        <a 
          href="https://www.tally.xyz/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Explore DAOs on Tally <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* DAO Information */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <img 
            src={tallyData.governorInfo.iconUrl || "https://assets.tally.xyz/tally-logo.svg"} 
            alt={tallyData.governorInfo.name}
            className="h-10 w-10 rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://assets.tally.xyz/tally-logo.svg";
            }}
          />
          <div>
            <h3 className="font-bold text-lg">{tallyData.governorInfo.name}</h3>
            <p className="text-sm text-muted-foreground">{tallyData.governorInfo.symbol}</p>
          </div>
        </div>
        
        {tallyData.governorInfo.totalSupply && (
          <div className="text-xs text-muted-foreground">
            Total Supply: {tallyData.governorInfo.totalSupply}
          </div>
        )}
      </div>

      {/* Voting Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Voting Power</span>
          </div>
          <p className="text-2xl font-bold">{tallyData.votingInfo.votingPower || "0"}</p>
          {tallyData.votingInfo.votingPowerPercent && (
            <p className="text-xs text-muted-foreground">{tallyData.votingInfo.votingPowerPercent}</p>
          )}
        </div>
        
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Delegations</span>
          </div>
          <p className="text-2xl font-bold">
            {tallyData.votingInfo.receivedDelegations ? "Yes" : "None"}
          </p>
          {tallyData.votingInfo.receivedDelegations && (
            <p className="text-xs text-muted-foreground">{tallyData.votingInfo.receivedDelegations}</p>
          )}
        </div>
      </div>

      {/* Delegation Info */}
      {tallyData.votingInfo.delegatesTo && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-800 mb-2">Delegation</h4>
          <p className="text-sm text-amber-700">
            Delegated to: <span className="font-mono">{tallyData.votingInfo.delegatesTo}</span>
          </p>
        </div>
      )}

      {/* Recent Votes */}
      {tallyData.votingInfo.recentVotes && tallyData.votingInfo.recentVotes.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Vote className="h-4 w-4" />
            Recent Votes
          </h4>
          <div className="space-y-3">
            {tallyData.votingInfo.recentVotes.map((vote, index) => (
              <div key={`${vote.proposalId}-${index}`} className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-sm line-clamp-2">{vote.proposalTitle}</h5>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    vote.choice === 'for' ? 'bg-green-100 text-green-800' :
                    vote.choice === 'against' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {vote.choice.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Proposal #{vote.proposalId} • {new Date(vote.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tally Link */}
      <div className="pt-4 border-t">
        <a 
          href={`https://www.tally.xyz/profile/${walletAddress}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
        >
          View full profile on Tally <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default TallyDialogContent;
