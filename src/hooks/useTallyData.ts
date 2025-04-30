
import { useState, useEffect } from 'react';

// Tally API Types
interface TallyDelegate {
  address: string;
  ensName?: string;
  votingPower: string;
  votingPowerPercentage: string;
}

interface TallyGovernance {
  name: string;
  symbol: string;
  delegates: TallyDelegate[];
  votingPower: string;
  receivedDelegations: number;
}

export interface TallyData {
  governances: Record<string, TallyGovernance>;
  loading: boolean;
  error: string | null;
}

const TALLY_API_KEY = "823049aef82691e85ae43e20d37e0d2f4b896dafdef53ea5dce0912d78bc1988";

/**
 * Hook to fetch delegation data from Tally.xyz
 */
export function useTallyData(address?: string) {
  const [data, setData] = useState<TallyData>({
    governances: {},
    loading: false,
    error: null
  });

  useEffect(() => {
    if (!address) return;

    const fetchTallyData = async () => {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        // Fetch governance tokens for the address
        const delegateResponse = await fetch(
          `https://api.tally.xyz/query?query=query{account(address:"${address}"){delegatesFor{address,governanceId,account{address,ensName},votingPower{value,valueUSD,percentage}}}}`,
          {
            headers: {
              'Api-key': TALLY_API_KEY
            }
          }
        );

        const delegateData = await delegateResponse.json();
        
        // Fetch governance metadata for any delegations
        const governanceIds = delegateData?.data?.account?.delegatesFor?.map(
          (d: any) => d.governanceId
        ) || [];
        
        const governances: Record<string, TallyGovernance> = {};
        
        // Process each governance token
        if (governanceIds.length > 0) {
          await Promise.all(
            governanceIds.map(async (govId: string) => {
              const govResponse = await fetch(
                `https://api.tally.xyz/query?query=query{governance(id:"${govId}"){name,tokenSymbol}}`,
                {
                  headers: {
                    'Api-key': TALLY_API_KEY
                  }
                }
              );
              
              const govData = await govResponse.json();
              
              const delegatesFor = delegateData?.data?.account?.delegatesFor || [];
              const relevantDelegate = delegatesFor.find(
                (d: any) => d.governanceId === govId
              );
              
              if (relevantDelegate && govData?.data?.governance) {
                governances[govId] = {
                  name: govData.data.governance.name,
                  symbol: govData.data.governance.tokenSymbol,
                  delegates: [], // We'll populate this later if needed
                  votingPower: relevantDelegate.votingPower.value,
                  receivedDelegations: 0 // Will be updated if there are delegations
                };
              }
            })
          );
        }
        
        // Fetch accounts that delegated to this address
        const delegatedToResponse = await fetch(
          `https://api.tally.xyz/query?query=query{account(address:"${address}"){delegatedTo{address,governanceId,account{address,ensName},votingPower{value,percentage}}}}`,
          {
            headers: {
              'Api-key': TALLY_API_KEY
            }
          }
        );
        
        const delegatedToData = await delegatedToResponse.json();
        const delegatedTo = delegatedToData?.data?.account?.delegatedTo || [];
        
        // Count delegations by governance
        delegatedTo.forEach((delegation: any) => {
          const govId = delegation.governanceId;
          if (governances[govId]) {
            governances[govId].receivedDelegations = 
              (governances[govId].receivedDelegations || 0) + 1;
          }
        });
        
        setData({
          governances,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching Tally data:', error);
        setData({
          governances: {},
          loading: false,
          error: 'Failed to fetch delegation data'
        });
      }
    };

    fetchTallyData();
  }, [address]);

  return data;
}
