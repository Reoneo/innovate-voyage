
import { TallyData } from '@/types/tally';
import { tallyFetcher } from './tally/apiClient';
import { USER_GOVERNANCE_QUERY, USER_DELEGATE_QUERY, DELEGATES_QUERY } from './tally/queries';
import { processUserGovernanceData, processDelegateData, processGeneralDelegatesData } from './tally/dataProcessor';

/**
 * Fetch data from Tally API for a specific wallet address
 */
export async function fetchTallyData(apiKey: string, walletAddress: string): Promise<TallyData | null> {
  console.log(`🚀 Starting Tally data fetch for address: ${walletAddress}`);
  
  try {
    // Step 1: Try to get user account data
    console.log('👤 Step 1: Fetching user account data...');
    
    try {
      const userData = await tallyFetcher({
        query: USER_GOVERNANCE_QUERY,
        variables: { addresses: [walletAddress] }
      });

      console.log('👤 User account data received:', userData);
      
      if (userData && userData.accounts && userData.accounts.length > 0) {
        const processedUserData = processUserGovernanceData(userData, walletAddress);
        
        if (processedUserData) {
          console.log('✅ Successfully processed user account data:', processedUserData);
          return processedUserData;
        }
      }
    } catch (userDataError) {
      console.warn('⚠️ Step 1 failed - accounts query error:', userDataError);
    }

    // Step 2: Try to get delegatee data (who this user delegates to)
    console.log('🔄 Step 2: No account data found, trying delegatee data...');
    
    try {
      const delegateeData = await tallyFetcher({
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

      console.log('🔄 Delegatee data received:', delegateeData);
      
      if (delegateeData && delegateeData.delegatees && delegateeData.delegatees.nodes && delegateeData.delegatees.nodes.length > 0) {
        const processedDelegateeData = processDelegateData(delegateeData, walletAddress);
        
        if (processedDelegateeData) {
          console.log('✅ Successfully processed delegatee data:', processedDelegateeData);
          return processedDelegateeData;
        }
      }
    } catch (delegateeError) {
      console.warn('⚠️ Step 2 failed - delegatees query error:', delegateeError);
    }

    // Step 3: Get general delegates for fallback display
    console.log('📊 Step 3: No specific user data found, fetching general delegates...');
    
    try {
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

      console.log('📊 General delegates data received:', generalDelegatesData);
      
      if (generalDelegatesData && generalDelegatesData.delegates && generalDelegatesData.delegates.nodes && generalDelegatesData.delegates.nodes.length > 0) {
        const processedGeneralData = processGeneralDelegatesData(generalDelegatesData, walletAddress);
        
        if (processedGeneralData) {
          console.log('✅ Successfully processed general delegates data:', processedGeneralData);
          return processedGeneralData;
        }
      }
    } catch (generalError) {
      console.warn('⚠️ Step 3 failed - delegates query error:', generalError);
    }

    console.log('❌ No data could be processed from any API calls');
    return null;

  } catch (error) {
    console.error('💥 Error in fetchTallyData:', {
      error: error.message,
      stack: error.stack,
      walletAddress
    });
    return null;
  }
}
