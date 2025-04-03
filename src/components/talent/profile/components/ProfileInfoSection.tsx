
import React from 'react';
import { truncateAddress } from '@/lib/utils';
import WorkExperienceSection from './WorkExperienceSection';
import { Button } from '@/components/ui/button';
import BiographySection from './biography/BiographySection';

interface ProfileInfoSectionProps {
  passportId: string;
  ownerAddress: string;
  ensName?: string;
  score?: number;
  bio?: string;
  socials?: Record<string, string>;
  compact?: boolean;  // Add compact prop
}

const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({
  passportId,
  ownerAddress,
  bio,
  socials,
  compact
}) => {
  return (
    <div className="flex-1">
      <div className="flex flex-col">
        {/* Skip display of certain elements when in compact mode */}
        {!compact && (
          <div className="mt-4">
            <BiographySection bio={bio} identity={ownerAddress} />
          </div>
        )}
        
        <div className="mt-auto flex flex-col gap-6">
          {!compact && <WorkExperienceSection address={ownerAddress} />}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoSection;
