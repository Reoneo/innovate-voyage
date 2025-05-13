
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

  // Custom theme matching the existing dark theme with more contrast for better visibility
  const theme = {
    dark: [
      '#161b22', // level0: Empty cells
      '#116d45', // level1: Light activity (brighter)
      '#00a550', // level2: Medium activity (brighter)
      '#2ae66e', // level3: High activity (brighter)
      '#6fff9b'  // level4: Very high activity (brighter)
    ]
  };

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
      <GitHubLoadingState loading={loading} error={error} />
      
      {tokenInvalid && <TokenInvalidAlert />}
      
      {!loading && !error && username && (
        <div className="github-calendar-wrapper px-1 py-1">
          {/* Modified header with Github Activity text - removed TalentProtocol branding */}
          <div className="bg-gray-800/70 rounded-md p-2 mb-2 flex items-center justify-center">
            <div className="text-sm font-semibold text-white">
              <span className="text-base font-bold">GitHub Activity: </span>
              <span className="text-base font-bold text-green-400" id="contribution-count-banner">
                {displayedTotal || (stats.total || 0)}
              </span> Contributions in The Last Year
            </div>
          </div>
          
          {/* GitHub Calendar with improved visibility */}
          <div className="calendar-container bg-gray-800/30 p-3 rounded-md" style={{ 
            minHeight: '90px',
            maxHeight: '110px',
            overflow: 'auto',
            margin: '0'
          }}>
            {username && (
              <div className="w-full min-w-[650px]">
                <GitHubCalendar 
                  username={username}
                  colorScheme="dark"
                  theme={theme}
                  hideColorLegend={true}
                  hideMonthLabels={false}
                  showWeekdayLabels={true}
                  blockSize={8}       // Increased from 7 for better visibility
                  blockMargin={2}     // Increased from 1.5 for better visibility
                  blockRadius={2}     // Increased from 1 for better visibility
                  fontSize={9}        // Increased from 7 for better visibility
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
          
          {/* Clearer legend with better spacing */}
          <div className="mt-3 flex justify-end">
            <GitHubContributionLegend />
          </div>
        </div>
      )}
    </div>
  );
}
