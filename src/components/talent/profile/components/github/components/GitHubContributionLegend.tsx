
import React from 'react';

export default function GitHubContributionLegend() {
  return (
    <div className="legend-container mt-3 mb-1 flex items-center justify-between text-xs text-gray-400">
      <div className="flex items-center gap-1">
        <span>Less</span>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-gray-800 border border-gray-700 rounded-sm"></span>
          <span className="inline-block w-3 h-3 bg-[#0e4429] border border-gray-700 rounded-sm"></span>
          <span className="inline-block w-3 h-3 bg-[#006d32] border border-gray-700 rounded-sm"></span>
          <span className="inline-block w-3 h-3 bg-[#26a641] border border-gray-700 rounded-sm"></span>
          <span className="inline-block w-3 h-3 bg-[#39d353] border border-gray-700 rounded-sm"></span>
        </div>
        <span>More</span>
      </div>
      
      <div>
        <a 
          href="https://talentprotocol.com"
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-gray-300 hover:underline"
        >
          <img 
            src="/talent-protocol-logo.png" 
            alt="Talent Protocol" 
            className="w-4 h-4 rounded-full" 
          />
          <span>verified by TalentProtocol.com</span>
        </a>
      </div>
    </div>
  );
}
