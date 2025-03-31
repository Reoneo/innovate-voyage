
// Core Etherscan service functionality

// Get API key and URL from environment or use defaults
export const getEtherscanConfig = () => {
  const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY || "5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM";
  const apiUrl = import.meta.env.VITE_ETHERSCAN_API_URL || 'https://api.etherscan.io/api';
  return { apiKey, apiUrl };
};

// Generic fetch function for Etherscan API
export async function fetchFromEtherscan(endpoint: string, params: Record<string, string>): Promise<any> {
  try {
    const { apiKey, apiUrl } = getEtherscanConfig();
    
    // Construct the URL with parameters
    const queryParams = new URLSearchParams({
      ...params,
      apikey: apiKey
    });
    
    const url = `${apiUrl}?${queryParams.toString()}`;
    console.log(`Sending request to Etherscan: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if the API returned an error message
    if (data.status === '0') {
      console.warn('Etherscan API returned an error:', data.message);
      
      // If the error is due to empty results and not an API error
      if (data.message === 'No transactions found' || 
          data.message.includes('No transactions found') ||
          data.message === 'No records found') {
        return []; // Return empty array for "no data" responses
      }
      
      throw new Error(data.message || 'Unknown Etherscan API error');
    }
    
    return data.result;
  } catch (error) {
    console.error('Error fetching from Etherscan:', error);
    throw error;
  }
}

// Check if the result indicates a real error vs just "no data"
export function isEmptyResultError(error: any): boolean {
  if (!error) return false;
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  return errorMessage.includes('No transactions found') || 
         errorMessage.includes('No records found') ||
         errorMessage === 'Result is empty';
}
