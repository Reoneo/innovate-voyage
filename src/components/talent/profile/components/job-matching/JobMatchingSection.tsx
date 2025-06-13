
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import JobPreferencesModal, { JobPreferences } from './JobPreferencesModal';
import JobMatchingModal from './JobMatchingModal';

interface JobMatchingSectionProps {
  passport: any;
  normalizedSocials: Record<string, string>;
}

const JobMatchingSection: React.FC<JobMatchingSectionProps> = ({
  passport,
  normalizedSocials
}) => {
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showJobsModal, setShowJobsModal] = useState(false);
  const [jobPreferences, setJobPreferences] = useState<JobPreferences | null>(null);

  const handlePreferencesSubmit = (preferences: JobPreferences) => {
    setJobPreferences(preferences);
    setShowPreferencesModal(false);
    setShowJobsModal(true);
  };

  const handleBackToPreferences = () => {
    setShowJobsModal(false);
    setShowPreferencesModal(true);
  };

  return (
    <>
      <Card 
        onClick={() => setShowPreferencesModal(true)} 
        className="p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer py-[17px]"
      >
        <div className="flex items-center gap-2 justify-center mx-0 px-0 my-0">
          <h3 className="font-semibold text-gray-800 text-base">Job Matching</h3>
        </div>
      </Card>

      <JobPreferencesModal 
        open={showPreferencesModal} 
        onOpenChange={setShowPreferencesModal}
        onPreferencesSubmit={handlePreferencesSubmit}
      />

      <JobMatchingModal 
        open={showJobsModal} 
        onOpenChange={setShowJobsModal} 
        passport={passport} 
        normalizedSocials={normalizedSocials}
        jobPreferences={jobPreferences}
        onBackToPreferences={handleBackToPreferences}
      />
    </>
  );
};

export default JobMatchingSection;
