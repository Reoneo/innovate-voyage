
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useGitHubContributions(username: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenInvalid, setTokenInvalid] = useState(false);
  
  useEffect(() => {
    if (!username) {
      console.log('No GitHub username provided to useGitHubContributions');
      setLoading(false);
      return;
    }

    // Check if GitHub Calendar script is already loaded
    const isScriptLoaded = !!window.GitHubCalendar;
    
    if (isScriptLoaded) {
      // If script is already loaded, we can proceed
      console.log('GitHub Calendar library is already loaded');
      setLoading(false);
    } else {
      console.log('GitHub Calendar library not detected, will use the one loaded in index.html');
      
      // Wait a short time to ensure the script from index.html is initialized
      const checkTimer = setTimeout(() => {
        if (window.GitHubCalendar) {
          console.log('GitHub Calendar library detected after waiting');
          setLoading(false);
        } else {
          console.error('GitHub Calendar library not found after waiting');
          setError('GitHub Calendar library could not be loaded');
          setLoading(false);
        }
      }, 1500);
      
      return () => clearTimeout(checkTimer);
    }
    
    // Cleanup function
    return () => {
      // No specific cleanup needed
    };
  }, [username]);

  return { loading, error, tokenInvalid };
}
