
import React from 'react';
import ProfileAvatar from './ProfileAvatar';
import ProfileInfo from './ProfileInfo';

interface AvatarSectionProps {
  avatarUrl: string;
  name: string;
  ownerAddress: string;
  socials?: Record<string, string>;
  bio?: string;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({ 
  avatarUrl, 
  name, 
  ownerAddress, 
  socials = {}, 
  bio 
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-5 w-full">
      <div className="flex-shrink-0">
        <ProfileAvatar avatarUrl={avatarUrl} name={name} />
      </div>
      <div className="flex-1 space-y-2">
        <ProfileInfo 
          passportId={name} 
          ownerAddress={ownerAddress}
          bio={bio}
          socials={socials}
        />
      </div>
    </div>
  );
};

export default AvatarSection;
