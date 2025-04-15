
import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://api.ethfollow.xyz/api/v1';

interface EthFollowStats {
  followers_count?: string;
  following_count?: string;
}

interface EthFollowError {
  error: string;
}

export function useEthFollowStats(addressOrEns?: string) {
  const [stats, setStats] = useState<EthFollowStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!addressOrEns) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${API_BASE_URL}/users/${addressOrEns}/stats`);
        
        if (!response.ok) {
          throw new Error(`Error fetching EthFollow stats: ${response.status}`);
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching EthFollow stats:', err);
        setError(err instanceof Error ? err.message : 'Unknown error fetching EthFollow stats');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [addressOrEns]);

  return { stats, loading, error };
}

export function useEthFollowFollowers(addressOrEns?: string, limit: number = 10) {
  const [followers, setFollowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!addressOrEns) return;

    const fetchFollowers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${API_BASE_URL}/users/${addressOrEns}/followers?limit=${limit}`);
        
        if (!response.ok) {
          throw new Error(`Error fetching followers: ${response.status}`);
        }
        
        const data = await response.json();
        setFollowers(data.followers || []);
      } catch (err) {
        console.error('Error fetching followers:', err);
        setError(err instanceof Error ? err.message : 'Unknown error fetching followers');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFollowers();
  }, [addressOrEns, limit]);

  return { followers, loading, error };
}

export function useEthFollowFollowing(addressOrEns?: string, limit: number = 10) {
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!addressOrEns) return;

    const fetchFollowing = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${API_BASE_URL}/users/${addressOrEns}/following?limit=${limit}`);
        
        if (!response.ok) {
          throw new Error(`Error fetching following: ${response.status}`);
        }
        
        const data = await response.json();
        setFollowing(data.following || []);
      } catch (err) {
        console.error('Error fetching following:', err);
        setError(err instanceof Error ? err.message : 'Unknown error fetching following');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFollowing();
  }, [addressOrEns, limit]);

  return { following, loading, error };
}
