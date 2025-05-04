
import { useState, useEffect } from 'react';
import { useGitHubContributions } from '../useGitHubContributions';
import { useContributionStats } from './useContributionStats';

const CACHE_KEY_PREFIX = 'github_contributions_';
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

export function useGitHubCalendar(username: string) {
  const {
    loading: apiLoading,
    error: apiError,
    tokenInvalid,
    stats: baseStats,
    fetchGitHubContributions
  } = useGitHubContributions(username);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalContributions, setTotalContributions] = useState<number | null>(null);
  const [contributionData, setContributionData] = useState<any>(null);

  // Try to get data from cache first, then fetch from API if needed
  useEffect(() => {
    if (!username) return;
    
    const cacheKey = `${CACHE_KEY_PREFIX}${username}`;
    const fetchContributions = async () => {
      try {
        // Check cache first
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const isExpired = Date.now() - timestamp > CACHE_EXPIRY;
          
          if (!isExpired) {
            console.log(`Using cached GitHub data for ${username}`);
            setTotalContributions(data.totalContributions);
            setContributionData(data);
            setLoading(false);
            return;
          } else {
            console.log(`Cache expired for ${username}, fetching fresh data`);
          }
        }
        
        // No valid cache, fetch from API
        setLoading(true);
        
        // First try the API endpoint
        const apiUrl = `/api/github-contributions?username=${encodeURIComponent(username)}`;
        console.log(`Fetching GitHub contributions from API: ${apiUrl}`);
        
        try {
          const response = await fetch(apiUrl);
          if (response.ok) {
            const text = await response.text();
            try {
              const data = JSON.parse(text);
              if (data && typeof data.totalContributions === 'number') {
                console.log(`API returned ${data.totalContributions} contributions for ${username}`);
                setTotalContributions(data.totalContributions);
                setContributionData(data);
                
                // Cache the results
                localStorage.setItem(cacheKey, JSON.stringify({
                  data,
                  timestamp: Date.now()
                }));
                
                setLoading(false);
                return;
              }
            } catch (jsonError) {
              console.error('Error parsing JSON response:', jsonError);
            }
          }
        } catch (fetchError) {
          console.error('Error fetching from API:', fetchError);
        }
        
        // If API fails, try direct GitHub scraping
        console.log('API fetch failed, trying direct GitHub scraping');
        const data = await fetchGitHubContributions(username);
        if (data && typeof data.total === 'number') {
          setTotalContributions(data.total);
          setContributionData(data);
          
          // Cache the results
          localStorage.setItem(cacheKey, JSON.stringify({
            data: { ...data, totalContributions: data.total },
            timestamp: Date.now()
          }));
          
          console.log(`Found ${data.total} contributions for ${username}`);
        }
      } catch (err) {
        console.error('Error fetching GitHub contribution count:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    // Add a timeout to show error if taking too long
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('GitHub data fetch is taking too long, showing error');
        setError(new Error('GitHub data fetch timeout'));
        setLoading(false);
      }
    }, 10000); // 10 seconds timeout
    
    fetchContributions();
    return () => clearTimeout(timeoutId);
  }, [username, fetchGitHubContributions]);

  // Use the hook for calculating statistics
  const stats = useContributionStats(username, {
    total: totalContributions ?? baseStats.total,
    data: contributionData
  });

  return {
    loading: apiLoading || loading,
    error: apiError || error,
    tokenInvalid,
    stats,
    totalContributions
  };
}
