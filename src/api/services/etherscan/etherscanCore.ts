
// Core Etherscan service functionality

// Get API key and URL from environment or use defaults
export const getEtherscanConfig = () => {
  const apiKey = "5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM";
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
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === '1') {
      return data.result;
    } else {
      console.warn('Etherscan API returned an error:', data.message);
      throw new Error(data.message || 'Unknown Etherscan API error');
    }
  } catch (error) {
    console.error('Error fetching from Etherscan:', error);
    throw error;
  }
}
