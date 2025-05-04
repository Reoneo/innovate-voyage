
import React, { useState } from 'react';
import { useGitHubContributions } from './useGitHubContributions';
import { useTalentProtocolGithub } from '@/hooks/useTalentProtocolGithub';
import GitHubContributions from './GitHubContributions';
import GitHubLoadingState from './GitHubLoadingState';
import GitHubContributionLegend from './components/GitHubContributionLegend';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface GitHubContributionGraphProps {
  username: string;
  walletAddress?: string;
}

const GitHubContributionGraph: React.FC<GitHubContributionGraphProps> = ({
  username,
  walletAddress
}) => {
  const { 
    loading, 
    error, 
    tokenInvalid,
    totalContributions,
    stats,
    fetchGitHubContributions 
  } = useGitHubContributions(username);
  
  const { isVerified } = useTalentProtocolGithub(walletAddress, username);
  const [year] = useState(new Date().getFullYear());

  if (!username) {
    return null;
  }

  return (
    <Card className="rounded-xl bg-[#0d1117] text-white overflow-hidden">
      <CardHeader className="pb-0 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
            <span>GitHub Contributions</span>
            <span className="text-xs text-gray-400">{username}</span>
          </CardTitle>
          <span className="text-xs text-gray-400">{year}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pb-6 bg-[#0d1117]">
        {loading ? (
          <GitHubLoadingState loading={loading} error={error || ''} />
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-400">Unable to load GitHub contributions</p>
          </div>
        ) : (
          <>
            <GitHubContributions 
              contributionsData={totalContributions} 
              stats={stats} 
            />
            <GitHubContributionLegend isVerified={isVerified} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GitHubContributionGraph;
