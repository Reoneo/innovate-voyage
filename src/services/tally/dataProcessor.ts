
import { TallyData } from '@/types/tally';

/**
 * Process user governance data from Tally API response
 */
export function processUserGovernanceData(userData: any, walletAddress: string): TallyData | null {
  console.log('Processing user governance data:', userData);
  
  const account = userData?.account;
  
  if (!account) {
    console.log('No account data found');
    return null;
  }

  const delegates = account.delegatesVotes || [];
  const votes = account.votes?.nodes || [];
  
  console.log('Delegates found:', delegates.length);
  console.log('Votes found:', votes.length);
  
  // Get the primary governance participation
  const primaryDelegate = delegates[0];
  
  if (!primaryDelegate) {
    console.log('No primary delegate found');
    return null;
  }

  const governor = primaryDelegate.governor;
  const delegateInfo = primaryDelegate.delegate;
  
  console.log('Governor info:', governor);
  console.log('Delegate info:', delegateInfo);
  
  // Process recent votes
  const recentVotes = votes.map((vote: any) => {
    return {
      proposalId: vote.proposal.id,
      proposalTitle: vote.proposal.title,
      choice: vote.support === 'FOR' ? 'for' as const : 
             vote.support === 'AGAINST' ? 'against' as const : 'abstain' as const,
      timestamp: vote.proposal.end?.timestamp ? 
                 new Date(vote.proposal.end.timestamp).getTime() : 
                 Date.now()
    };
  });

  console.log('Processed votes:', recentVotes);

  return {
    governorInfo: {
      id: governor.id,
      name: governor.name,
      symbol: governor.tokens?.[0]?.symbol || 'TOKEN',
      iconUrl: `https://assets.tally.xyz/governors/${governor.slug}/icon.svg`,
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
  console.log('Processing governors data:', governorsData);
  
  const governors = governorsData?.governors?.nodes || [];
  
  if (governors.length === 0) {
    console.log('No governors found');
    return null;
  }

  const governorNode = governors[0];
  console.log('Using governor:', governorNode);
  
  return {
    governorInfo: {
      id: governorNode.id,
      name: governorNode.name,
      symbol: governorNode.tokens?.[0]?.symbol || 'TOKEN',
      iconUrl: `https://assets.tally.xyz/governors/${governorNode.slug}/icon.svg`,
      totalSupply: governorNode.tokens?.[0]?.supply || '0'
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
