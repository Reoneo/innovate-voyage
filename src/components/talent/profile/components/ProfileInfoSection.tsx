
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ProfileContact from './ProfileContact';
import EnsLink from '../tabs/social/EnsLink';

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
  // Check if passportId is an ENS name
  const isEns = passportId?.includes('.eth') || passportId?.includes('.box');
  
  return (
    <div className="w-full">
      {isEns && (
        <div className="mb-4">
          <EnsLink ensName={passportId} />
        </div>
      )}
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
