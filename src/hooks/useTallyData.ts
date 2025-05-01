
import { useState, useEffect } from 'react';

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

export function useTallyData(walletAddress?: string) {
  const [tallyData, setTallyData] = useState<TallyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchTallyData = async () => {
      setIsLoading(true);
      setError(null);
      setTallyData(null); // Reset data when wallet changes
      
      try {
        // Using the API key for Tally
        const tallyKey = '823049aef82691e85ae43e20d37e0d2f4b896dafdef53ea5dce0912d78bc1988';
        
        // Fetch governance data from Tally API
        const response = await fetch(`https://api.tally.xyz/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': tallyKey
          },
          body: JSON.stringify({
            query: `
              query AccountData($address: AccountID!) {
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
                      value
                      valueSimple
                      percentage
                    }
                    delegators {
                      account {
                        address
                      }
                      votingPower {
                        value
                        valueSimple
                        percentage
                      }
                    }
                    delegatees {
                      account {
                        address
                      }
                      votingPower {
                        value
                        valueSimple
                        percentage
                      }
                    }
                  }
                }
              }
            `,
            variables: {
              address: walletAddress
            }
          })
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message || 'Error fetching from Tally API');
        }
        
        const accountData = result.data?.account;
        
        if (!accountData || !accountData.governances || accountData.governances.length === 0) {
          // No governance data found
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
      } catch (err) {
        console.error("Error fetching Tally data:", err);
        setError("Failed to fetch DAO data from Tally");
        setTallyData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTallyData();
    
  }, [walletAddress]); // Refresh when wallet address changes

  return { tallyData, isLoading, error };
}
