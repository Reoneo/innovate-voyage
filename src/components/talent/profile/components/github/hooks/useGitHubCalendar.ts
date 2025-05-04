
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

  // Fetch GitHub contribution count directly from API
  useEffect(() => {
    if (username && !loading && !error) {
      const fetchContributions = async () => {
        try {
          // First try the API endpoint
          const apiUrl = `/api/github-contributions?username=${encodeURIComponent(username)}`;
          console.log(`Fetching GitHub contributions from API: ${apiUrl}`);
          
          const response = await fetch(apiUrl);
          if (response.ok) {
            const data = await response.json();
            if (data && typeof data.totalContributions === 'number') {
              console.log(`API returned ${data.totalContributions} contributions for ${username}`);
              setTotalContributions(data.totalContributions);
              setContributionData(data);
              return;
            }
          }
          
          // Fallback to direct GitHub scraping
          console.log('API fetch failed, trying direct GitHub scraping');
          const data = await fetchGitHubContributions(username);
          if (data && typeof data.total === 'number') {
            setTotalContributions(data.total);
            setContributionData(data);
            console.log(`Found ${data.total} contributions for ${username}`);
          }
        } catch (err) {
          console.error('Error fetching GitHub contribution count:', err);
          // Try direct scraping as last resort
          try {
            const data = await fetchGitHubContributions(username);
            if (data && typeof data.total === 'number') {
              setTotalContributions(data.total);
              setContributionData(data);
            }
          } catch (fallbackErr) {
            console.error('Fallback fetch also failed:', fallbackErr);
          }
        }
      };
      
      fetchContributions();
    }
  }, [username, loading, error, fetchGitHubContributions]);

  // Use the hook for calculating statistics
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
