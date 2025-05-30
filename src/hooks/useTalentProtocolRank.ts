
import { useState, useEffect } from 'react';

interface TalentRankUser {
  passport_id: string;
  owner_address: string;
  score: number;
  rank: number;
  name?: string;
  ens_domain?: string;
}

export function useTalentProtocolRank(rank?: number) {
  const [user, setUser] = useState<TalentRankUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!rank || rank <= 0) {
      setUser(null);
      setError(null);
      return;
    }

    const fetchUserByRank = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching user with rank #${rank} from Talent Protocol`);
        
        // First, try to get the leaderboard data
        const response = await fetch(`https://api.talentprotocol.com/api/v2/passports?page=1&limit=100&sort_by=score&sort_order=desc`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.passports && Array.isArray(data.passports)) {
          // Find user by rank (rank is 1-based index)
          const targetUser = data.passports[rank - 1];
          
          if (targetUser) {
            // Try to resolve ENS domain for the user's address
            let ensDomain = null;
            try {
              console.log(`Attempting to resolve ENS for address: ${targetUser.owner_address}`);
              
              // Try to get ENS domain from the passport data first
              if (targetUser.name && targetUser.name.endsWith('.eth')) {
                ensDomain = targetUser.name;
              } else {
                // If no ENS in name, try reverse lookup via web3.bio
                const web3BioResponse = await fetch(`https://api.web3.bio/profile/${targetUser.owner_address}`);
                if (web3BioResponse.ok) {
                  const web3BioData = await web3BioResponse.json();
                  if (web3BioData && web3BioData.identity && web3BioData.identity.endsWith('.eth')) {
                    ensDomain = web3BioData.identity;
                  }
                }
              }
            } catch (ensError) {
              console.log('ENS resolution failed:', ensError);
            }

            setUser({
              passport_id: targetUser.passport_id,
              owner_address: targetUser.owner_address,
              score: targetUser.score,
              rank: rank,
              name: targetUser.name,
              ens_domain: ensDomain
            });
            
            console.log(`Rank #${rank} resolved to:`, {
              name: targetUser.name,
              address: targetUser.owner_address,
              ens_domain: ensDomain
            });
          } else {
            setError(`No user found at rank #${rank}`);
          }
        } else {
          setError('Invalid response format from Talent Protocol');
        }
      } catch (err) {
        console.error('Error fetching user by rank:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserByRank();
  }, [rank]);

  return { user, loading, error };
}
