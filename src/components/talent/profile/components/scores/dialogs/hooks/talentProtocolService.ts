
import { TALENT_PROTOCOL_API_KEY, API_ENDPOINTS } from './constants';
import { TalentProtocolScores } from './types';

export const fetchTalentProtocolData = async (walletAddress: string) => {
  console.log('Fetching Talent Protocol data for:', walletAddress);
  
  let passportData = null;
  let talentData = null;

  // Try passport endpoints first
  for (const baseEndpoint of API_ENDPOINTS.slice(0, 3)) {
    try {
      const endpoint = `${baseEndpoint}/${walletAddress}`;
      console.log('Trying passport endpoint:', endpoint);
      
      const response = await fetch(endpoint, {
        headers: { 
          'X-API-KEY': TALENT_PROTOCOL_API_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success with passport endpoint:', endpoint, data);
        passportData = data;
        break;
      } else {
        console.log('Failed with status:', response.status, 'for endpoint:', endpoint);
      }
    } catch (error) {
      console.log('Error with endpoint:', baseEndpoint, error);
      continue;
    }
  }

  // Try talent endpoints if passport didn't work
  if (!passportData) {
    for (const baseEndpoint of API_ENDPOINTS.slice(3)) {
      try {
        const endpoint = `${baseEndpoint}/${walletAddress}`;
        console.log('Trying talent endpoint:', endpoint);
        
        const response = await fetch(endpoint, {
          headers: { 
            'X-API-KEY': TALENT_PROTOCOL_API_KEY,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Success with talent endpoint:', endpoint, data);
          talentData = data;
          break;
        } else {
          console.log('Failed with status:', response.status, 'for endpoint:', endpoint);
        }
      } catch (error) {
        console.log('Error with endpoint:', baseEndpoint, error);
        continue;
      }
    }
  }

  return { passportData, talentData };
};
