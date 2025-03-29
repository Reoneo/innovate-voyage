
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfileAvatarProps {
  avatarUrl: string | undefined;
  name: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ avatarUrl, name }) => {
  return (
    <Avatar className="h-24 w-24">
      <AvatarImage src={avatarUrl || '/placeholder.svg'} alt={name} />
      <AvatarFallback>{name?.substring(0, 2)?.toUpperCase() || 'BP'}</AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
