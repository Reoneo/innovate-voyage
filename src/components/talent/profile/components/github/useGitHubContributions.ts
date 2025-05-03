
import { useState, useEffect } from 'react';
import { fetchGitHubContributions } from './utils/githubApi';
import { ContributionData } from './types';

export function useGitHubContributions(username: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributionData, setContributionData] = useState<ContributionData | null>(null);
  const [yearlyTotal, setYearlyTotal] = useState<number | null>(null);
  
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
        } else {
          setError('Could not fetch GitHub contribution data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to access GitHub API');
      } finally {
        setLoading(false);
      }
    };

    loadContributions();
  }, [username]);

  return { contributionData, loading, error, yearlyTotal };
}
