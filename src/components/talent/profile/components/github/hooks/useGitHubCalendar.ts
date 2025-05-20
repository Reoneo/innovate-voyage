
import { useState, useEffect, useRef } from 'react';
import { useGitHubContributions } from '../useGitHubContributions';
import { useContributionStats } from './useContributionStats';

export function useGitHubCalendar(username: string) {
  const {
    loading: baseLoading,
    error,
    tokenInvalid,
    stats: baseStats,
    fetchGitHubContributions
  } = useGitHubContributions(username);
  const [totalContributions, setTotalContributions] = useState<number | null>(null);
  const [contributionData, setContributionData] = useState<any>(null);
  const fetchAttempted = useRef<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Use cached data if available for immediate display
  useEffect(() => {
    if (!username) return;
    
    // Set initial loading state
    setLoading(true);
    
    // Try to get cached data first for immediate display
    const cachedData = localStorage.getItem(`github_contributions_${username}`);
    const cachedTimestamp = localStorage.getItem(`github_contributions_${username}_timestamp`);
    
    if (cachedData && cachedTimestamp) {
      const parsedData = JSON.parse(cachedData);
      const timestamp = parseInt(cachedTimestamp);
      
      // Use cached data if it's less than 6 hours old
      if (Date.now() - timestamp < 6 * 60 * 60 * 1000) {
        console.log('Using cached GitHub data for', username);
        setTotalContributions(parsedData.totalContributions);
        setContributionData(parsedData);
        setLoading(false);
      }
    }
  }, [username]);

  // Fetch GitHub contribution count directly from API
  useEffect(() => {
    if (!username || fetchAttempted.current) return;
    
    fetchAttempted.current = true;
    
    const fetchContributions = async () => {
      try {
        // First try the API endpoint with a shorter timeout (3s instead of 5s)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); 
        
        const apiUrl = `/api/github-contributions?username=${encodeURIComponent(username)}`;
        
        try {
          const response = await fetch(apiUrl, { signal: controller.signal });
          clearTimeout(timeoutId);
          
          if (response.ok) {
            // Handle potential JSON parsing errors
            const text = await response.text();
            try {
              const data = JSON.parse(text);
              if (data && typeof data.totalContributions === 'number') {
                setTotalContributions(data.totalContributions);
                setContributionData(data);
                setLoading(false);
                
                // Cache the results
                localStorage.setItem(`github_contributions_${username}`, JSON.stringify(data));
                localStorage.setItem(`github_contributions_${username}_timestamp`, Date.now().toString());
                
                return;
              }
            } catch (jsonError) {
              console.error('Error parsing JSON response:', jsonError);
              // Continue to fallback
            }
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          // Continue to fallback if it's not an abort error
          if (fetchError.name !== 'AbortError') {
            console.error('Error fetching from API:', fetchError);
          } else {
            console.log('API fetch timed out, using fallback');
          }
        }
        
        // Fallback to direct GitHub scraping with a shorter timeout
        console.log('API fetch failed, trying direct GitHub scraping');
        const data = await fetchGitHubContributions(username);
        if (data && typeof data.total === 'number') {
          setTotalContributions(data.total);
          setContributionData(data);
          setLoading(false);
          
          // Cache the fallback results
          localStorage.setItem(`github_contributions_${username}`, JSON.stringify({
            totalContributions: data.total,
            ...data
          }));
          localStorage.setItem(`github_contributions_${username}_timestamp`, Date.now().toString());
        } else {
          // Even if we don't get data, stop loading after 3 seconds
          setTimeout(() => setLoading(false), 3000);
        }
      } catch (err) {
        console.error('Error fetching GitHub contribution count:', err);
        setLoading(false);
      }
    };
    
    fetchContributions();
  }, [username, fetchGitHubContributions]);

  // Use the hook for calculating statistics
  const stats = useContributionStats(username, {
    total: totalContributions ?? baseStats.total,
    data: contributionData
  });

  return {
    loading: loading && baseLoading, // Only show loading if both are loading
    error,
    tokenInvalid,
    stats,
    totalContributions
  };
}
