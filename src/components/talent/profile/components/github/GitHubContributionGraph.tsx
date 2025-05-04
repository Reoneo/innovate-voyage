
import React, { useEffect, useState, useCallback } from 'react';
import { GitHubContributionProps } from './types';
import GitHubLoadingState from './GitHubLoadingState';
import GitHubContributionLegend from './components/GitHubContributionLegend';
import TokenInvalidAlert from './components/TokenInvalidAlert';
import { useGitHubCalendar } from './hooks/useGitHubCalendar';
import GitHubCalendar from 'react-github-calendar';
import { SocialIcon } from '@/components/ui/social-icon';

export default function GitHubContributionGraph({
  username
}: GitHubContributionProps) {
  const {
    loading,
    error,
    tokenInvalid,
    stats,
    totalContributions
  } = useGitHubCalendar(username);
  
  // Store the displayed contribution count to avoid re-renders
  const [displayedTotal, setDisplayedTotal] = useState<number>(0);

  // If no username provided, don't show anything
  if (!username) {
    console.log('No GitHub username provided to GitHubContributionGraph');
    return null;
  }

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

  // Memoized transform function to prevent infinite re-renders
  const transformData = useCallback((contributions) => {
    if (Array.isArray(contributions)) {
      const total = contributions.reduce((sum, day) => sum + day.count, 0);
      console.log(`Calendar data shows ${total} total contributions`);
      
      // Update the displayed total without causing re-renders
      if (total > 0 && total !== displayedTotal) {
        setDisplayedTotal(total);
      }
    }
    return contributions;
  }, [displayedTotal]);

  // Log contribution data for debugging
  useEffect(() => {
    if (!loading && !error) {
      console.log('GitHub contribution data:', { 
        totalContributions, 
        stats 
      });
    }
  }, [loading, error, totalContributions, stats]);

  // Effect to update the banner when totalContributions changes
  useEffect(() => {
    if (totalContributions && totalContributions > 0) {
      setDisplayedTotal(totalContributions);
    } else if (stats.total > 0) {
      setDisplayedTotal(stats.total);
    }
  }, [totalContributions, stats.total]);

  return (
    <div className="w-full overflow-hidden">
      <GitHubLoadingState loading={loading} error={error} />
      
      {tokenInvalid && <TokenInvalidAlert />}
      
      {!loading && !error && username && (
        <div className="github-calendar-wrapper px-2 py-2">
          {/* Header with Discord icon */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <SocialIcon type="discord" size={20} className="mr-1" />
              <h3 className="text-lg font-medium text-white">
                GitHub Contributions in the last year:
                <span className="text-green-400 font-bold ml-2">
                  {displayedTotal || (stats.total || 0)}
                </span>
              </h3>
            </div>
            <a 
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer" 
              className="text-sm text-blue-400 hover:underline"
            >
              @{username}
            </a>
          </div>
          
          {/* GitHub Calendar using the react-github-calendar component directly */}
          <div className="calendar-container py-1 overflow-x-auto">
            {username && (
              <div className="w-full min-w-[750px]">
                <GitHubCalendar 
                  username={username}
                  colorScheme="dark"
                  theme={theme}
                  hideColorLegend={true} // We'll use our custom legend
                  hideMonthLabels={false} // Show month labels at the top
                  showWeekdayLabels={true} // Show day labels on the left
                  blockSize={8} // Smaller blocks for a more compact view
                  blockMargin={2} // Reduced margin between blocks
                  blockRadius={2}
                  fontSize={10}
                  transformData={transformData}
                  labels={{
                    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    weekdays: ['', 'Mon', '', 'Wed', '', 'Fri', ''],
                    totalCount: '{{count}} contributions in the last year'
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Legend and info section */}
          <GitHubContributionLegend />
        </div>
      )}
    </div>
  );
}
