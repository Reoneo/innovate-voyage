
import { useState, useEffect } from 'react';

interface TalentRankUser {
  passport_id: string;
  owner_address: string;
  score: number;
  rank: number;
  name?: string;
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
            setUser({
              passport_id: targetUser.passport_id,
              owner_address: targetUser.owner_address,
              score: targetUser.score,
              rank: rank,
              name: targetUser.name
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
