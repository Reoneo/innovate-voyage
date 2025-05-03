
import { useState, useEffect } from 'react';
import { fetchGitHubContributions } from './utils/githubApi';
import { ContributionData } from './types';

export function useGitHubContributions(username: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributionData, setContributionData] = useState<ContributionData | null>(null);
  const [yearlyTotal, setYearlyTotal] = useState<number | null>(null);
  const [retries, setRetries] = useState(0);
  
  useEffect(() => {
    if (!username) {
      console.log('No GitHub username provided to useGitHubContributions');
      setLoading(false);
      return;
    }

    console.log('🔍 Loading GitHub graph for:', username);
    
    const loadContributions = async () => {
      try {
        const data = await fetchGitHubContributions(username);
        if (data) {
          setContributionData(data);
          setYearlyTotal(data.totalContributions);
          setError(null); // Clear any previous errors
        } else {
          setError('Could not fetch GitHub contribution data');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to access GitHub API';
        console.error(`GitHub API error (${username}):`, errorMessage);
        setError(errorMessage);
        
        // Implement retry logic for transient errors
        if (retries < 2) {
          setRetries(prev => prev + 1);
          console.log(`Retrying GitHub API request (${retries + 1}/3)...`);
          setTimeout(() => loadContributions(), 1000); // Retry after 1 second
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    loadContributions();
  }, [username, retries]);

  return { contributionData, loading, error, yearlyTotal };
}
