
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="w-full space-y-6">
      {/* Bio section - only render if bio exists */}
      {bio && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">About</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{bio}</p>
          </CardContent>
        </Card>
      )}
      
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
