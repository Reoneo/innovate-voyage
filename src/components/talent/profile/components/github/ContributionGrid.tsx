
import React from 'react';
import { ContributionData } from './types';

interface ContributionGridProps {
  contributionData: ContributionData;
}

export default function ContributionGrid({ contributionData }: ContributionGridProps) {
  // Generate days of the week labels
  const daysOfWeek = ['Mon', 'Wed', 'Fri'];

  // Generate month labels
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Helper function to get level class
  const getLevelClass = (level: number) => {
    switch(level) {
      case 0: return 'bg-gray-800';
      case 1: return 'bg-green-900';
      case 2: return 'bg-green-700';
      case 3: return 'bg-green-600';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-800';
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <div className="text-white text-lg mb-4">
        {contributionData.totalContributions} contributions in the last year
      </div>
      
      <div className="relative overflow-x-auto">
        {/* Month labels */}
        <div className="flex mb-2">
          <div className="w-8"></div> {/* Spacer for day labels */}
          <div className="flex flex-1 justify-between">
            {months.map((month, i) => (
              <div key={i} className="text-sm text-gray-400">{month}</div>
            ))}
          </div>
        </div>
        
        {/* Contribution grid with day labels */}
        <div className="flex">
          {/* Day of week labels */}
          <div className="flex flex-col justify-between pr-2">
            {daysOfWeek.map((day, i) => (
              <div key={i} className="h-4 text-xs text-gray-400">{day}</div>
            ))}
          </div>
          
          {/* Contribution grid */}
          {contributionData.weeks.length > 0 ? (
            <div className="flex flex-1 gap-1">
              {contributionData.weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.contributionDays.map((day, dayIndex) => (
                    <div 
                      key={dayIndex} 
                      className={`w-3 h-3 rounded-sm ${getLevelClass(day.level)}`}
                      title={`${day.count} contributions on ${day.date}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-sm">No contribution data available</div>
          )}
        </div>
        
        {/* Legend */}
        <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
          <div>Learn how we count contributions</div>
          <div className="flex items-center gap-1">
            <span>Less</span>
            <div className={`w-3 h-3 rounded-sm ${getLevelClass(0)}`}></div>
            <div className={`w-3 h-3 rounded-sm ${getLevelClass(1)}`}></div>
            <div className={`w-3 h-3 rounded-sm ${getLevelClass(2)}`}></div>
            <div className={`w-3 h-3 rounded-sm ${getLevelClass(3)}`}></div>
            <div className={`w-3 h-3 rounded-sm ${getLevelClass(4)}`}></div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
