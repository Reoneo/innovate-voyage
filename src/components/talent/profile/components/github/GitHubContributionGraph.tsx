
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import GitHubContributions from './GitHubContributions';
import GitHubLoadingState from './GitHubLoadingState';
import TokenInvalidAlert from './components/TokenInvalidAlert';
import { useGitHubContributions } from './useGitHubContributions';

interface GitHubContributionGraphProps {
  username: string;
}

const GitHubContributionGraph: React.FC<GitHubContributionGraphProps> = ({ username }) => {
  const { 
    contributionsData, 
    isLoading, 
    error,
    stats
  } = useGitHubContributions(username);

  // Display different states based on loading and error status
  if (isLoading) {
    return <GitHubLoadingState />;
  }

  if (error) {
    // Show token invalid message for specific error types
    if (error.message?.includes('401') || error.message?.includes('token')) {
      return (
        <Card className="rounded-lg border shadow-sm w-full">
          <CardContent className="p-6">
            <TokenInvalidAlert username={username} />
          </CardContent>
        </Card>
      );
    }
    
    // Generic error display
    return (
      <Card className="rounded-lg border shadow-sm w-full">
        <CardContent className="p-6 text-center">
          <p className="text-red-500 font-semibold">Error loading GitHub contributions</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  // Return contribution data
  return (
    <GitHubContributions 
      data={contributionsData || []} 
      stats={stats} 
    />
  );
};

export default GitHubContributionGraph;
