
import React from 'react';

interface GitHubContributionLegendProps {
  hasTalentProtocolData?: boolean;
}

export default function GitHubContributionLegend({ hasTalentProtocolData = false }: GitHubContributionLegendProps) {
  return (
    <div className="legend-container mt-1 mb-0 flex items-center justify-between text-xs text-white">
      <div className="flex items-center gap-1 justify-center">
        {hasTalentProtocolData && (
          <span>verified by TalentProtocol.com</span>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        <span>Less</span>
        <div className="flex items-center gap-0">
          <span className="inline-block w-2 h-2 bg-gray-800 border border-gray-700 rounded-sm"></span>
          <span className="inline-block w-2 h-2 bg-[#0e4429] border border-gray-700 rounded-sm"></span>
          <span className="inline-block w-2 h-2 bg-[#006d32] border border-gray-700 rounded-sm"></span>
          <span className="inline-block w-2 h-2 bg-[#26a641] border border-gray-700 rounded-sm"></span>
          <span className="inline-block w-2 h-2 bg-[#39d353] border border-gray-700 rounded-sm"></span>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
