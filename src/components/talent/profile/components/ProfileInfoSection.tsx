
import React from 'react';
import ProfileInfo from './ProfileInfo';

interface ProfileInfoSectionProps {
  passportId: string;
  ownerAddress: string;
  bio?: string;
  socials: Record<string, string>;
}

const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({ 
  passportId, 
  ownerAddress, 
  bio, 
  socials 
}) => {
  return (
    <div className="flex-1 text-left">
      <div className="flex flex-col items-start justify-between gap-4">
        <ProfileInfo 
          passportId={passportId}
          ownerAddress={ownerAddress}
          bio={bio}
          socials={socials}
        />
      </div>
    </div>
  );
};

export default ProfileInfoSection;
