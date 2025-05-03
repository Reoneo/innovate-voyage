
import { useState, useEffect } from 'react';
import { fetchGitHubContributions } from './utils/githubApi';
import { ContributionData } from './types';

export function useGitHubContributions(username: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributionData, setContributionData] = useState<ContributionData | null>(null);
  const [yearlyTotal, setYearlyTotal] = useState<number | null>(null);
  const [retries, setRetries] = useState(0);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  
  useEffect(() => {
    if (!username) {
      console.log('No GitHub username provided to useGitHubContributions');
      setLoading(false);
      return;
    }

    console.log('🔍 Loading GitHub graph for:', username);
    
    const loadContributions = async () => {
      try {
        setIsUsingFallback(false);
        const data = await fetchGitHubContributions(username);
        if (data) {
          setContributionData(data);
          setYearlyTotal(data.totalContributions);
          setError(null); // Clear any previous errors
        } else {
          // More specific error messaging
          setError('Could not fetch GitHub contribution data.');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to access GitHub API';
        console.error(`GitHub API error (${username}):`, errorMessage);
        
        // More specific error messages based on error type
        if (errorMessage.includes('rate limit')) {
          setError('GitHub API rate limit exceeded. Please try again later.');
        } else if (errorMessage.includes('authentication') || errorMessage.includes('401')) {
          setError('GitHub API authentication error. Trying fallback method...');
          
          // Set flag to indicate we're using fallback
          setIsUsingFallback(true);
        } else {
          setError(errorMessage);
        }
        
        // Only retry for certain types of errors
        if (retries < 2 && !errorMessage.includes('authentication')) {
          setRetries(prev => prev + 1);
          console.log(`Retrying GitHub API request (${retries + 1}/3)...`);
          setTimeout(() => loadContributions(), 2000); // Retry after 2 seconds
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    loadContributions();
  }, [username, retries]);

  return { contributionData, loading, error, yearlyTotal, isUsingFallback };
}
