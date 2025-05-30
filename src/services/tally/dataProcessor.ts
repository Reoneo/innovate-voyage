
import { TallyData } from '@/types/tally';

/**
 * Process user governance data from Tally API response
 */
export function processUserGovernanceData(userData: any, walletAddress: string): TallyData | null {
  const user = userData?.user;
  
  if (!user) {
    return null;
  }

  const delegates = user.governorDelegates || [];
  const votes = user.votes?.nodes || [];
  
  // Get the primary governance participation
  const primaryDelegate = delegates[0];
  
  if (!primaryDelegate) {
    return null;
  }

  const governor = primaryDelegate.governor;
  const delegateInfo = primaryDelegate.delegate;
  
  // Process recent votes
  const recentVotes = votes.map(vote => ({
    proposalId: vote.proposal.id,
    proposalTitle: vote.proposal.title,
    choice: vote.support === 'FOR' ? 'for' as const : 
           vote.support === 'AGAINST' ? 'against' as const : 'abstain' as const,
    timestamp: vote.proposal.end?.timestamp ? 
               new Date(vote.proposal.end.timestamp).getTime() : 
               Date.now()
  }));

  return {
    governorInfo: {
      id: governor.id,
      name: governor.name,
      symbol: governor.tokens?.[0]?.symbol || 'TOKEN',
      iconUrl: `https://assets.tally.xyz/${governor.slug}/icon.png`,
      totalSupply: governor.tokens?.[0]?.supply || '0'
    },
    votingInfo: {
      address: walletAddress,
      delegatesTo: delegateInfo?.account?.address || null,
      votingPower: delegateInfo?.votesCount?.toString() || '0',
      votingPowerPercent: '0%', // Would need additional calculation
      receivedDelegations: delegates.length > 0 ? `${delegates.length} delegation(s)` : null,
      recentVotes: recentVotes
    }
  };
}

/**
 * Process governors data when no user data is available
 */
export function processGovernorsData(governorsData: any, walletAddress: string): TallyData | null {
  const governors = governorsData?.governors?.nodes || [];
  
  if (governors.length === 0) {
    return null;
  }

  const governor = governors[0];
  
  return {
    governorInfo: {
      id: governor.id,
      name: governor.name,
      symbol: governor.tokens?.[0]?.symbol || 'TOKEN',
      iconUrl: `https://assets.tally.xyz/${governor.slug}/icon.png`,
      totalSupply: governor.tokens?.[0]?.supply || '0'
    },
    votingInfo: {
      address: walletAddress,
      delegatesTo: null,
      votingPower: '0',
      votingPowerPercent: '0%',
      receivedDelegations: null,
      recentVotes: []
    }
  };
}
