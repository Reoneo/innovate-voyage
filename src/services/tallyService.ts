
import { TallyData } from '@/types/tally';
import { tallyFetcher } from './tally/apiClient';
import { USER_GOVERNANCE_QUERY, GOVERNORS_QUERY } from './tally/queries';
import { processUserGovernanceData, processGovernorsData } from './tally/dataProcessor';

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

    console.log('Tally user data response:', userData);

    // Process user data if available
    const processedUserData = processUserGovernanceData(userData, walletAddress);
    if (processedUserData) {
      console.log('Successfully processed user data:', processedUserData);
      return processedUserData;
    }

    console.log('No user data found, trying to get general governors data');
    
    // If no user data, get popular governors for display
    const governorsData = await tallyFetcher({
      query: GOVERNORS_QUERY,
      variables: {
        first: 1,
        orderBy: "DELEGATED_VOTES_DESC"
      }
    });

    console.log('Governors data response:', governorsData);
    const processedGovernorsData = processGovernorsData(governorsData, walletAddress);
    console.log('Processed governors data:', processedGovernorsData);
    
    return processedGovernorsData;

  } catch (error) {
    console.error('Error fetching Tally data:', error);
    return null;
  }
}
