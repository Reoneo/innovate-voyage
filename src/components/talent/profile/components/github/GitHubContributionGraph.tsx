
import React from 'react';
import { useGitHubContributions } from './useGitHubContributions';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import GitHubContributionHeader from './components/GitHubContributionHeader';
import GitHubCalendarRenderer from './components/GitHubCalendarRenderer';
import GitHubContributionLegend from './components/GitHubContributionLegend';
import GitHubLoadingState from './GitHubLoadingState';

interface GitHubContributionGraphProps {
  username: string;
}

const GitHubContributionGraph: React.FC<GitHubContributionGraphProps> = ({ username }) => {
  const { contributions, loading, error, stats } = useGitHubContributions(username);

  if (loading) {
    return <GitHubLoadingState />;
  }

  if (error || !contributions) {
    return null;
  }

  return (
    <Card className="bg-white/90 shadow-md rounded-lg p-4 mb-6 backdrop-blur-sm">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">GitHub Contributions</h2>
        <p className="text-sm text-gray-500">Activity over the past year</p>
      </div>
      
      <GitHubContributionHeader 
        username={username} 
        totalContributions={stats.total} 
      />
      
      <div className="p-3 mt-4 bg-gray-50 rounded-lg overflow-hidden">
        <GitHubCalendarRenderer 
          contributions={contributions} 
          username={username}
        />
      </div>
      
      <div className="mt-4 flex flex-wrap justify-between items-center">
        <GitHubContributionLegend />
        
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <span>View on GitHub</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </Card>
  );
};

export default GitHubContributionGraph;
