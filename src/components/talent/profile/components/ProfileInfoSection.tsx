
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ProfileContact from './ProfileContact';
import SocialMediaLinks from '../tabs/social/SocialMediaLinks';

interface ProfileInfoSectionProps {
  passportId: string;
  ownerAddress: string;
  bio?: string;
  socials: Record<string, string>;
}

const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({ 
  passportId, 
  ownerAddress, 
  socials 
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Contact information section */}
      <ProfileContact 
        passportId={passportId} 
        ownerAddress={ownerAddress}
        email={socials?.email} 
        telephone={socials?.telephone}
        location={socials?.location}
      />
    </div>
  );
};

export default ProfileInfoSection;
