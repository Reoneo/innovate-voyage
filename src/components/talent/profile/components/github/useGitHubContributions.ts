
import { useState, useEffect } from 'react';
import { ContributionData } from './types';

// Configuration for the local server
const LOCAL_SERVER_URL = 'http://localhost:4000';
const USE_LOCAL_SERVER = true; // Toggle between local server and Vercel API

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
        // Choose API endpoint based on configuration
        const apiUrl = USE_LOCAL_SERVER 
          ? `${LOCAL_SERVER_URL}/api/github-contributions?username=${encodeURIComponent(username)}`
          : `/api/github-contributions?username=${encodeURIComponent(username)}`;
        
        console.log(`Fetching from: ${apiUrl}`);
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          // Try to get the error details from the response
          const errorData = await response.json().catch(() => null);
          const errorMessage = errorData?.error || `API returned ${response.status}`;
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        if (data) {
          console.log(`Received GitHub data for ${username}:`, data);
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
