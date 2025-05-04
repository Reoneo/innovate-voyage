
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
  
  // Add loading timeout state
  const [loadingTimeout, setLoadingTimeout] = useState<boolean>(false);
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
    ],
    light: [
      '#ebedf0', // level0: Empty cells
      '#9be9a8', // level1: Light activity
      '#40c463', // level2: Medium activity
      '#30a14e', // level3: High activity
      '#216e39'  // level4: Very high activity
    ]
  };
  
  // Add timeout for loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoadingTimeout(true);
      }
    }, 8000); // Show timeout message after 8 seconds

    return () => clearTimeout(timeoutId);
  }, [loading]);

  // Memoized transform function to prevent infinite re-renders
  const transformData = useCallback((contributions) => {
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
      {loading && <GitHubLoadingState loading={!loadingTimeout} error={null} />}
      
      {loadingTimeout && loading && (
        <div className="flex flex-col items-center justify-center h-48 w-full bg-gray-950 rounded-lg border border-gray-800 p-6">
          <div className="text-amber-500 font-medium mb-2">Taking longer than expected...</div>
          <div className="text-xs text-gray-400 text-center max-w-md">
            GitHub activity data is taking too long to load. You can continue browsing or try refreshing the page.
          </div>
        </div>
      )}
      
      {tokenInvalid && <TokenInvalidAlert />}
      
      {!loading && !error && username && (
        <div className="github-calendar-wrapper px-2 py-3">
          {/* Total contributions banner for emphasis */}
          <div className="bg-gray-800/50 rounded-md p-2 mb-2 flex items-center justify-center">
            <div className="text-base font-semibold text-green-400">
              <span className="text-xl font-bold" id="contribution-count-banner">
                {displayedTotal || (stats.total || 0)}
              </span> total contributions in the last year
            </div>
          </div>
          
          {/* GitHub Calendar using the react-github-calendar component directly */}
          <div className="calendar-container py-2 overflow-x-auto flex justify-center">
            {username && (
              <div className="w-full min-w-[750px] flex justify-center">
                <GitHubCalendar 
                  username={username}
                  colorScheme="dark"
                  theme={theme}
                  hideColorLegend={true} // We'll use our custom legend
                  hideMonthLabels={false} // Show month labels at the top
                  showWeekdayLabels={true} // Show day labels on the left
                  blockSize={10} // Smaller blocks for a slimmer profile
                  blockMargin={3} // Reduced margin between blocks
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
      
      {!loading && error && (
        <div className="flex flex-col items-center justify-center h-48 w-full bg-gray-950 rounded-lg border border-gray-800 p-6">
          <div className="text-red-500 font-medium mb-2">Error loading GitHub data</div>
          <div className="text-xs text-gray-400 text-center max-w-md">
            {error}
          </div>
        </div>
      )}
    </div>
  );
}
