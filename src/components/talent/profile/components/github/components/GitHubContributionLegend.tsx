
import React from 'react';

export default function GitHubContributionLegend() {
  return (
    <div className="flex items-center justify-between w-full mt-1 mb-0 text-xs text-white">
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
  );
}
