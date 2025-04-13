
import { enforceRateLimit } from './web3/rateLimiter';

const WEBACY_API_KEY = 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb';
const WEBACY_API_BASE_URL = 'https://api.webacy.com';

/**
 * Fetches the security profile for a wallet address from Webacy
 * @param address Ethereum wallet address
 * @returns Security profile data
 */
export async function fetchWalletSecurityProfile(address: string) {
  // Only make request if we have a valid address
  if (!address || address.length < 30) {
    return null;
  }
  
  try {
    // Apply rate limiting to prevent excessive API calls
    await enforceRateLimit(300);
    
    // Call the Webacy API
    const response = await fetch(`${WEBACY_API_BASE_URL}/quick-profile/${address}`, {
      method: 'GET',
      headers: {
        'X-API-KEY': WEBACY_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`Webacy API error: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    console.log('Webacy security data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching Webacy security profile:', error);
    return null;
  }
}

/**
 * Get contract approvals for a wallet address
 * @param address Ethereum wallet address
 * @returns Contract approvals data
 */
export async function fetchWalletApprovals(address: string) {
  if (!address || address.length < 30) {
    return null;
  }
  
  try {
    await enforceRateLimit(300);
    
    const response = await fetch(`${WEBACY_API_BASE_URL}/addresses/${address}/approvals`, {
      method: 'GET',
      headers: {
        'X-API-KEY': WEBACY_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`Webacy API error: ${response.status} ${response.statusText}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Webacy approvals:', error);
    return null;
  }
}

/**
 * Calculates a security score based on Webacy data
 * @param securityData Security profile data
 * @returns Security score and risk level
 */
export function calculateSecurityScore(securityData: any) {
  if (!securityData) {
    return {
      score: 0,
      level: 'UNKNOWN',
      description: 'Unable to determine the security level of this wallet.'
    };
  }
  
  try {
    const { risk_level, risk_description } = securityData;
    console.log('Risk data:', risk_level, risk_description);
    
    // Map risk level to a numeric score
    let score = 0;
    let level = 'UNKNOWN';
    
    if (risk_level === 'LOW') {
      score = 85;
      level = 'LOW';
    } else if (risk_level === 'MEDIUM') {
      score = 50;
      level = 'MEDIUM';
    } else if (risk_level === 'HIGH') {
      score = 20;
      level = 'HIGH';
    } else if (risk_level === 'CRITICAL') {
      score = 5;
      level = 'CRITICAL';
    }
    
    return {
      score,
      level,
      description: risk_description || 'No security issues detected.'
    };
  } catch (error) {
    console.error('Error calculating security score:', error);
    return {
      score: 0,
      level: 'UNKNOWN',
      description: 'Unable to determine the security level of this wallet.'
    };
  }
}
