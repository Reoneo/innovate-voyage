
import { TallyData } from '@/types/tally';

interface GraphQLResponse {
  data: any;
  errors?: Array<{
    message: string;
    locations: Array<{
      line: number;
      column: number;
    }>;
    path: Array<string | number>;
  }>;
}

/**
 * Fetch data from the Tally GraphQL API
 */
export const fetchTallyData = async (apiKey: string, walletAddress: string): Promise<TallyData | null> => {
  const API_URL = 'https://api.tally.xyz/query';
  
  try {
    // Get governance tokens owned by the wallet
    const governanceQuery = `
      query GovernorsByOwner($address: String!) {
        account(address: $address) {
          address
          governanceTokens {
            governanceToken {
              token {
                symbol
                name
                iconUrl
              }
              governor {
                id
                name
                governanceStrategy {
                  tokenVotingPower(address: $address)
                }
              }
            }
            balance
            votingWeight
            delegatesTo {
              address
            }
          }
        }
      }
    `;

    // Fetch governance token data
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        query: governanceQuery,
        variables: { address: walletAddress },
      }),
    });

    const governanceResult: GraphQLResponse = await response.json();
    
    if (governanceResult.errors) {
      console.error('Tally API Error:', governanceResult.errors);
      return null;
    }

    const account = governanceResult.data?.account;
    if (!account || !account.governanceTokens || account.governanceTokens.length === 0) {
      return null;
    }

    // Get primary governance token (first one with non-zero balance)
    const primaryToken = account.governanceTokens.find((token: any) => parseFloat(token.balance) > 0);
    if (!primaryToken) {
      return null;
    }

    // Query for recent votes by this address
    const votesQuery = `
      query VotesByAccount($address: String!) {
        account(address: $address) {
          votes(first: 5) {
            proposal {
              id
              title
            }
            choice
            timestamp
          }
        }
      }
    `;

    // Fetch vote history
    const votesResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        query: votesQuery,
        variables: { address: walletAddress },
      }),
    });

    const votesResult: GraphQLResponse = await votesResponse.json();
    const votes = votesResult.data?.account?.votes || [];

    // Structure the response data
    return {
      governorInfo: {
        id: primaryToken.governanceToken.governor.id,
        name: primaryToken.governanceToken.governor.name,
        symbol: primaryToken.governanceToken.token.symbol,
        iconUrl: primaryToken.governanceToken.token.iconUrl
      },
      votingInfo: {
        votingPower: primaryToken.governanceToken.governor.governanceStrategy?.tokenVotingPower || "0",
        votingPowerPercent: primaryToken.votingWeight ? `${(parseFloat(primaryToken.votingWeight) * 100).toFixed(4)}%` : "0%",
        delegatesTo: primaryToken.delegatesTo?.address || null,
        receivedDelegations: false, // Would need another query to determine this accurately
        recentVotes: votes.map((vote: any) => ({
          proposalId: vote.proposal.id,
          proposalTitle: vote.proposal.title,
          choice: vote.choice.toLowerCase(),
          timestamp: new Date(parseInt(vote.timestamp) * 1000)
        }))
      }
    };
  } catch (error) {
    console.error("Error fetching data from Tally:", error);
    return null;
  }
};
