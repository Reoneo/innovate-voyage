
import React from 'react';

export default function GitHubContributionLegend() {
  return (
    <div className="flex items-center gap-2 text-xs text-black">
      <span>Less</span>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-white border border-gray-300 rounded-sm"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-sm"></div>
        <div className="w-2 h-2 bg-gray-700 rounded-sm"></div>
        <div className="w-2 h-2 bg-black rounded-sm"></div>
      </div>
      <span>More</span>
    </div>
  );
}
