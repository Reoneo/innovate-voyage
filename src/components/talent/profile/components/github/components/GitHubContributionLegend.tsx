
import React from 'react';

export default function GitHubContributionLegend() {
  return (
    <div className="legend-container mt-0 mb-0 flex flex-col items-center justify-between text-xs text-white">
      <div className="mb-2 w-full text-center">
        <span className="flex items-center gap-1 justify-center">
          <img 
            src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/40d7073c-ed54-450e-874c-6e2255570950/logomark_dark.jpg?table=block&id=403db4f5-f028-4827-b704-35095d3bdd15&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1746352800000&signature=frawmQ9xQrLK3ZrZjgZF_1xikkcEiRagAcoptrI4vQY&downloadName=logomark_dark.jpg" 
            alt="Talent Protocol" 
            className="w-4 h-4 rounded-full" 
          />
          <span>verified by TalentProtocol.com</span>
        </span>
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
