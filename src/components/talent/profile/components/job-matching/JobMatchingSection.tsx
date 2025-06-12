
import React from 'react';
import { Card } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

interface JobMatchingSectionProps {
  passport: any;
  normalizedSocials: Record<string, string>;
}

const JobMatchingSection: React.FC<JobMatchingSectionProps> = ({
  passport,
  normalizedSocials
}) => {
  return (
    <Card className="p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <div className="flex items-center gap-2 mb-3">
        <Briefcase className="h-4 w-4 text-gray-600" />
        <h3 className="font-semibold text-gray-800 text-sm">Job Matching</h3>
      </div>
      <div className="text-xs text-gray-600">
        Find relevant opportunities based on your profile
      </div>
    </Card>
  );
};

export default JobMatchingSection;
