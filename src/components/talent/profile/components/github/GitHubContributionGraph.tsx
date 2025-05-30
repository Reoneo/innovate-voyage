
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

  const [displayedTotal, setDisplayedTotal] = useState<number>(0);

  if (!username) {
    console.log('No GitHub username provided to GitHubContributionGraph');
    return null;
  }

  const theme = {
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
  };

  const transformData = useCallback(contributions => {
    if (Array.isArray(contributions)) {
      const total = contributions.reduce((sum, day) => sum + day.count, 0);
      if (total > 0 && total !== displayedTotal) {
        setDisplayedTotal(total);
      }
    }
    return contributions;
  }, [displayedTotal]);

  useEffect(() => {
    if (totalContributions && totalContributions > 0) {
      setDisplayedTotal(totalContributions);
    } else if (stats.total > 0) {
      setDisplayedTotal(stats.total);
    }
  }, [totalContributions, stats.total]);

  return (
    <div className="w-full">
      <GitHubLoadingState loading={loading} error={error} />
      
      {tokenInvalid && <TokenInvalidAlert />}
      
      {!loading && !error && username && (
        <div className="github-calendar-wrapper">
          <div className="overflow-x-auto">
            {username && (
              <div className="min-w-[650px]">
                <GitHubCalendar 
                  username={username} 
                  colorScheme="dark" 
                  theme={theme} 
                  hideColorLegend={true} 
                  hideMonthLabels={false} 
                  showWeekdayLabels={true} 
                  blockSize={8} 
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
          
          <div className="mt-2 flex justify-center">
            <GitHubContributionLegend />
          </div>
        </div>
      )}
    </div>
  );
}
