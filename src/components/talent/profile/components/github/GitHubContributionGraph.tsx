
import React from 'react';
import { GitHubContributionProps } from './types';
import GitHubLoadingState from './GitHubLoadingState';
import GitHubContributionHeader from './components/GitHubContributionHeader';
import GitHubContributionLegend from './components/GitHubContributionLegend';
import GitHubCalendarRenderer from './components/GitHubCalendarRenderer';
import TokenInvalidAlert from './components/TokenInvalidAlert';
import StatsDisplay from './components/StatsDisplay';
import { useGitHubCalendar } from './hooks/useGitHubCalendar';

declare global {
  interface Window {
    GitHubCalendar: (selector: string, username: string, options?: any) => void;
  }
}

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
          
          {/* Container for GitHub Calendar */}
          <GitHubCalendarRenderer 
            username={username}
            totalContributions={totalContributions}
            statsTotal={stats.total}
          />
          
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
