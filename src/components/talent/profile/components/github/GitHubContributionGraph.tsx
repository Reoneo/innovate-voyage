
import React from 'react';
import { SkeletonCard } from '@/components/ui/skeleton';
import { useGitHubContributions } from './useGitHubContributions';
import { useToast } from '@/hooks/use-toast';
import GitHubContributions from './GitHubContributions';
import GitHubLoadingState from './GitHubLoadingState';
import TokenInvalidAlert from './components/TokenInvalidAlert';

interface GitHubContributionGraphProps {
  username: string;
}

const GitHubContributionGraph: React.FC<GitHubContributionGraphProps> = ({ username }) => {
  const {
    contributionsData,
    error,
    isLoading,
    isTokenInvalid,
    refetch
  } = useGitHubContributions(username);

  const { toast } = useToast();

  if (isLoading) {
    return <GitHubLoadingState />;
  }

  if (isTokenInvalid) {
    return <TokenInvalidAlert onRefresh={refetch} />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border p-4 h-full min-h-[200px] flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold mb-2">GitHub API Error</h3>
        <p className="text-muted-foreground mb-3">
          Could not fetch GitHub contributions for @{username}
        </p>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-w-full">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    );
  }

  if (contributionsData) {
    return <GitHubContributions data={contributionsData} username={username} />;
  }

  return <SkeletonCard className="h-[250px]" />;
};

export default GitHubContributionGraph;
