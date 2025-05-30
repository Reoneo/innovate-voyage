
import React, { useEffect, useState, useCallback } from 'react';
import { GitHubContributionProps } from './types';
import GitHubLoadingState from './GitHubLoadingState';
import GitHubContributionLegend from './components/GitHubContributionLegend';
import TokenInvalidAlert from './components/TokenInvalidAlert';
import { useGitHubCalendar } from './hooks/useGitHubCalendar';
import GitHubCalendar from 'react-github-calendar';
import { Github } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Header with GitHub link and icon - centered */}
          <div className="flex items-center justify-center gap-2 p-2 sm:p-3 pb-1 sm:pb-2">
            <a 
              href={githubProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Github className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>GitHub Contributions</span>
            </a>
          </div>
          
          {/* Calendar container - responsive */}
          <div className="w-full overflow-x-auto flex justify-center px-1 sm:px-0">
            {username && (
              <div className="flex justify-center" style={{ 
                minWidth: isMobile ? '300px' : '650px',
                width: '100%',
                maxWidth: '100%'
              }}>
                <GitHubCalendar 
                  username={username} 
                  colorScheme="light" 
                  theme={theme} 
                  hideColorLegend={true} 
                  hideMonthLabels={false} 
                  showWeekdayLabels={true} 
                  blockSize={isMobile ? 6 : 8} 
                  blockMargin={isMobile ? 1 : 2} 
                  blockRadius={2} 
                  fontSize={isMobile ? 8 : 10} 
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
          
          {/* Legend at bottom with minimal spacing - centered */}
          <div className="px-2 sm:px-3 pb-1 sm:pb-2 flex justify-center">
            <GitHubContributionLegend />
          </div>
        </div>
      )}
    </div>
  );
}
