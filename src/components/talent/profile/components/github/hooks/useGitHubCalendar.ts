
import { useState, useEffect, useCallback } from 'react';
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

  // Fetch GitHub contribution count directly from API or cache
  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchContributions = useCallback(async () => {
    try {
      // Try to get from localStorage cache first
      const cacheKey = `github-contrib-${username}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          const cacheAge = Date.now() - (parsedData.timestamp || 0);
          
          // Use cache if it's less than 1 hour old
          if (cacheAge < 3600000 && parsedData.totalContributions) {
            console.log(`Using cached GitHub data for ${username}`);
            setTotalContributions(parsedData.totalContributions);
            setContributionData(parsedData);
            return;
          }
        } catch (e) {
          console.error('Error parsing cached GitHub data:', e);
          // Continue to fetch if cache is invalid
        }
      }

      // Try the API endpoint
      const apiUrl = `/api/github-contributions?username=${encodeURIComponent(username)}`;
      console.log(`Fetching GitHub contributions from API: ${apiUrl}`);
      
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          // Handle potential JSON parsing errors
          const text = await response.text();
          let data;
          try {
            data = JSON.parse(text);
            if (data && typeof data.totalContributions === 'number') {
              console.log(`API returned ${data.totalContributions} contributions for ${username}`);
              
              // Store in cache with timestamp
              const cacheData = {
                ...data,
                timestamp: Date.now()
              };
              localStorage.setItem(cacheKey, JSON.stringify(cacheData));
              
              setTotalContributions(data.totalContributions);
              setContributionData(data);
              return;
            }
          } catch (jsonError) {
            console.error('Error parsing JSON response:', jsonError);
            // Continue to fallback
          }
        }
      } catch (fetchError) {
        console.error('Error fetching from API:', fetchError);
        // Continue to fallback
      }
      
      // Fallback to direct GitHub scraping
      console.log('API fetch failed, trying direct GitHub scraping');
      const data = await fetchGitHubContributions(username);
      if (data && typeof data.total === 'number') {
        // Store in cache with timestamp
        const cacheData = {
          total: data.total,
          timestamp: Date.now()
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        
        setTotalContributions(data.total);
        setContributionData(data);
        console.log(`Found ${data.total} contributions for ${username}`);
      }
    } catch (err) {
      console.error('Error fetching GitHub contribution count:', err);
    }
  }, [username, fetchGitHubContributions]);

  // Fetch GitHub contributions when the component mounts
  useEffect(() => {
    if (username && !loading && !error) {
      fetchContributions();
    }
  }, [username, loading, error, fetchContributions]);

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
