
import { TallyData } from '@/types/tally';

/**
 * Fetch data from Tally API for a specific wallet address
 * @param apiKey Tally API key
 * @param walletAddress Ethereum wallet address to query
 * @returns Promise with the formatted Tally data
 */
export async function fetchTallyData(apiKey: string, walletAddress: string): Promise<TallyData | null> {
  try {
    // For now, we're returning mock data since we don't have a fully implemented API integration
    // In a production environment, this would make actual API calls to Tally
    
    console.log(`Fetching Tally data for address: ${walletAddress} with API key: ${apiKey}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      governorInfo: {
        id: '0x123456789abcdef',
        name: 'ENS',
        symbol: 'ENS',
        iconUrl: 'https://raw.githubusercontent.com/ensdomains/media/master/icons/ENS.png',
        totalSupply: '42,069,420'
      },
      votingInfo: {
        address: walletAddress,
        delegatesTo: null,
        votingPower: '138.75',
        votingPowerPercent: '0.12%',
        receivedDelegations: '2 addresses delegating',
        recentVotes: [
          {
            proposalId: '15',
            proposalTitle: 'EP-3.1: ENS Permanent Registrar Third Price Extension',
            choice: 'for',
            timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3 // 3 days ago
          },
          {
            proposalId: '14',
            proposalTitle: 'EP-2.12: Enhance DAO Operations Tooling',
            choice: 'against',
            timestamp: Date.now() - 1000 * 60 * 60 * 24 * 12 // 12 days ago
          }
        ]
      }
    };
  } catch (error) {
    console.error('Error fetching Tally data:', error);
    return null;
  }
}
