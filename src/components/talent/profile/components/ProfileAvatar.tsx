
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfileAvatarProps {
  avatarUrl: string | undefined;
  name: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ avatarUrl, name }) => {
  return (
    <Avatar className="h-40 w-40 border-2 border-white shadow-md">
      <AvatarImage src={avatarUrl || '/placeholder.svg'} alt={name} className="object-cover" />
      <AvatarFallback className="bg-primary/10 text-primary font-medium">
        {name?.substring(0, 2)?.toUpperCase() || 'BP'}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
