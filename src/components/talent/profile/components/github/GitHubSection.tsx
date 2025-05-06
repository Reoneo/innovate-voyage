
import React from 'react';
import GitHubContributionGraph from './GitHubContributionGraph';

interface GitHubSectionProps {
  githubUsername: string | null;
}

const GitHubSection: React.FC<GitHubSectionProps> = ({ githubUsername }) => {
  if (!githubUsername) {
    return null;
  }
  
  return (
    <div className="mt-4">
      <GitHubContributionGraph username={githubUsername} />
    </div>
  );
};

export default GitHubSection;
