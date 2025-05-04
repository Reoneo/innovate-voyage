
import React from 'react';

export default function GitHubContributionLegend() {
  return (
    <div className="flex flex-col items-center space-y-2 mb-2">
      {/* Verification text now appears above everything else without a link */}
      <div className="text-center mb-2">
        <span className="text-white text-xs">verified by TalentProtocol.com</span>
      </div>
      
      <div className="legend-container flex items-center justify-between text-xs text-white w-full">
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
    </div>
  );
}
