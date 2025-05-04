
import React, { useEffect } from 'react';
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

  // Log contribution data for debugging
  useEffect(() => {
    if (!loading && !error) {
      console.log('GitHub contribution data:', { 
        totalContributions, 
        stats 
      });
    }
  }, [loading, error, totalContributions, stats]);

  return (
    <div className="w-full overflow-hidden mt-4">
      <GitHubLoadingState loading={loading} error={error} />
      
      {tokenInvalid && <TokenInvalidAlert />}
      
      {!loading && !error && username && (
        <div className="github-calendar-wrapper">
          {/* Total contributions banner for emphasis */}
          <div className="bg-gray-800/50 rounded-md p-3 mb-4 flex items-center justify-center">
            <div className="text-xl font-semibold text-green-400">
              <span className="text-2xl font-bold" id="contribution-count-banner">
                {totalContributions !== null ? totalContributions : (stats.total || 0)}
              </span> total contributions in the last year
            </div>
          </div>
          
          {/* GitHub Calendar using the react-github-calendar component directly */}
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
                transformData={(contributions) => {
                  // Use this opportunity to ensure we have the correct total
                  if (Array.isArray(contributions)) {
                    const total = contributions.reduce((sum, day) => sum + day.count, 0);
                    console.log(`Calendar data shows ${total} total contributions`);
                    
                    // Update our banner if needed
                    const bannerElem = document.getElementById('contribution-count-banner');
                    if (bannerElem && total > 0) {
                      bannerElem.textContent = String(total);
                    }
                  }
                  return contributions;
                }}
              />
            )}
          </div>
          
          {/* Legend and info section */}
          <GitHubContributionLegend />
          
          {/* Removed the Stats Display section that was here */}
        </div>
      )}
    </div>
  );
}
