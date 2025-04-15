
/**
 * Service for interacting with the Webacy API
 */

// API configuration
const API_BASE_URL = 'https://api.webacy.com';
const API_KEY_ID = 'eujjkt9ao5';
const API_KEY = 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb';

/**
 * Generate auth headers for Webacy API
 */
const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
    'x-api-key-id': API_KEY_ID
  };
};

/**
 * Fetch detailed address information
 */
export async function fetchAddressDetails(address: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/addresses/${address}`, 
      { headers: getHeaders() }
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching address details: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in fetchAddressDetails:', error);
    return null;
  }
}

/**
 * Fetch address approvals
 */
export async function fetchAddressApprovals(address: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/addresses/${address}/approvals`, 
      { headers: getHeaders() }
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching address approvals: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in fetchAddressApprovals:', error);
    return null;
  }
}

/**
 * Fetch quick wallet profile
 */
export async function fetchWalletProfile(address: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/quick-profile/${address}`, 
      { headers: getHeaders() }
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching wallet profile: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in fetchWalletProfile:', error);
    return null;
  }
}

/**
 * Fetch contract details
 */
export async function fetchContractDetails(contractAddress: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/contracts/${contractAddress}`, 
      { headers: getHeaders() }
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching contract details: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in fetchContractDetails:', error);
    return null;
  }
}

/**
 * Calculate wallet score based on various metrics
 * This combines data from multiple endpoints to create a comprehensive score
 */
export async function fetchWalletScore(address: string) {
  try {
    // Fetch profile data which includes a risk score
    const profileData = await fetchWalletProfile(address);
    
    // If we can't get profile data, we can't calculate a score
    if (!profileData) {
      return { score: null };
    }
    
    // Extract basic risk score metrics
    const riskScore = profileData.risk_score || 0;
    
    // Calculate a score on a scale of 0-100
    // Invert the risk score since lower risk means higher reputation
    const score = Math.max(0, Math.min(100, 100 - (riskScore * 100)));
    
    return {
      score: Math.round(score),
      profileData
    };
  } catch (error) {
    console.error('Error calculating wallet score:', error);
    return { score: null };
  }
}
