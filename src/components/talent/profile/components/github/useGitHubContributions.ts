
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useGitHubContributions(username: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenInvalid, setTokenInvalid] = useState(false);
  const [stats, setStats] = useState({ total: 0, currentStreak: 0, longestStreak: 0 });
  
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
          // Find the contribution count element
          const calendarContainer = document.querySelector(`.github-calendar-${username}`);
          if (calendarContainer) {
            const totalContribElement = calendarContainer.querySelector('.contrib-number');
            if (totalContribElement) {
              const totalText = totalContribElement.textContent || "";
              const totalMatch = totalText.match(/\d+/);
              if (totalMatch) {
                const total = parseInt(totalMatch[0], 10);
                
                // Update the stats display
                const totalContribDisplay = document.getElementById(`${username}-total-contrib`);
                if (totalContribDisplay) {
                  totalContribDisplay.textContent = total.toString();
                }
                
                // Update date range
                const dateRangeElement = calendarContainer.querySelector('.contrib-footer .float-left');
                if (dateRangeElement) {
                  const dateRange = dateRangeElement.textContent || "";
                  const dateDisplay = document.getElementById(`${username}-date-range`);
                  if (dateDisplay) {
                    dateDisplay.textContent = dateRange.trim();
                  }
                }
                
                // For streaks, we would need additional API data
                // For now, just use placeholder values
                const longestStreakDisplay = document.getElementById(`${username}-longest-streak`);
                const currentStreakDisplay = document.getElementById(`${username}-current-streak`);
                
                if (longestStreakDisplay && currentStreakDisplay) {
                  // If we had streak data:
                  // longestStreakDisplay.textContent = `${stats.longestStreak} days`;
                  // currentStreakDisplay.textContent = `${stats.currentStreak} days`;
                  
                  // For now use default placeholders
                  longestStreakDisplay.textContent = "0 days";
                  currentStreakDisplay.textContent = "0 days";
                }
              }
            }
          }
        } catch (err) {
          console.error('Error extracting GitHub stats:', err);
        }
      }, 1000); // Give a bit more time for the calendar to fully load
      
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

  return { loading, error, tokenInvalid, stats };
}
