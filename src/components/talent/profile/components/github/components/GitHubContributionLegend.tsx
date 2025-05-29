
import React from 'react';

export default function GitHubContributionLegend() {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <span>Less</span>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-gray-200 rounded-sm"></div>
        <div className="w-2 h-2 bg-green-200 rounded-sm"></div>
        <div className="w-2 h-2 bg-green-400 rounded-sm"></div>
        <div className="w-2 h-2 bg-green-600 rounded-sm"></div>
        <div className="w-2 h-2 bg-green-800 rounded-sm"></div>
      </div>
      <span>More</span>
    </div>
  );
}
