
import { useState, useEffect } from 'react';
import { ContributionData } from './types';
import { toast } from 'sonner';

// Configuration for the local server
const LOCAL_SERVER_URL = 'http://localhost:4000';
const USE_LOCAL_SERVER = true; // Set to true to use the local server

export function useGitHubContributions(username: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributionData, setContributionData] = useState<ContributionData | null>(null);
  const [yearlyTotal, setYearlyTotal] = useState<number | null>(null);
  const [retries, setRetries] = useState(0);
  const [tokenInvalid, setTokenInvalid] = useState(false);
  
  useEffect(() => {
    if (!username) {
      console.log('No GitHub username provided to useGitHubContributions');
      setLoading(false);
      return;
    }

    // Reset states when username changes
    setLoading(true);
    setError(null);
    setContributionData(null);
    setTokenInvalid(false);
    
    console.log('🔍 Loading GitHub graph for:', username);
    
    const loadContributions = async () => {
      try {
        // Choose API endpoint based on configuration
        const apiUrl = USE_LOCAL_SERVER 
          ? `${LOCAL_SERVER_URL}/api/github-contributions?username=${encodeURIComponent(username)}`
          : `/api/github-contributions?username=${encodeURIComponent(username)}`;
        
        console.log(`Fetching from: ${apiUrl}`);
        
        const response = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/json'
          },
          // Add cache busting parameter to prevent caching of failed requests
          cache: 'no-cache'
        });
        
        // Handle response
        const data = await response.json();
        
        if (!response.ok) {
          // Check if token is invalid
          if (response.status === 401 || data.tokenStatus === 'invalid') {
            console.error('GitHub API token is invalid or expired');
            setTokenInvalid(true);
            throw new Error('GitHub API token is invalid or expired. Please update your token.');
          }
          
          // Try to get the error details from the response
          const errorMessage = data?.error || `API returned ${response.status}`;
          throw new Error(errorMessage);
        }
        
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
        
        // Show toast for token issues
        if (errorMessage.includes('token') && USE_LOCAL_SERVER) {
          toast.error('GitHub API token expired', {
            description: 'Please update your token in the .env file and restart the server',
            duration: 8000,
          });
        }
        
        // Implement retry logic for transient errors, but not for token issues
        if (retries < 2 && !errorMessage.includes('token')) {
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

  return { contributionData, loading, error, yearlyTotal, tokenInvalid };
}
