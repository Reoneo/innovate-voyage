
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
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchTallyData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching Tally data for ${walletAddress}...`);
        
        const tallyKey = '823049aef82691e85ae43e20d37e0d2f4b896dafdef53ea5dce0912d78bc1988';
        const formattedAddress = formatToCAIP10(walletAddress);
        
        // Use proper GraphQL query format for Tally API
        const response = await fetch(`https://api.tally.xyz/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': tallyKey
          },
          body: JSON.stringify({
            query: `
              query GovernanceData($address: AccountID!) {
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
                    delegators {
                      account {
                        address
                      }
                      votingPower {
                        valueSimple
                        percentage
                      }
                    }
                    delegatees {
                      account {
                        address
                      }
                      votingPower {
                        valueSimple
                        percentage
                      }
                    }
                  }
                }
              }
            `,
            variables: {
              address: formattedAddress
            }
          }),
          cache: 'no-store' // Ensure no caching
        });

        if (!response.ok) {
          console.error('Tally API response not OK:', response.status, response.statusText);
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.errors) {
          console.error('GraphQL errors:', result.errors);
          throw new Error(result.errors[0].message || 'Error fetching from Tally API');
        }
        
        const accountData = result.data?.account;
        
        if (!accountData || !accountData.governances || accountData.governances.length === 0) {
          console.log('No governance data found for address:', walletAddress);
          setTallyData(null);
          setIsLoading(false);
          return;
        }
        
        // Use the first governance for now (can be expanded to handle multiple)
        const governance = accountData.governances[0];
        
        // Process delegators (people delegating to this wallet)
        const delegators = governance.delegators?.map(delegator => ({
          address: delegator.account.address,
          votingPower: `${delegator.votingPower.valueSimple} (${delegator.votingPower.percentage}%)`
        })) || [];
        
        // Process delegations (addresses this wallet is delegating to)
        const delegations = governance.delegatees?.map(delegatee => ({
          address: delegatee.account.address,
          votingPower: `${delegatee.votingPower.valueSimple} (${delegatee.votingPower.percentage}%)`
        })) || [];
        
        // Format the DAO data
        setTallyData({
          daoName: governance.governance.name,
          daoSymbol: governance.governance.tokens[0]?.symbol || 'DAO',
          daoIcon: governance.governance.tokens[0]?.logoUrl,
          votingPower: `${governance.votingPower.valueSimple} (${governance.votingPower.percentage}%)`,
          receivedDelegations: delegators.length > 0 ? `${delegators.length} addresses delegating` : 'No delegations',
          delegatingTo: delegations.length > 0 ? delegations[0].address : undefined,
          delegators: delegators.length > 0 ? delegators : undefined,
          delegations: delegations.length > 0 ? delegations : undefined
        });

        // Reset retry count on success
        setRetryCount(0);
        
      } catch (err) {
        console.error("Error fetching Tally data:", err);
        
        // Implement retry logic (max 3 retries)
        if (retryCount < 3) {
          console.log(`Retrying Tally data fetch (${retryCount + 1}/3)...`);
          setRetryCount(prev => prev + 1);
          setTimeout(() => fetchTallyData(), 1500); // Retry after 1.5 seconds
        } else {
          setError("Failed to fetch DAO data after multiple attempts");
          // Only show toast on final failure
          toast({
            title: "Error loading Tally data",
            description: "Failed to fetch DAO data from Tally",
            variant: "destructive"
          });
          setTallyData(null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTallyData();
    
  }, [walletAddress, retryCount, toast]); // Added retryCount to dependencies

  return { tallyData, isLoading, error };
}
