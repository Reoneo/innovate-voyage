
import React from 'react';

export default function GitHubContributionLegend() {
  return (
    <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
      <a href="https://docs.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile" 
         target="_blank" 
         rel="noopener noreferrer"
         className="hover:text-gray-300 hover:underline">
        Learn how we count contributions
      </a>
      
      <div className="contribution-legend flex items-center gap-1">
        <span>Less</span>
        <div className="legend-item h-3 w-3 bg-[#161b22] rounded-sm border border-[#1e262f]"></div>
        <div className="legend-item h-3 w-3 bg-[#0e4429] rounded-sm"></div>
        <div className="legend-item h-3 w-3 bg-[#006d32] rounded-sm"></div>
        <div className="legend-item h-3 w-3 bg-[#26a641] rounded-sm"></div>
        <div className="legend-item h-3 w-3 bg-[#39d353] rounded-sm"></div>
        <span>More</span>
      </div>
    </div>
  );
}
