
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

interface TallyDelegator {
  address: string;
  votingPower: string;
}

interface TallyData {
  daoName: string;
  daoSymbol: string;
  daoIcon?: string;
  votingPower: string;
  receivedDelegations: string;
  delegatingTo?: string;
  delegators?: TallyDelegator[];
  delegations?: TallyDelegator[];
}

/**
 * Format an Ethereum address to CAIP-10 format as required by Tally API
 * @param address Ethereum address
 * @returns Formatted CAIP-10 ID (eip155:1:0x...)
 */
function formatToCAIP10(address: string): string {
  if (!address) return '';
  if (address.includes(':')) return address; // Already in CAIP-10 format
  if (address.startsWith('0x') && address.length === 42) {
    return `eip155:1:${address}`; // Add Ethereum mainnet prefix
  }
  return address; // Return as is if not a standard address
}

export function useTallyData(walletAddress?: string) {
  const [tallyData, setTallyData] = useState<TallyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  // Function to fetch data with better error handling
  const fetchTallyData = async (address: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const tallyKey = '823049aef82691e85ae43e20d37e0d2f4b896dafdef53ea5dce0912d78bc1988';
      const formattedAddress = formatToCAIP10(address);
      
      // Use a simpler GraphQL query focused on just the essential data
      const response = await fetch(`https://api.tally.xyz/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': tallyKey
        },
        body: JSON.stringify({
          query: `
            query AccountGovernance($address: AccountID!) {
              account(id: $address) {
                governances {
                  governance {
                    name
                    tokens {
                      symbol
                      logoUrl
                    }
                  }
                  votingPower {
                    valueSimple
                    percentage
                  }
                }
              }
            }
          `,
          variables: {
            address: formattedAddress
          }
        }),
        cache: 'no-store'
      });

      if (!response.ok) {
        console.error('Tally API response not OK:', response.status, response.statusText);
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        throw new Error(result.errors[0]?.message || 'Error fetching from Tally API');
      }
      
      const accountData = result.data?.account;
      
      if (!accountData || !accountData.governances || accountData.governances.length === 0) {
        console.log('No governance data found for address:', address);
        setTallyData(null);
        setIsLoading(false);
        return;
      }
      
      // Use the first governance for displaying basic info
      const governance = accountData.governances[0];
      
      // Format the basic DAO data without fetching delegations
      setTallyData({
        daoName: governance.governance.name || "DAO",
        daoSymbol: governance.governance.tokens?.[0]?.symbol || "DAO",
        daoIcon: governance.governance.tokens?.[0]?.logoUrl,
        votingPower: governance.votingPower ? 
          `${governance.votingPower.valueSimple} (${governance.votingPower.percentage}%)` : 
          "0",
        receivedDelegations: "N/A", // Simplified version doesn't fetch delegations
      });
    } catch (err) {
      console.error("Error fetching Tally data:", err);
      setError("Failed to fetch basic DAO data");
      
      // Only show toast on initial load, not on background retries
      if (retryCount === 0) {
        toast({
          title: "DAO data unavailable",
          description: "Could not fetch DAO participation data",
          variant: "destructive"
        });
      }
      
      setTallyData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch data when wallet address changes
  useEffect(() => {
    if (!walletAddress) return;
    
    fetchTallyData(walletAddress);

    // Setup automatic retry with exponential backoff if initial fetch fails
    const retryTimeout = setTimeout(() => {
      if (error && retryCount < 2) { // Limit to 2 retries
        console.log(`Retrying Tally data fetch (${retryCount + 1})...`);
        setRetryCount(prev => prev + 1);
        fetchTallyData(walletAddress);
      }
    }, Math.pow(2, retryCount) * 3000); // 3s, 6s, 12s

    return () => clearTimeout(retryTimeout);
  }, [walletAddress, error, retryCount, toast]);

  return { tallyData, isLoading, error };
}
