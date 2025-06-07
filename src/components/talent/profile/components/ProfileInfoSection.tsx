
import React from 'react';
import ProfileContact from './ProfileContact';

interface ProfileInfoSectionProps {
  passportId: string;
  ownerAddress: string;
  bio?: string;
  socials: Record<string, string>;
}

const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({ 
  passportId, 
  ownerAddress, 
  socials = {} 
}) => {
  return (
    <div className="w-full">
      <ProfileContact 
        passportId={passportId} 
        ownerAddress={ownerAddress}
        email={socials?.email} 
        telephone={socials?.telephone}
        location={socials?.location}
        website={socials?.website || socials?.url}
      />
    </div>
  );
};

export default ProfileInfoSection;
