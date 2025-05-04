
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useGitHubContributions(username: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenInvalid, setTokenInvalid] = useState(false);
  const [stats, setStats] = useState({ 
    total: 0, 
    currentStreak: 0, 
    longestStreak: 0,
    dateRange: 'May 5, 2024 – May 4, 2025'
  });
  
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
      
      // After calendar is loaded, extract contribution stats
      setTimeout(() => {
        try {
          const calendarContainer = document.querySelector(`.github-calendar-${username}`);
          if (calendarContainer) {
            // Find the contribution count element to extract total contributions
            const totalContribElement = calendarContainer.querySelector('.contrib-number');
            if (totalContribElement) {
              const totalText = totalContribElement.textContent || "";
              const totalMatch = totalText.match(/\d+/);
              if (totalMatch) {
                const total = parseInt(totalMatch[0], 10);
                setStats(prev => ({ ...prev, total }));
                
                // Update the stats display with the actual data
                const totalContribDisplay = document.getElementById(`${username}-total-contrib`);
                if (totalContribDisplay) {
                  totalContribDisplay.textContent = total.toString();
                }
                
                // Update date range with actual period
                const dateRangeElement = calendarContainer.querySelector('.contrib-footer .float-left');
                if (dateRangeElement) {
                  const dateRange = dateRangeElement.textContent || "";
                  if (dateRange) {
                    setStats(prev => ({ ...prev, dateRange: dateRange.trim() }));
                    
                    const dateDisplay = document.getElementById(`${username}-date-range`);
                    if (dateDisplay) {
                      dateDisplay.textContent = dateRange.trim();
                    }
                  }
                }

                // Calculate streaks (in a real implementation you would fetch this data from an API)
                // For this example, we'll just set dummy data since streaks require full commit history analysis
                // that's not available in the standard GitHub Calendar widget
                const currentStreak = 0;  // Would need API data for this
                const longestStreak = 0;  // Would need API data for this
                
                setStats(prev => ({ 
                  ...prev, 
                  currentStreak,
                  longestStreak
                }));
                
                console.log('GitHub stats updated:', { total, currentStreak, longestStreak });
              }
            }
          }
        } catch (err) {
          console.error('Error extracting GitHub stats:', err);
        }
      }, 1000);
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
  }, [username]);

  return { loading, error, tokenInvalid, stats };
}
