
import React from 'react';
import GitHubCalendar from 'react-github-calendar';
import { GitHubContributionData } from './types';
import { GitHubCalendarRenderer } from './components/GitHubCalendarRenderer';
import { GitHubContributionHeader } from './components/GitHubContributionHeader';
import { GitHubContributionLegend } from './components/GitHubContributionLegend';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { StatsDisplay } from './components/StatsDisplay';
import { TokenInvalidAlert } from './components/TokenInvalidAlert';

interface GitHubContributionGraphProps {
  githubData?: GitHubContributionData | null;
  isLoading?: boolean;
  hideVerificationBadge?: boolean;
}

const GitHubContributionGraph: React.FC<GitHubContributionGraphProps> = ({
  githubData,
  isLoading = false,
  hideVerificationBadge = false
}) => {
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-2 mb-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <Skeleton className="h-[115px] w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    );
  }

  if (!githubData || !githubData.username) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-400">No GitHub data available</p>
      </div>
    );
  }

  if (githubData.error) {
    return <TokenInvalidAlert message={githubData.error} />;
  }

  const { username, contributionCalendar } = githubData;

  if (!contributionCalendar || !contributionCalendar.weeks) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-400">GitHub data could not be loaded</p>
      </div>
    );
  }

  // Extract contribution data
  const values = contributionCalendar.weeks.flatMap(week => 
    week.contributionDays.map(day => ({
      date: day.date,
      count: day.contributionCount,
      level: day.contributionLevel
    }))
  );

  // Custom tooltip for the contribution graph
  const tooltip = ({ date, count }: { date: string; count: number }) => (
    <TooltipContent className="font-mono text-xs">
      <div className="font-medium">{count} contributions</div>
      <div className="text-gray-300">{new Date(date).toDateString()}</div>
    </TooltipContent>
  );

  return (
    <div className="p-4 rounded-lg">
      <GitHubContributionHeader 
        username={username} 
        hideVerificationBadge={hideVerificationBadge}
      />
      
      <div className="mt-4">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <GitHubCalendar
              username={username}
              values={values}
              children={<GitHubCalendarRenderer />}
              renderBlock={(block, activity) => React.cloneElement(block, {
                'data-tooltip-id': 'github-tooltip',
                'data-level': activity.level,
              })}
              colorScheme="dark"
              labels={{
                months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                totalCount: '{{count}} contributions in the last year',
              }}
              style={{
                '--color-calendar-graph-day-L1-bg': 'rgba(0, 168, 120, 0.15)',
                '--color-calendar-graph-day-L2-bg': 'rgba(0, 168, 120, 0.40)',
                '--color-calendar-graph-day-L3-bg': 'rgba(0, 168, 120, 0.70)',
                '--color-calendar-graph-day-L4-bg': 'rgba(0, 168, 120, 1.0)',
                fontSize: '12px',
                color: '#FFF',
              } as React.CSSProperties}
              blockMargin={4}
              blockSize={10}
              theme={{
                level0: '#2d333b',
                level1: 'rgba(0, 168, 120, 0.15)',
                level2: 'rgba(0, 168, 120, 0.40)',
                level3: 'rgba(0, 168, 120, 0.70)',
                level4: 'rgba(0, 168, 120, 1.0)',
              }}
              tooltipRenderer={tooltip}
            />
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="mt-3 flex justify-between">
        <StatsDisplay 
          contributions={githubData.contributionStats?.totalContributions || 0} 
          repositories={githubData.contributionStats?.totalRepositories || 0}
        />
        <GitHubContributionLegend />
      </div>
    </div>
  );
};

export default GitHubContributionGraph;
