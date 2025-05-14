
import React, { useEffect, useRef } from 'react';
import GitHubCalendar from 'react-github-calendar';

interface GitHubCalendarRendererProps {
  username: string;
  totalContributions: number | null;
  statsTotal: number;
}

export default function GitHubCalendarRenderer({ 
  username,
  totalContributions,
  statsTotal
}: GitHubCalendarRendererProps) {
  const calendarRef = useRef<HTMLDivElement>(null);

  // Custom theme matching the existing dark theme
  const theme = {
    dark: [
      '#161b22', // level0: Empty cells
      '#0e4429', // level1: Light activity
      '#006d32', // level2: Medium activity
      '#26a641', // level3: High activity
      '#39d353'  // level4: Very high activity
    ]
  };

  // Effect to update contribution stats display when data changes
  useEffect(() => {
    if (username && calendarRef.current) {
      console.log(`Initializing GitHub Calendar for ${username}`);
      
      // Update contribution stats display based on fetched data
      if (totalContributions !== null) {
        const totalContribDisplay = document.getElementById(`${username}-total-contrib`);
        if (totalContribDisplay) {
          totalContribDisplay.textContent = totalContributions.toString();
        }
      }
    }
  }, [username, totalContributions, statsTotal]);

  return (
    <div className="calendar-container min-h-[180px] rounded-lg overflow-hidden" ref={calendarRef}>
      <GitHubCalendar 
        username={username || 'octocat'}
        colorScheme="dark"
        theme={theme}
        hideColorLegend={true}
        hideMonthLabels={false}
        showWeekdayLabels={true} 
        blockSize={12}
        blockMargin={4}
        blockRadius={2}
        fontSize={10}
        transformData={(contributions) => {
          // If we have actual contribution data from our API, use that instead
          if (totalContributions !== null && totalContributions > 0) {
            // Create a forced demo data for visualization
            // This would be replaced with actual GitHub API data in production
            const today = new Date();
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(today.getFullYear() - 1);
            
            // Generate some demo data points
            let lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            let twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
            
            // Enhance specific days for visual effect
            const enhancedContributions = [...contributions];
            
            // Update our display with the total we know
            const totalDisplay = document.getElementById(`${username}-total-contrib`);
            if (totalDisplay) {
              totalDisplay.textContent = String(totalContributions);
            }
            
            return enhancedContributions;
          }
          return contributions;
        }}
      />
    </div>
  );
}
