
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useGitHubContributions(username: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenInvalid, setTokenInvalid] = useState(false);
  const [totalContributions, setTotalContributions] = useState<number | null>(null);
  const [stats, setStats] = useState({ 
    total: 0, 
    currentStreak: 0, 
    longestStreak: 0,
    dateRange: 'May 5, 2024 – May 4, 2025'
  });
  
  // Function to fetch GitHub contribution data directly from GitHub profile page
  const fetchGitHubContributions = async (username: string) => {
    if (!username) return null;
    
    try {
      // Directly fetch the GitHub profile page
      console.log(`Fetching GitHub profile for ${username}`);
      const response = await fetch(`https://github.com/${username}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch GitHub profile for ${username}`);
      }
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Find the contribution count element - updated selector for more reliability
      let total = 0;
      
      // Try multiple selectors to find the contribution count
      // First try the most specific selector
      const contribHeader = doc.querySelector('h2.f4.text-normal.mb-2');
      if (contribHeader) {
        const text = contribHeader.textContent || '';
        const match = text.match(/(\d+,?\d*) contributions/);
        if (match && match[1]) {
          // Remove commas and convert to number
          total = parseInt(match[1].replace(/,/g, ''), 10);
          console.log(`Found ${total} contributions via h2 selector`);
        }
      }
      
      // If that fails, try alternative selectors
      if (total === 0) {
        // Try to find contribution count in the overview tab
        const contributionsElements = doc.querySelectorAll('.js-yearly-contributions h2');
        for (const el of contributionsElements) {
          const text = el.textContent || '';
          const match = text.match(/(\d+,?\d*) contributions/);
          if (match && match[1]) {
            total = parseInt(match[1].replace(/,/g, ''), 10);
            console.log(`Found ${total} contributions via alternative selector`);
            break;
          }
        }
      }
      
      // Update the local state
      if (total > 0) {
        setTotalContributions(total);
        setStats(prev => ({ ...prev, total }));
        return { total };
      } else {
        console.warn(`Could not find contribution count for ${username}`);
        return null;
      }
    } catch (err) {
      console.error('Error fetching GitHub contribution data:', err);
      return null;
    }
  };
  
  useEffect(() => {
    if (!username) {
      console.log('No GitHub username provided to useGitHubContributions');
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Fetch contribution data directly
    fetchGitHubContributions(username)
      .then(contributionData => {
        if (contributionData && typeof contributionData.total === 'number') {
          console.log(`Found ${contributionData.total} contributions for ${username} via direct fetch`);
          setTotalContributions(contributionData.total);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error in direct fetch of GitHub contributions:', err);
        setError('Failed to fetch GitHub contributions');
        setLoading(false);
      });

  }, [username]);

  return { 
    loading, 
    error, 
    tokenInvalid, 
    totalContributions, 
    stats, 
    fetchGitHubContributions 
  };
}
