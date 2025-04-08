
import React from 'react';

const SkillsLegendSection: React.FC = () => {
  return (
    <div className="mt-4 border-t pt-3">
      <h4 className="text-sm font-medium mb-2">Legend:</h4>
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>
          <span>Verified Skill</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-400 mr-1.5"></div>
          <span>Unverified Skill</span>
        </div>
      </div>
    </div>
  );
};

export default SkillsLegendSection;
