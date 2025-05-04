
import React, { useEffect } from 'react';
import { GitHubContributionProps } from './types';
import GitHubLoadingState from './GitHubLoadingState';
import GitHubContributionHeader from './components/GitHubContributionHeader';
import GitHubContributionLegend from './components/GitHubContributionLegend';
import TokenInvalidAlert from './components/TokenInvalidAlert';
import StatsDisplay from './components/StatsDisplay';
import { useGitHubCalendar } from './hooks/useGitHubCalendar';
import GitHubCalendar from 'react-github-calendar';

export default function GitHubContributionGraph({
  username,
  isFooter = false
}: GitHubContributionProps & { isFooter?: boolean }) {
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
        stats,
        isFooter
      });
    }
  }, [loading, error, totalContributions, stats, isFooter]);

  return (
    <div className={`w-full overflow-hidden ${!isFooter ? 'mt-4' : 'mt-0'}`}>
      <GitHubLoadingState loading={loading} error={error} />
      
      {tokenInvalid && <TokenInvalidAlert />}
      
      {!loading && !error && username && (
        <div className="github-calendar-wrapper">
          {/* Contribution count header - Show total contributions prominently */}
          {!isFooter && (
            <GitHubContributionHeader 
              totalContributions={totalContributions} 
              username={username}
            />
          )}
          
          {/* Total contributions banner for emphasis - Simplified for footer mode */}
          {!isFooter ? (
            <div className="bg-gray-800/50 rounded-md p-3 mb-4 flex items-center justify-center">
              <div className="text-xl font-semibold text-green-400">
                <span className="text-2xl font-bold" id="contribution-count-banner">
                  {totalContributions !== null ? totalContributions : (stats.total || 0)}
                </span> total contributions in the last year
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-medium text-gray-300">GitHub Activity</h4>
              <div className="text-sm text-green-400">
                <span className="font-bold" id="contribution-count-banner">
                  {totalContributions !== null ? totalContributions : (stats.total || 0)}
                </span> contributions
              </div>
            </div>
          )}
          
          {/* GitHub Calendar using the react-github-calendar component directly */}
          <div className={`calendar-container py-2 ${isFooter ? 'overflow-x-auto' : ''}`}>
            {username && (
              <GitHubCalendar 
                username={username}
                colorScheme="dark"
                theme={theme}
                hideColorLegend={true} // We'll use our custom legend
                hideMonthLabels={false} // Show month labels at the top
                showWeekdayLabels={true} // Show day labels on the left
                blockSize={isFooter ? 8 : 12}
                blockMargin={isFooter ? 2 : 4}
                blockRadius={2}
                fontSize={isFooter ? 8 : 10}
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
          
          {/* Legend and info section - Only show in full mode */}
          {!isFooter && <GitHubContributionLegend />}
          
          {/* Stats Display - Only show in full mode */}
          {!isFooter && (
            <div className="mt-4 py-3 px-4 bg-gray-800/30 rounded-md">
              <StatsDisplay 
                username={username}
                totalContributions={totalContributions}
                stats={stats}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
