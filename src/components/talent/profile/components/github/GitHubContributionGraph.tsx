
import React, { useEffect, useState, useCallback } from 'react';
import { GitHubContributionProps } from './types';
import GitHubLoadingState from './GitHubLoadingState';
import GitHubContributionLegend from './components/GitHubContributionLegend';
import TokenInvalidAlert from './components/TokenInvalidAlert';
import { useGitHubCalendar } from './hooks/useGitHubCalendar';
import GitHubCalendar from 'react-github-calendar';
import { Github } from 'lucide-react';

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
    light: ['#ffffff', '#d6d6d6', '#969696', '#545454', '#000000']
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

  const githubProfileUrl = `https://github.com/${username}`;

  return (
    <div className="w-full">
      <GitHubLoadingState loading={loading} error={error} />
      
      {tokenInvalid && <TokenInvalidAlert />}
      
      {!loading && !error && username && (
        <div className="bg-white border border-gray-200 rounded-lg p-0 overflow-hidden">
          {/* Header with GitHub link and icon */}
          <div className="flex items-center gap-2 p-3 pb-2">
            <a 
              href={githubProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm font-medium">GitHub Contributions</span>
            </a>
          </div>
          
          {/* Calendar container with no extra padding */}
          <div className="w-full overflow-x-auto">
            {username && (
              <div className="w-full" style={{ minWidth: '650px' }}>
                <GitHubCalendar 
                  username={username} 
                  colorScheme="light" 
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
          
          {/* Legend at bottom with minimal spacing */}
          <div className="px-3 pb-2 flex justify-center">
            <GitHubContributionLegend />
          </div>
        </div>
      )}
    </div>
  );
}
