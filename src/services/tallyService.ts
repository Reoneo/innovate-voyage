
import { TallyData } from '@/types/tally';

/**
 * Fetch data from Tally API for a specific wallet address
 * @param apiKey Tally API key
 * @param walletAddress Ethereum wallet address to query
 * @returns Promise with the formatted Tally data
 */
export async function fetchTallyData(apiKey: string, walletAddress: string): Promise<TallyData | null> {
  try {
    // Base URL for Tally API
    const baseUrl = 'https://api.tally.xyz';
    
    // First, get the governance tokens that the address holds
    const governanceEndpoint = `/users/${walletAddress}/governance-tokens`;
    const governanceUrl = `${baseUrl}${governanceEndpoint}`;
    
    const headers = {
      'Accept': 'application/json',
      'Api-Key': apiKey
    };
    
    // Fetch governance tokens
    const governanceResponse = await fetch(governanceUrl, { headers });
    
    if (!governanceResponse.ok) {
      throw new Error(`Tally API returned ${governanceResponse.status}: ${await governanceResponse.text()}`);
    }
    
    const governanceData = await governanceResponse.json();
    
    // If no governance tokens found, return null
    if (!governanceData.data || governanceData.data.length === 0) {
      console.log('No governance tokens found for address:', walletAddress);
      return null;
    }
    
    // Take the first governance token for demonstration (in a real app, you might want to handle multiple tokens)
    const firstToken = governanceData.data[0];
    const governorId = firstToken.governorId;
    
    // Next, get voting power information
    const votingPowerEndpoint = `/governors/${governorId}/voters/${walletAddress}`;
    const votingPowerUrl = `${baseUrl}${votingPowerEndpoint}`;
    
    const votingPowerResponse = await fetch(votingPowerUrl, { headers });
    
    if (!votingPowerResponse.ok) {
      throw new Error(`Tally API returned ${votingPowerResponse.status}: ${await votingPowerResponse.text()}`);
    }
    
    const votingPowerData = await votingPowerResponse.json();
    
    // Fetch recent votes from this user
    const votesEndpoint = `/governors/${governorId}/voters/${walletAddress}/votes`;
    const votesUrl = `${baseUrl}${votesEndpoint}`;
    
    const votesResponse = await fetch(votesUrl, { headers });
    let recentVotes = [];
    
    if (votesResponse.ok) {
      const votesData = await votesResponse.json();
      recentVotes = votesData.data ? votesData.data.map((vote: any) => ({
        proposalId: vote.proposalId,
        proposalTitle: vote.proposal?.title || 'Untitled Proposal',
        choice: vote.support === 1 ? 'for' : vote.support === 0 ? 'against' : 'abstain',
        timestamp: new Date(vote.createdAt).getTime()
      })) : [];
    }
    
    // Get governor details
    const governorDetailsEndpoint = `/governors/${governorId}`;
    const governorDetailsUrl = `${baseUrl}${governorDetailsEndpoint}`;
    
    const governorDetailsResponse = await fetch(governorDetailsUrl, { headers });
    
    if (!governorDetailsResponse.ok) {
      throw new Error(`Tally API returned ${governorDetailsResponse.status}: ${await governorDetailsResponse.text()}`);
    }
    
    const governorDetails = await governorDetailsResponse.json();
    
    // Format the data according to our TallyData type
    return {
      governorInfo: {
        id: governorId,
        name: governorDetails.data.name || 'Unknown DAO',
        symbol: firstToken.token?.symbol || 'UNKNOWN',
        iconUrl: governorDetails.data.iconUrl || firstToken.token?.logoUrl,
        totalSupply: firstToken.token?.totalSupply ? parseFloat(firstToken.token.totalSupply).toLocaleString() : undefined
      },
      votingInfo: {
        address: walletAddress,
        delegatesTo: votingPowerData.data?.delegatesTo || null,
        votingPower: votingPowerData.data?.votingPower ? parseFloat(votingPowerData.data.votingPower).toFixed(2) : '0',
        votingPowerPercent: votingPowerData.data?.votingPowerPercent ? `${(parseFloat(votingPowerData.data.votingPowerPercent) * 100).toFixed(2)}%` : '0%',
        receivedDelegations: votingPowerData.data?.numOfDelegators ? `${votingPowerData.data.numOfDelegators} addresses delegating` : undefined,
        recentVotes
      }
    };
  } catch (error) {
    console.error('Error fetching Tally data:', error);
    return null;
  }
}
