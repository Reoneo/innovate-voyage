
import React from 'react';
import { GitHubContributionProps } from './types';
import GitHubLoadingState from './GitHubLoadingState';
import GitHubContributionHeader from './components/GitHubContributionHeader';
import GitHubContributionLegend from './components/GitHubContributionLegend';
import TokenInvalidAlert from './components/TokenInvalidAlert';
import StatsDisplay from './components/StatsDisplay';
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

  // If no username provided, don't show anything
  if (!username) {
    console.log('No GitHub username provided to GitHubContributionGraph');
    return null;
  }

  // Custom theme matching the existing dark theme
  // Corrected to use arrays instead of objects with named levels
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

  return (
    <div className="w-full overflow-hidden mt-4">
      <GitHubLoadingState loading={loading} error={error} />
      
      {tokenInvalid && <TokenInvalidAlert />}
      
      {!loading && !error && username && (
        <div className="github-calendar-wrapper">
          {/* Contribution count header */}
          <GitHubContributionHeader 
            totalContributions={totalContributions} 
            username={username}
          />
          
          {/* GitHub Calendar using the react-github-calendar component */}
          <div className="calendar-container py-2">
            {username && (
              <GitHubCalendar 
                username={username}
                colorScheme="dark"
                theme={theme}
                hideColorLegend={true} // We'll use our custom legend
                hideMonthLabels={false} // Show month labels at the top
                showWeekdayLabels={true} // Show day labels on the left
                blockSize={12}
                blockMargin={4}
                blockRadius={2}
                fontSize={10}
              />
            )}
          </div>
          
          {/* Legend and info section */}
          <GitHubContributionLegend />
          
          {/* Stats Display - Now hidden as per design */}
          <StatsDisplay 
            username={username}
            totalContributions={totalContributions}
            stats={stats}
          />
        </div>
      )}
    </div>
  );
}
