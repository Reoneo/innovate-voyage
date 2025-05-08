
import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfileAvatarProps {
  avatarUrl: string | undefined;
  name: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ avatarUrl, name }) => {
  const [imageError, setImageError] = useState(false);
  const placeholderUrl = '/placeholder.svg';
  
  // Generate initials for the fallback
  const getInitials = (name: string): string => {
    if (!name) return 'BP';
    const parts = name.split(/[\s-_.]+/).filter(Boolean);
    if (parts.length === 0) return name.substring(0, 2).toUpperCase();
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };
  
  // Handle image load error
  const handleImageError = () => {
    console.log('Avatar image failed to load:', avatarUrl);
    setImageError(true);
  };
  
  return (
    <Avatar className="h-48 w-48 border-2 border-white shadow-md mx-auto"> {/* Increased size and centered */}
      {!imageError && avatarUrl ? (
        <AvatarImage 
          src={avatarUrl} 
          alt={name} 
          className="object-cover"
          onError={handleImageError}
        />
      ) : (
        <AvatarImage 
          src={placeholderUrl} 
          alt={name} 
          className="object-cover"
          onError={() => console.log("Even placeholder failed to load")}
        />
      )}
      <AvatarFallback className="bg-primary/10 text-primary font-medium">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
