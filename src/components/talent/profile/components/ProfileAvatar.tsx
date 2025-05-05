
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfileAvatarProps {
  avatarUrl: string | undefined;
  name: string;
  size?: string; // Add optional size prop
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
  avatarUrl, 
  name,
  size = "large" // Default to large if not specified
}) => {
  // Determine avatar size based on the size prop
  const sizeClasses = 
    size === "large" ? "h-48 w-48" : 
    size === "medium" ? "h-32 w-32" : 
    size === "small" ? "h-24 w-24" : 
    "h-48 w-48"; // Default to large
    
  return (
    <Avatar className={`${sizeClasses} border-2 border-white shadow-md mx-auto`}>
      <AvatarImage src={avatarUrl || '/placeholder.svg'} alt={name} className="object-cover" />
      <AvatarFallback className="bg-primary/10 text-primary font-medium">
        {name?.substring(0, 2)?.toUpperCase() || 'BP'}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
