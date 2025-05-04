
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
    ],
    light: [
      '#ebedf0', // level0: Empty cells
      '#9be9a8', // level1: Light activity
      '#40c463', // level2: Medium activity
      '#30a14e', // level3: High activity
      '#216e39'  // level4: Very high activity
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
        username={username}
        colorScheme="dark"
        theme={theme as any}
        hideColorLegend={true}
        hideMonthLabels={false}
        showWeekdayLabels={true} 
        blockSize={12}
        blockMargin={4}
        blockRadius={2}
        fontSize={10}
        transformData={(contributions) => {
          // Calculate total from the contribution data
          if (Array.isArray(contributions)) {
            const total = contributions.reduce((sum, day) => sum + day.count, 0);
            console.log(`Calendar data shows ${total} total contributions`);
            
            // Update our display if needed
            const totalDisplay = document.getElementById(`${username}-total-contrib`);
            if (totalDisplay && total > 0) {
              totalDisplay.textContent = String(total);
            }
          }
          return contributions;
        }}
      />
    </div>
  );
}
