
import React, { useEffect, useRef } from 'react';
import { GitHubContributionProps } from './types';
import GitHubLoadingState from './GitHubLoadingState';
import GitHubContributionLegend from './components/GitHubContributionLegend';
import TokenInvalidAlert from './components/TokenInvalidAlert';
import { useGitHubCalendar } from './hooks/useGitHubCalendar';

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
  
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // Initialize GitHub Calendar with the direct library
  useEffect(() => {
    if (!loading && !error && username && calendarRef.current) {
      try {
        // @ts-ignore - GitHubCalendar is loaded from CDN
        window.GitHubCalendar && window.GitHubCalendar(calendarRef.current, username, {
          responsive: true,
          global_stats: false, // Hide default stats, we'll use our custom display
          tooltips: true
        });
        
        console.log('GitHub Calendar initialized for:', username);
      } catch (err) {
        console.error('Error initializing GitHub Calendar:', err);
      }
    }
  }, [loading, error, username]);

  // If no username provided, don't show anything
  if (!username) {
    console.log('No GitHub username provided to GitHubContributionGraph');
    return null;
  }
  
  // Display contribution count when available
  const displayedTotal = totalContributions || (stats?.total || 0);

  return (
    <div className="w-full overflow-hidden">
      <GitHubLoadingState loading={loading} error={error} />
      
      {tokenInvalid && <TokenInvalidAlert />}
      
      {!loading && !error && username && (
        <div className="github-calendar-wrapper px-2 py-3 flex flex-col">
          {/* Total contributions banner for emphasis */}
          <div className="bg-gray-800/50 rounded-md p-2 mb-2 flex items-center justify-center">
            <div className="text-base font-semibold text-green-400">
              <span className="text-xl font-bold" id="contribution-count-banner">
                {displayedTotal}
              </span> total contributions in the last year
            </div>
          </div>
          
          {/* GitHub Calendar container - will be filled by the library */}
          <div className="calendar-container py-2 overflow-x-auto flex justify-center">
            <div 
              ref={calendarRef} 
              className="calendar w-full min-w-[750px]"
            >
              {/* Loading message - will be replaced by the library */}
              Loading GitHub activity...
            </div>
          </div>
          
          {/* Legend and info section */}
          <GitHubContributionLegend />
        </div>
      )}
    </div>
  );
}
