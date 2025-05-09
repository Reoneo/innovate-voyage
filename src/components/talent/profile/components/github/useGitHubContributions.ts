
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
      // Use cors-anywhere or similar service to bypass CORS restrictions
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://github.com/${username}`)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch GitHub profile for ${username}`);
      }
      
      const data = await response.json();
      const html = data.contents;
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
        // Look for any text containing "contributions in the last year"
        const allText = doc.body.textContent || '';
        const yearlyMatch = allText.match(/(\d+,?\d*) contributions in the last year/);
        if (yearlyMatch && yearlyMatch[1]) {
          total = parseInt(yearlyMatch[1].replace(/,/g, ''), 10);
          console.log(`Found ${total} contributions via text search`);
        }
      }
      
      // Update the local state
      if (total > 0) {
        setTotalContributions(total);
        setStats(prev => ({ ...prev, total }));
        return { total };
      } else {
        // Try one more generic approach - look for any number followed by "contributions"
        const allText = doc.body.textContent || '';
        const genericMatch = allText.match(/(\d+,?\d*) contributions/);
        if (genericMatch && genericMatch[1]) {
          const foundTotal = parseInt(genericMatch[1].replace(/,/g, ''), 10);
          setTotalContributions(foundTotal);
          setStats(prev => ({ ...prev, total: foundTotal }));
          return { total: foundTotal };
        }
        
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
          setStats(prev => ({ ...prev, total: contributionData.total }));
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
