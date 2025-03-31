
import React from 'react';
import ProfileAvatar from './ProfileAvatar';
import ProfileSocialLinks from './social/ProfileSocialLinks';
import { Card, CardContent } from '@/components/ui/card';
import ProfileBio from './ProfileBio';

interface AvatarSectionProps {
  avatarUrl: string;
  name: string;
  bio?: string | null;
  ownerAddress: string;
  socials?: Record<string, string>;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({ 
  avatarUrl, 
  name, 
  bio, 
  ownerAddress,
  socials 
}) => {
  return (
    <div className="flex flex-col items-center space-y-4 w-full md:w-auto">
      <ProfileAvatar 
        avatarUrl={avatarUrl}
        name={name}
        address={ownerAddress}
      />
      
      {bio && (
        <div className="w-full mt-6 mb-8"> {/* Increased margin top and bottom */}
          <ProfileBio bio={bio} />
        </div>
      )}
      
      {socials && Object.keys(socials).length > 0 && (
        <ProfileSocialLinks socials={socials} />
      )}
    </div>
  );
};

export default AvatarSection;
