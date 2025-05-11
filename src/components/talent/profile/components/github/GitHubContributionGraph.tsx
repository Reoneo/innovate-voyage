
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useGitHubContributions } from './useGitHubContributions';
import GitHubContributions from './GitHubContributions';
import GitHubLoadingState from './GitHubLoadingState';
import GitHubContributionHeader from './components/GitHubContributionHeader';
import GitHubContributionLegend from './components/GitHubContributionLegend';

interface GitHubContributionGraphProps {
  username: string;
}

const GitHubContributionGraph: React.FC<GitHubContributionGraphProps> = ({ username }) => {
  const { loading, error, tokenInvalid, totalContributions, stats, fetchGitHubContributions } = useGitHubContributions();
  
  useEffect(() => {
    if (username) {
      fetchGitHubContributions(username);
    }
  }, [username, fetchGitHubContributions]);
  
  return (
    <Card className="overflow-hidden bg-white/90 shadow-md rounded-lg backdrop-blur-sm">
      <CardHeader className="p-4 border-b border-gray-100">
        <GitHubContributionHeader 
          username={username}
          totalContributions={totalContributions}
          stats={stats}
        />
      </CardHeader>
      
      <CardContent className="p-4 pb-2 overflow-x-auto bg-gray-900">
        {loading ? (
          <GitHubLoadingState loading={loading} error={error} />
        ) : error ? (
          <GitHubLoadingState loading={loading} error={error} />
        ) : tokenInvalid ? (
          <div className="py-4">
            <p className="text-center text-gray-300">
              GitHub token is invalid or expired. Please check your configuration.
            </p>
          </div>
        ) : (
          <>
            <GitHubContributions username={username} />
            <GitHubContributionLegend />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GitHubContributionGraph;
