
import React from 'react';
import ProfileAvatar from './ProfileAvatar';
import ProfileBio from './ProfileBio';

interface AvatarSectionProps {
  avatarUrl: string;
  name: string;
  bio?: string;
  ownerAddress: string;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({ 
  avatarUrl, 
  name, 
  bio, 
  ownerAddress 
}) => {
  return (
    <div className="flex flex-col items-center md:items-start gap-2">
      <ProfileAvatar 
        avatarUrl={avatarUrl} 
        name={name} 
      />
      <ProfileBio 
        bio={bio}
        ownerAddress={ownerAddress}
      />
    </div>
  );
};

export default AvatarSection;
