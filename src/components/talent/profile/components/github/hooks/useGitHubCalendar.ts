
import { useState, useEffect } from 'react';
import { useGitHubContributions } from '../useGitHubContributions';
import { useContributionStats } from './useContributionStats';

export function useGitHubCalendar(username: string) {
  const {
    loading,
    error,
    tokenInvalid,
    stats: baseStats,
    fetchGitHubContributions
  } = useGitHubContributions(username);
  const [totalContributions, setTotalContributions] = useState<number | null>(null);
  const [contributionData, setContributionData] = useState<any>(null);

  // Fetch GitHub contribution count directly from GitHub profile page
  useEffect(() => {
    if (username && !loading && !error) {
      const fetchContributions = async () => {
        try {
          const data = await fetchGitHubContributions(username);
          if (data && typeof data.total === 'number') {
            setTotalContributions(data.total);
            setContributionData(data);
            console.log(`Found ${data.total} contributions for ${username}`);
          }
        } catch (err) {
          console.error('Error fetching GitHub contribution count:', err);
        }
      };
      
      fetchContributions();
    }
  }, [username, loading, error, fetchGitHubContributions]);

  // Use the new hook for calculating statistics
  const stats = useContributionStats(username, {
    total: totalContributions ?? baseStats.total,
    data: contributionData
  });

  return {
    loading,
    error,
    tokenInvalid,
    stats,
    totalContributions
  };
}
