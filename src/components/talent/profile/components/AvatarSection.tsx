
import React from 'react';
import ProfileAvatar from './ProfileAvatar';
import ProfileBio from './ProfileBio';
import ProfileContact from './ProfileContact';

interface AvatarSectionProps {
  avatarUrl: string;
  name: string;
  bio?: string;
  ownerAddress: string;
  socials?: {
    email?: string;
    telephone?: string;
    location?: string;
    [key: string]: string | undefined;
  };
}

const AvatarSection: React.FC<AvatarSectionProps> = ({ 
  avatarUrl, 
  name, 
  bio, 
  ownerAddress,
  socials = {}
}) => {
  return (
    <div className="flex flex-col items-center md:items-start gap-2">
      <ProfileAvatar 
        avatarUrl={avatarUrl} 
        name={name} 
      />
      <ProfileContact 
        email={socials.email}
        telephone={socials.telephone}
        location={socials.location}
      />
      <ProfileBio 
        bio={bio}
        ownerAddress={ownerAddress}
      />
    </div>
  );
};

export default AvatarSection;
