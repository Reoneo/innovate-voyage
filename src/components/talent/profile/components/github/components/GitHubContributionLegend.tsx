
import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";

export default function GitHubContributionLegend() {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex items-center gap-1 sm:gap-2 ${isMobile ? 'text-xs' : 'text-xs'} text-black`}>
      <span>Less</span>
      <div className="flex gap-0.5 sm:gap-1">
        <div className={`${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-white border border-gray-300 rounded-sm`}></div>
        <div className={`${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-gray-300 rounded-sm`}></div>
        <div className={`${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-gray-500 rounded-sm`}></div>
        <div className={`${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-gray-700 rounded-sm`}></div>
        <div className={`${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-black rounded-sm`}></div>
      </div>
      <span>More</span>
    </div>
  );
}
