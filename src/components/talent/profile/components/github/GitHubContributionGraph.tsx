
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
  // Updated to follow the ThemeInput type format with light and dark objects
  const theme = {
    dark: {
      level0: '#161b22', // Empty cells
      level1: '#0e4429', // Light activity
      level2: '#006d32', // Medium activity
      level3: '#26a641', // High activity
      level4: '#39d353', // Very high activity
    },
    light: {
      level0: '#ebedf0', // Empty cells
      level1: '#9be9a8', // Light activity
      level2: '#40c463', // Medium activity
      level3: '#30a14e', // High activity
      level4: '#216e39', // Very high activity
    }
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
