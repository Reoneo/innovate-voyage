import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// No longer need the complex API interaction since the GitHub Calendar library 
// handles the data fetching directly

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

    // Load the GitHub Calendar scripts and styles if they haven't been loaded yet
    const loadScripts = async () => {
      try {
        // Check if scripts are already loaded
        if (!document.querySelector('script[src*="github-calendar"]')) {
          // Load script
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/github-calendar@latest/dist/github-calendar.min.js';
          script.async = true;
          
          // Load stylesheet
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/github-calendar@latest/dist/github-calendar-responsive.css';
          
          // Append to document
          document.head.appendChild(link);
          
          // Wait for script to load before setting loading to false
          script.onload = () => {
            console.log('GitHub Calendar script loaded');
            setLoading(false);
          };
          
          script.onerror = (e) => {
            console.error('Error loading GitHub Calendar script:', e);
            setError('Failed to load GitHub Calendar library');
            setLoading(false);
          };
          
          document.head.appendChild(script);
        } else {
          // Scripts already loaded
          console.log('GitHub Calendar script already loaded');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error in loadScripts:', err);
        setError('Failed to initialize GitHub Calendar');
        setLoading(false);
      }
    };
    
    // Load scripts and styles
    loadScripts();
    
    // Cleanup
    return () => {
      // No cleanup needed since we're keeping the scripts loaded for reuse
    };
  }, [username]);

  return { loading, error, tokenInvalid };
}
