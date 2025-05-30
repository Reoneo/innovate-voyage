
import { TallyData } from '@/types/tally';

/**
 * GraphQL query to get user's governance data
 */
const USER_GOVERNANCE_QUERY = `
  query UserGovernance($address: Address!) {
    user(address: $address) {
      address
      name
      bio
      picture
      governorDelegates {
        governor {
          id
          name
          slug
          timelockId
          tokens {
            id
            name
            symbol
            supply
          }
        }
        delegate {
          account {
            address
            name
          }
          votesCount
        }
        token {
          id
          name
          symbol
        }
      }
      votes(pagination: { limit: 5, offset: 0 }) {
        nodes {
          id
          support
          weight
          reason
          proposal {
            id
            title
            description
            status
            start {
              ... on Block {
                number
                timestamp
              }
            }
            end {
              ... on Block {
                number
                timestamp
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query to get popular governors/DAOs
 */
const GOVERNORS_QUERY = `
  query Governors($input: GovernorsInput!) {
    governors(input: $input) {
      nodes {
        id
        name
        slug
        tokens {
          id
          name
          symbol
          supply
        }
        delegatesVotesCount
        proposalsCount
        quorum
        timelockId
      }
    }
  }
`;

/**
 * Fetch data from Tally API using GraphQL
 */
async function tallyFetcher({ query, variables = {} }: { query: string; variables?: any }) {
  const response = await fetch('https://api.withtally.com/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': '823049aef82691e85ae43e20d37e0d2f4b896dafdef53ea5dce0912d78bc1988'
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  if (!response.ok) {
    throw new Error(`Tally API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    console.error('Tally GraphQL errors:', data.errors);
    throw new Error('GraphQL query failed');
  }

  return data.data;
}

/**
 * Fetch data from Tally API for a specific wallet address
 */
export async function fetchTallyData(apiKey: string, walletAddress: string): Promise<TallyData | null> {
  try {
    console.log(`Fetching Tally data for address: ${walletAddress}`);
    
    // First, try to get user-specific governance data
    const userData = await tallyFetcher({
      query: USER_GOVERNANCE_QUERY,
      variables: { address: walletAddress }
    });

    console.log('Tally user data:', userData);

    const user = userData?.user;
    
    if (!user) {
      console.log('No user data found, trying to get general governors data');
      
      // If no user data, get popular governors for display
      const governorsData = await tallyFetcher({
        query: GOVERNORS_QUERY,
        variables: {
          input: {
            filters: {
              includeInactive: false
            },
            page: {
              limit: 1,
              offset: 0
            },
            sort: {
              isDescending: true,
              sortBy: "DELEGATED_VOTES"
            }
          }
        }
      });

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

    // Process user governance data
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

  } catch (error) {
    console.error('Error fetching Tally data:', error);
    return null;
  }
}
