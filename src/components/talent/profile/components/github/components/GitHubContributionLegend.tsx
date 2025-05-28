import React from 'react';
export default function GitHubContributionLegend() {
  return <div className="legend-container mt-1 mb-0 flex items-center justify-between text-xs text-white px-[240px] my-0 py-[5px]">
      <div className="flex items-center gap-1 justify-center">
        
        
      </div>
      
      <div className="flex items-center gap-1 px-[3px] py-0 my-0 mx-0">
        <span className="text-slate-950">Less</span>
        <div className="flex items-center gap-0">
          <span className="inline-block w-2 h-2 bg-gray-800 border border-gray-700 rounded-sm"></span>
          <span className="inline-block w-2 h-2 bg-[#0e4429] border border-gray-700 rounded-sm"></span>
          <span className="inline-block w-2 h-2 bg-[#006d32] border border-gray-700 rounded-sm"></span>
          <span className="inline-block w-2 h-2 bg-[#26a641] border border-gray-700 rounded-sm"></span>
          <span className="inline-block w-2 h-2 bg-[#39d353] border border-gray-700 rounded-sm"></span>
        </div>
        <span className="text-slate-950">More</span>
      </div>
    </div>;
}