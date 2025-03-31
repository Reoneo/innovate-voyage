
import React from 'react';
import AvatarSection from './components/AvatarSection';
import DraggableTile from '@/components/ui/draggable-tile';
import { User } from 'lucide-react';

interface ProfileHeaderProps {
  passport: {
    passport_id: string;
    owner_address: string;
    avatar_url: string;
    name: string;
    score: number;
    category: string;
    socials: {
      github?: string;
      twitter?: string;
      linkedin?: string;
      website?: string;
      email?: string;
      facebook?: string;
      instagram?: string;
      youtube?: string;
      bluesky?: string;
      telegram?: string;
      discord?: string;
      telephone?: string;
      location?: string;
    };
    bio?: string;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ passport }) => {
  return (
    <DraggableTile 
      title="Profile Information" 
      defaultPosition={{ x: 20, y: 20 }}
      defaultSize={{ width: 780, height: 120 }}
      icon={<User className="h-4 w-4" />}
    >
      <div className="flex flex-row items-start gap-6">
        <AvatarSection 
          avatarUrl={passport.avatar_url}
          name={passport.name}
          ownerAddress={passport.owner_address}
          socials={passport.socials}
        />
      </div>
    </DraggableTile>
  );
};

export default ProfileHeader;
