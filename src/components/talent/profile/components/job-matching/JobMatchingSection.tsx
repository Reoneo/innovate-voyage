import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import JobMatchingModal from './JobMatchingModal';
interface JobMatchingSectionProps {
  passport: any;
  normalizedSocials: Record<string, string>;
}
const JobMatchingSection: React.FC<JobMatchingSectionProps> = ({
  passport,
  normalizedSocials
}) => {
  const [showModal, setShowModal] = useState(false);
  return <>
      <Card onClick={() => setShowModal(true)} className="p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer py-[10px] px-[8px] my-0">
        <div className="flex items-center gap-2 justify-center">
          <Briefcase className="h-4 w-4 text-gray-600" />
          <h3 className="font-semibold text-gray-800 text-sm">Job Matching</h3>
        </div>
      </Card>

      <JobMatchingModal open={showModal} onOpenChange={setShowModal} passport={passport} normalizedSocials={normalizedSocials} />
    </>;
};
export default JobMatchingSection;