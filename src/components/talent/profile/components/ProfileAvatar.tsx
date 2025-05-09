
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileAvatarProps {
  avatarUrl: string | undefined;
  name: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ avatarUrl, name }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Reset states when avatarUrl changes
  useEffect(() => {
    setImageError(false);
    setIsLoading(true);
  }, [avatarUrl]);
  
  // Generate initials for the fallback
  const getInitials = (name: string): string => {
    if (!name) return 'BP';
    const parts = name.split(/[\s-_.]+/).filter(Boolean);
    if (parts.length === 0) return name.substring(0, 2).toUpperCase();
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // Check if the avatar is for a .box domain
  const isBoxDomain = name?.toLowerCase().endsWith('.box');
  
  // Handle image load success
  const handleImageLoad = () => {
    console.log('Avatar image loaded successfully:', avatarUrl);
    setIsLoading(false);
  };
  
  // Handle image load error
  const handleImageError = () => {
    console.log('Avatar image failed to load:', avatarUrl);
    setImageError(true);
    setIsLoading(false);
  };
  
  // Handle placeholder load error
  const handlePlaceholderError = () => {
    console.log("Even placeholder failed to load");
    setIsLoading(false);
  };

  // Special class for .box avatars to ensure square shape vs circular default
  const avatarClass = isBoxDomain 
    ? "h-48 w-48 border-2 border-white shadow-md mx-auto relative profile-avatar rounded-md" 
    : "h-48 w-48 border-2 border-white shadow-md mx-auto relative profile-avatar";
    
  // Special class for .box avatars to ensure 1:1 ratio
  const avatarImageClass = isBoxDomain 
    ? "object-cover aspect-square rounded-md" 
    : "object-cover";
  
  return (
    <Avatar className={avatarClass}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className={`h-full w-full ${isBoxDomain ? 'rounded-md' : 'rounded-full'}`} />
        </div>
      )}
      
      {!imageError && avatarUrl ? (
        <AvatarImage 
          src={avatarUrl} 
          alt={name} 
          className={avatarImageClass}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      ) : (
        <AvatarImage 
          src="/placeholder.svg" 
          alt={name} 
          className={isBoxDomain ? "object-cover rounded-md" : "object-cover"}
          onError={handlePlaceholderError}
          onLoad={() => setIsLoading(false)}
        />
      )}
      
      <AvatarFallback className={`bg-primary/10 text-primary font-medium ${isBoxDomain ? 'rounded-md' : ''}`}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
