
import { useState, useEffect } from 'react';
import { useGitHubContributions } from '../useGitHubContributions';

export function useGitHubCalendar(username: string) {
  const {
    loading,
    error,
    tokenInvalid,
    stats,
    fetchGitHubContributions
  } = useGitHubContributions(username);
  const [totalContributions, setTotalContributions] = useState<number | null>(null);

  // Fetch GitHub contribution count directly from GitHub profile page
  useEffect(() => {
    if (username && !loading && !error) {
      const fetchContributions = async () => {
        try {
          const contributionData = await fetchGitHubContributions(username);
          if (contributionData && typeof contributionData.total === 'number') {
            setTotalContributions(contributionData.total);
            console.log(`Found ${contributionData.total} contributions for ${username}`);
          }
        } catch (err) {
          console.error('Error fetching GitHub contribution count:', err);
        }
      };
      
      fetchContributions();
    }
  }, [username, loading, error, fetchGitHubContributions]);

  return {
    loading,
    error,
    tokenInvalid,
    stats,
    totalContributions
  };
}
