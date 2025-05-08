
import React from 'react';

export default function GitHubContributionLegend() {
  return (
    <div className="legend-container mt-1 mb-0 flex flex-col sm:flex-row items-center sm:justify-between text-xs text-white gap-2">
      <div className="flex items-center gap-1 justify-center">
        <img 
          src="/lovable-uploads/59ba9d7c-9742-4036-9b8d-1aedefc54748.png" 
          alt="Talent Protocol" 
          className="w-4 h-4 rounded-full" 
        />
        <span>verified by TalentProtocol.com</span>
      </div>
      
      <div className="flex items-center gap-1">
        <span className="text-white">Less</span>
        <div className="flex items-center gap-0">
          <span className="inline-block w-2 h-2 bg-gray-800 border border-gray-700 rounded-sm"></span>
          <span className="inline-block w-2 h-2 bg-[#0e4429] border border-gray-700 rounded-sm"></span>
          <span className="inline-block w-2 h-2 bg-[#006d32] border border-gray-700 rounded-sm"></span>
          <span className="inline-block w-2 h-2 bg-[#26a641] border border-gray-700 rounded-sm"></span>
          <span className="inline-block w-2 h-2 bg-[#39d353] border border-gray-700 rounded-sm"></span>
        </div>
        <span className="text-white">More</span>
      </div>
    </div>
  );
}
