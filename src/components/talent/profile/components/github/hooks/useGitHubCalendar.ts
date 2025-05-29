
import { useState, useEffect, useRef } from 'react';
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
  const fetchAttempted = useRef<boolean>(false);

  useEffect(() => {
    if (!username) return;
    
    const cachedData = localStorage.getItem(`github_contributions_${username}`);
    const cachedTimestamp = localStorage.getItem(`github_contributions_${username}_timestamp`);
    
    if (cachedData && cachedTimestamp) {
      const parsedData = JSON.parse(cachedData);
      const timestamp = parseInt(cachedTimestamp);
      
      if (Date.now() - timestamp < 6 * 60 * 60 * 1000) {
        console.log('Using cached GitHub data for', username);
        setTotalContributions(parsedData.totalContributions);
        setContributionData(parsedData);
      }
    }
  }, [username]);

  useEffect(() => {
    if (!username || fetchAttempted.current) return;
    
    fetchAttempted.current = true;
    
    const fetchContributions = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // Reduced timeout
      
      const apiUrl = `/api/github-contributions?username=${encodeURIComponent(username)}`;
      
      try {
        const response = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const text = await response.text();
          const data = JSON.parse(text);
          if (data && typeof data.totalContributions === 'number') {
            setTotalContributions(data.totalContributions);
            setContributionData(data);
            
            localStorage.setItem(`github_contributions_${username}`, JSON.stringify(data));
            localStorage.setItem(`github_contributions_${username}_timestamp`, Date.now().toString());
            return;
          }
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        // Silently fail to improve performance
      }
      
      // Quick fallback without extensive error handling
      try {
        const data = await fetchGitHubContributions(username);
        if (data && typeof data.total === 'number') {
          setTotalContributions(data.total);
          setContributionData(data);
          
          localStorage.setItem(`github_contributions_${username}`, JSON.stringify({
            totalContributions: data.total,
            ...data
          }));
          localStorage.setItem(`github_contributions_${username}_timestamp`, Date.now().toString());
        }
      } catch (err) {
        // Silently fail for better performance
      }
    };
    
    fetchContributions();
  }, [username, fetchGitHubContributions]);

  const stats = useContributionStats(username, {
    total: totalContributions ?? baseStats.total,
    data: contributionData
  });

  return {
    loading: loading && !totalContributions,
    error,
    tokenInvalid,
    stats,
    totalContributions
  };
}
