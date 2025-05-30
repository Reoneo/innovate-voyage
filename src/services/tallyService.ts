
import { TallyData } from '@/types/tally';
import { tallyFetcher } from './tally/apiClient';
import { USER_GOVERNANCE_QUERY, USER_DELEGATE_QUERY, DELEGATES_QUERY } from './tally/queries';
import { processUserGovernanceData, processDelegateData, processGeneralDelegatesData } from './tally/dataProcessor';

/**
 * Fetch data from Tally API for a specific wallet address
 */
export async function fetchTallyData(apiKey: string, walletAddress: string): Promise<TallyData | null> {
  try {
    console.log(`Fetching Tally data for address: ${walletAddress}`);
    
    // First, try to get user account data
    const userData = await tallyFetcher({
      query: USER_GOVERNANCE_QUERY,
      variables: { addresses: [walletAddress] }
    });

    console.log('Tally user data response:', userData);

    // Process user data if available
    const processedUserData = processUserGovernanceData(userData, walletAddress);
    if (processedUserData) {
      console.log('Successfully processed user data:', processedUserData);
      return processedUserData;
    }

    console.log('No user account data found, trying to get delegation data');
    
    // Try to get delegation data
    try {
      const delegateData = await tallyFetcher({
        query: USER_DELEGATE_QUERY,
        variables: {
          input: {
            filters: {
              delegator: walletAddress
            },
            page: {
              limit: 5
            }
          }
        }
      });

      console.log('Delegate data response:', delegateData);
      const processedDelegateData = processDelegateData(delegateData, walletAddress);
      if (processedDelegateData) {
        console.log('Successfully processed delegate data:', processedDelegateData);
        return processedDelegateData;
      }
    } catch (delegateError) {
      console.log('Could not fetch delegate data:', delegateError);
    }

    console.log('No delegation data found, trying to get general delegates data');
    
    // If no specific data, get general delegates for display
    const generalDelegatesData = await tallyFetcher({
      query: DELEGATES_QUERY,
      variables: {
        input: {
          filters: {},
          page: {
            limit: 1
          },
          sort: {
            field: "VOTES_COUNT",
            order: "DESC"
          }
        }
      }
    });

    console.log('General delegates data response:', generalDelegatesData);
    const processedGeneralData = processGeneralDelegatesData(generalDelegatesData, walletAddress);
    console.log('Processed general delegates data:', processedGeneralData);
    
    return processedGeneralData;

  } catch (error) {
    console.error('Error fetching Tally data:', error);
    return null;
  }
}
