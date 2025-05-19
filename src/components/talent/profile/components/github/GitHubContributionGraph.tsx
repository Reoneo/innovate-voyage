
import React, { useEffect, useState, useCallback } from 'react';
import { GitHubContributionProps } from './types';
import GitHubLoadingState from './GitHubLoadingState';
import GitHubContributionLegend from './components/GitHubContributionLegend';
import TokenInvalidAlert from './components/TokenInvalidAlert';
import { useGitHubCalendar } from './hooks/useGitHubCalendar';
import GitHubCalendar from 'react-github-calendar';

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

  // Standard GitHub theme
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
  const transformData = useCallback(contributions => {
    if (Array.isArray(contributions)) {
      const total = contributions.reduce((sum, day) => sum + day.count, 0);

      // Update the displayed total without causing re-renders
      if (total > 0 && total !== displayedTotal) {
        setDisplayedTotal(total);
      }
    }
    return contributions;
  }, [displayedTotal]);

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
        <div className="github-calendar-wrapper py-2 px-3 bg-slate-700 rounded-lg">
          {/* Header with Github Activity text */}
          <div className="rounded-md p-2 mb-2 flex items-center justify-center bg-slate-600">
            <div className="text-sm font-semibold text-white">
              <span className="text-base font-bold">GitHub Activity: </span>
              <span className="text-base font-bold text-green-400" id="contribution-count-banner">
                {displayedTotal || stats.total || 0}
              </span> Contributions in The Last Year
            </div>
          </div>
          
          {/* GitHub Calendar with white text labels */}
          <div className="calendar-container bg-slate-800 rounded-md p-3">
            {username && (
              <div className="w-full min-w-fit overflow-x-auto">
                <GitHubCalendar 
                  username={username}
                  colorScheme="dark"
                  theme={theme}
                  hideColorLegend={true}
                  hideMonthLabels={false}
                  showWeekdayLabels={true}
                  blockSize={10}
                  blockMargin={2}
                  blockRadius={2}
                  fontSize={10}
                  transformData={transformData}
                  labels={{
                    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    weekdays: ['', 'Mon', '', 'Wed', '', 'Fri', ''],
                    totalCount: '{{count}} contributions'
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Legend */}
          <GitHubContributionLegend />
        </div>
      )}
    </div>
  );
}
