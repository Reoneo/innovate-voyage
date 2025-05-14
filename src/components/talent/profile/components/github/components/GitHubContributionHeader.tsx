
import React from 'react';

interface GitHubContributionHeaderProps {
  username: string;
  totalContributions: number | null;
}

export default function GitHubContributionHeader({ 
  totalContributions, 
  username 
}: GitHubContributionHeaderProps) {
  return (
    <div className="contributions-header flex items-center justify-between mb-4">
      <h3 className="text-xl font-medium text-gray-200">
        <span id={`${username}-total-contrib`}>{totalContributions || 0}</span> contributions in the last year
      </h3>
      <div className="contribution-settings text-gray-400 text-sm">
        Contribution settings ▼
      </div>
    </div>
  );
}
