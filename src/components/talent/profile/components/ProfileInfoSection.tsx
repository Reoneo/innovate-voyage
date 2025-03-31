
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ProfileBio from './ProfileBio';
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
  bio,
  socials 
}) => {
  return (
    <Card className="w-full">
      <CardContent className="p-4 space-y-4">
        <ProfileBio 
          bio={bio} 
          ownerAddress={ownerAddress} 
          socials={socials}
        />
        <ProfileContact 
          passportId={passportId} 
          ownerAddress={ownerAddress}
          email={socials?.email} 
          telephone={socials?.telephone}
          location={socials?.location}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileInfoSection;
