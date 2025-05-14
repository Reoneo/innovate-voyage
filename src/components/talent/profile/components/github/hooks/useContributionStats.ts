
import { useState, useEffect } from 'react';

interface ContributionStats {
  total: number;
  currentStreak: number;
  longestStreak: number;
  dateRange: string;
}

export function useContributionStats(contributionsData: any) {
  const [stats, setStats] = useState<ContributionStats>({ 
    total: 0, 
    currentStreak: 0, 
    longestStreak: 0,
    dateRange: 'May 5, 2024 – May 4, 2025' // Default date range
  });

  useEffect(() => {
    if (!contributionsData) return;
    
    try {
      // Extract total contributions
      const totalContributions = contributionsData.total || 0;
      
      // In a real implementation, we would calculate streaks from the contribution data
      // For this example, we're using placeholder values as actual streak calculation
      // would require daily contribution history
      const currentStreak = 0;  // Would need API data for accurate calculation
      const longestStreak = 0;  // Would need API data for accurate calculation
      
      // Get date range based on current date
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);
      
      // Format the date range in "Month Day, Year" format
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric'
        });
      };
      
      const formattedDateRange = `${formatDate(oneYearAgo)} – ${formatDate(today)}`;
      
      // Update stats with calculated values
      setStats({
        total: totalContributions,
        currentStreak,
        longestStreak,
        dateRange: formattedDateRange
      });
      
      console.log('GitHub stats calculated:', { 
        total: totalContributions, 
        currentStreak, 
        longestStreak,
        dateRange: formattedDateRange
      });
    } catch (err) {
      console.error('Error calculating contribution stats:', err);
    }
  }, [contributionsData]);

  return stats;
}
