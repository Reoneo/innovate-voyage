
import React, { useState } from 'react';
import GitHubContributions from './GitHubContributions';
import GitHubContributionLegend from './components/GitHubContributionLegend';

interface GitHubContributionGraphProps {
  username: string;
  hasTalentProtocolData?: boolean;
}

export default function GitHubContributionGraph({ 
  username,
  hasTalentProtocolData = false
}: GitHubContributionGraphProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-4 backdrop-blur-sm shadow-lg">
      <h2 className="text-xl font-semibold mb-2 text-white">GitHub Activity</h2>
      
      <div className="text-sm text-gray-400 mb-4">
        @{username}
      </div>
      
      <GitHubContributions 
        username={username}
        onLoadingChange={setIsLoading}
      />
      
      {!isLoading && <GitHubContributionLegend hasTalentProtocolData={hasTalentProtocolData} />}
    </div>
  );
}
