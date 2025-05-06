
import React from 'react';
import LinkedInExperienceSection from '../LinkedInExperienceSection';
import WorkExperienceSection from '../WorkExperienceSection';
import { useLinkedInExperience } from '@/api/services/linkedinService';

interface WorkSectionProps {
  socials?: Record<string, string>;
  ownerAddress?: string;
}

const WorkSection: React.FC<WorkSectionProps> = ({ socials, ownerAddress }) => {
  // Fetch LinkedIn work experience
  const { experience, isLoading: isLoadingExperience, error: experienceError } = 
    useLinkedInExperience(socials);
  
  console.log('LinkedIn experience data:', { 
    experience, 
    isLoading: isLoadingExperience, 
    error: experienceError,
    linkedinValue: socials?.linkedin 
  });

  return (
    <div className="space-y-6">
      {/* LinkedIn work experience section - now labeled "Work Experience" */}
      <div className="mt-4">
        <LinkedInExperienceSection 
          experience={experience} 
          isLoading={isLoadingExperience} 
          error={experienceError} 
          showLinkedinLogo={true}
        />
      </div>

      {/* Added Work Experience section that uses local storage and appears when logged in */}
      {ownerAddress && (
        <WorkExperienceSection ownerAddress={ownerAddress} />
      )}
    </div>
  );
};

export default WorkSection;
