
import React from 'react';
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
  
  // Store the displayed contribution count - ensure we use a valid number
  const displayTotal = totalContributions || stats.total || 0;

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

  console.log(`Rendering GitHub graph for ${username} with ${displayTotal} contributions`);

  return (
    <div className="w-full overflow-hidden">
      <GitHubLoadingState loading={loading} error={error} />
      
      {tokenInvalid && <TokenInvalidAlert />}
      
      {!loading && !error && username && (
        <div className="github-calendar-wrapper px-1 py-1">
          {/* Modified header with Github Activity text */}
          <div className="bg-gray-800/50 rounded-md p-1 mb-2 flex items-center justify-center">
            <div className="text-sm font-semibold text-white">
              <span className="text-base font-bold">GitHub Activity: </span>
              <span className="text-base font-bold text-green-400" id="contribution-count-banner">
                {displayTotal}
              </span> Contributions in The Last Year
            </div>
          </div>
          
          {/* GitHub Calendar with white text labels */}
          <div className="calendar-container" style={{ 
            minHeight: '90px',
            maxHeight: '110px',
            overflow: 'auto',
            padding: '0',
            margin: '0'
          }}>
            <div className="w-full min-w-[650px]">
              <GitHubCalendar 
                username={username}
                colorScheme="dark"
                theme={theme}
                hideColorLegend={true}
                hideMonthLabels={false}
                showWeekdayLabels={true}
                blockSize={8}
                blockMargin={2}
                blockRadius={1}
                fontSize={8}
                labels={{
                  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                  weekdays: ['', 'Mon', '', 'Wed', '', 'Fri', ''],
                  totalCount: '{{count}} contributions'
                }}
                transformData={(contributions) => {
                  // Return the contributions data directly
                  console.log(`Calendar received contributions data for ${username}`);
                  return contributions;
                }}
              />
            </div>
          </div>
          
          {/* Legend */}
          <GitHubContributionLegend />
        </div>
      )}
    </div>
  );
}
