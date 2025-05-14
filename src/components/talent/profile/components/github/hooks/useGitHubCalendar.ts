
import { useState, useEffect, useRef } from 'react';
import { useGitHubContributions } from '../useGitHubContributions';

export function useGitHubCalendar(username: string) {
  const {
    loading,
    error,
    tokenInvalid,
    stats: baseStats,
    totalContributions,
    fetchGitHubContributions
  } = useGitHubContributions(username);
  const [contributionData, setContributionData] = useState<any>(null);
  const fetchAttempted = useRef<boolean>(false);

  // Use cached data if available for immediate display
  useEffect(() => {
    if (!username) return;
    
    // Try to get cached data first for immediate display
    const cachedData = localStorage.getItem(`github_contributions_${username}`);
    const cachedTimestamp = localStorage.getItem(`github_contributions_${username}_timestamp`);
    
    if (cachedData && cachedTimestamp) {
      const parsedData = JSON.parse(cachedData);
      const timestamp = parseInt(cachedTimestamp);
      
      // Use cached data if it's less than 6 hours old
      if (Date.now() - timestamp < 6 * 60 * 60 * 1000) {
        console.log('Using cached GitHub data for', username);
        setContributionData(parsedData);
      }
    }
  }, [username]);

  // Fetch GitHub contribution count directly from API
  useEffect(() => {
    if (!username || fetchAttempted.current) return;
    
    fetchAttempted.current = true;
    
    const fetchContributions = async () => {
      try {
        // First try the API endpoint with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const apiUrl = `/api/github-contributions?username=${encodeURIComponent(username)}`;
        
        try {
          const response = await fetch(apiUrl, { signal: controller.signal });
          clearTimeout(timeoutId);
          
          if (response.ok) {
            // Handle potential JSON parsing errors
            const text = await response.text();
            let data;
            try {
              data = JSON.parse(text);
              setContributionData(data);
              
              // Cache the results
              localStorage.setItem(`github_contributions_${username}`, JSON.stringify(data));
              localStorage.setItem(`github_contributions_${username}_timestamp`, Date.now().toString());
              
              return;
            } catch (jsonError) {
              console.error('Error parsing JSON response:', jsonError);
              // Continue to fallback
            }
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          console.error('Error fetching from API:', fetchError);
          // Continue to fallback if it's not an abort error
          if (fetchError.name !== 'AbortError') {
            // Continue to fallback
          } else {
            console.log('API fetch timed out, using fallback');
          }
        }
        
        // Fallback to direct GitHub scraping with timeout
        console.log('API fetch failed, trying direct GitHub scraping');
        const data = await fetchGitHubContributions(username);
        if (data) {
          setContributionData(data);
          
          // Cache the fallback results
          localStorage.setItem(`github_contributions_${username}`, JSON.stringify(data));
          localStorage.setItem(`github_contributions_${username}_timestamp`, Date.now().toString());
        }
      } catch (err) {
        console.error('Error fetching GitHub contribution count:', err);
      }
    };
    
    fetchContributions();
  }, [username, fetchGitHubContributions]);

  // Get the final stats combining all data
  const stats = {
    total: totalContributions || baseStats.total || 0,
    currentStreak: baseStats.currentStreak || 0,
    longestStreak: baseStats.longestStreak || 0,
    dateRange: baseStats.dateRange || 'Last 12 months'
  };

  return {
    loading: loading && !totalContributions, // Show loading only if we don't have cached data
    error,
    tokenInvalid,
    stats,
    totalContributions
  };
}
