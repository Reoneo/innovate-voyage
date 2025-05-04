
import React, { useEffect, useRef } from 'react';

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

  // Effect to initialize GitHub Calendar when the component mounts or username changes
  useEffect(() => {
    // Only try to initialize if we have a username and the component is mounted
    if (username && calendarRef.current && window.GitHubCalendar) {
      try {
        console.log(`Initializing GitHub Calendar for ${username}`);

        // Apply the GitHub Calendar with dark theme and responsive options
        window.GitHubCalendar(`.github-calendar-${username}`, username, {
          responsive: true,
          global_stats: false, // We'll display stats in our custom format
          tooltips: true,
          summary_text: '',
          dark_theme: true
        });

        // Apply custom styling to match the reference image after a short delay
        setTimeout(() => {
          const calendar = document.querySelector(`.github-calendar-${username}`);
          if (calendar) {
            // Add dark theme styles
            calendar.classList.add('github-calendar-dark');

            // Find all day squares and add grid styling
            const squares = calendar.querySelectorAll('.day');
            squares.forEach((square: Element) => {
              // Add grid effect to all squares - improved grid styling
              const rect = square as SVGRectElement;
              rect.setAttribute('stroke', 'rgba(27, 31, 35, 0.6)');
              rect.setAttribute('stroke-width', '1');
              rect.setAttribute('rx', '2');
              rect.setAttribute('ry', '2');
            });

            // Update contribution stats display based on fetched data
            if (totalContributions !== null) {
              const totalContribDisplay = document.getElementById(`${username}-total-contrib`);
              if (totalContribDisplay) {
                totalContribDisplay.textContent = totalContributions.toString();
              }
            }

            // Update date range
            try {
              const dateRangeElement = calendar.querySelector('.contrib-footer .float-left');
              if (dateRangeElement) {
                const dateRange = dateRangeElement.textContent || "";
                const dateDisplay = document.getElementById(`${username}-date-range`);
                if (dateDisplay) {
                  dateDisplay.textContent = dateRange.trim();
                }
              }
            } catch (err) {
              console.error('Error extracting GitHub date range:', err);
            }
          }
        }, 500);
      } catch (err) {
        console.error('Error initializing GitHub Calendar:', err);
      }
    }
  }, [username, totalContributions, statsTotal]);

  return (
    <div className="calendar-container min-h-[180px] rounded-lg overflow-hidden">
      <div ref={calendarRef} className={`github-calendar-${username} github-calendar-graph`}>
        {/* Loading message shown until the library loads the calendar */}
        Loading GitHub contribution data...
      </div>
    </div>
  );
}
