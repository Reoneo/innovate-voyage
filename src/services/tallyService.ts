
import { TallyData } from '@/types/tally';

/**
 * Fetch data from Tally API for a specific wallet address
 * @param apiKey Tally API key
 * @param walletAddress Ethereum wallet address to query
 * @returns Promise with the formatted Tally data
 */
export async function fetchTallyData(apiKey: string, walletAddress: string): Promise<TallyData | null> {
  try {
    console.log(`Fetching real Tally data for address: ${walletAddress}`);
    
    // First, get the user's governors/DAOs
    const governorsResponse = await fetch('https://api.tally.xyz/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey
      },
      body: JSON.stringify({
        query: `
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
        `,
        variables: {
          input: {
            filters: {
              includeInactive: false
            },
            page: {
              limit: 10,
              offset: 0
            },
            sort: {
              isDescending: true,
              sortBy: "DELEGATED_VOTES"
            }
          }
        }
      })
    });

    if (!governorsResponse.ok) {
      console.error('Tally governors API error:', governorsResponse.status);
      return null;
    }

    const governorsData = await governorsResponse.json();
    console.log('Tally governors response:', governorsData);

    // Get the first governor to use for demo (in production, you'd want to check which DAOs the user participates in)
    const governors = governorsData.data?.governors?.nodes || [];
    if (governors.length === 0) {
      console.log('No governors found');
      return null;
    }

    const governor = governors[0]; // Use the first available governor
    
    // Now get voting data for this specific user and governor
    const votingResponse = await fetch('https://api.tally.xyz/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey
      },
      body: JSON.stringify({
        query: `
          query Account($input: AccountInput!) {
            account(input: $input) {
              address
              name
              bio
              picture
              governorDelegates(governorIds: ["${governor.id}"]) {
                governor {
                  id
                  name
                  slug
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
              votes(
                governorIds: ["${governor.id}"]
                pagination: { limit: 5, offset: 0 }
              ) {
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
        `,
        variables: {
          input: {
            address: walletAddress,
            governorId: governor.id
          }
        }
      })
    });

    if (!votingResponse.ok) {
      console.error('Tally voting API error:', votingResponse.status);
      // Return basic governor info even if we can't get voting data
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

    const votingData = await votingResponse.json();
    console.log('Tally voting response:', votingData);

    const account = votingData.data?.account;
    
    // Process the voting data
    const delegates = account?.governorDelegates || [];
    const votes = account?.votes?.nodes || [];
    
    // Get voting power from delegates data
    const delegateInfo = delegates.find(d => d.governor.id === governor.id);
    const votingPower = delegateInfo?.delegate?.votesCount || '0';
    
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
        delegatesTo: delegateInfo?.delegate?.account?.address || null,
        votingPower: votingPower.toString(),
        votingPowerPercent: '0%', // Would need additional calculation
        receivedDelegations: delegates.length > 0 ? `${delegates.length} delegation(s)` : null,
        recentVotes: recentVotes
      }
    };

  } catch (error) {
    console.error('Error fetching real Tally data:', error);
    return null;
  }
}
