
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileAvatarProps {
  avatarUrl: string | undefined;
  name: string;
  userIdentity?: string; // Add userIdentity to determine if it's a .box user
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ avatarUrl, name, userIdentity }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Reset states when avatarUrl changes
  useEffect(() => {
    setImageError(false);
    setIsLoading(true);
  }, [avatarUrl]);
  
  // Check if this is a .box user
  const isDotBoxUser = userIdentity?.endsWith('.box') || false;
  
  // Generate initials for the fallback
  const getInitials = (name: string): string => {
    if (!name) return 'BP';
    const parts = name.split(/[\s-_.]+/).filter(Boolean);
    if (parts.length === 0) return name.substring(0, 2).toUpperCase();
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };
  
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
  
  return (
    <Avatar className="h-48 w-48 border-2 border-white shadow-md mx-auto relative profile-avatar">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="h-full w-full rounded-full" />
        </div>
      )}
      
      {!imageError && avatarUrl ? (
        <AvatarImage 
          src={avatarUrl} 
          alt={name} 
          className="object-cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      ) : isDotBoxUser ? (
        // For .box users without avatar, show the uploaded image
        <AvatarImage 
          src="/lovable-uploads/a6ed85ae-167e-4aa9-ba2e-c8f872954eb2.png" 
          alt={name} 
          className="object-cover"
          onError={handlePlaceholderError}
          onLoad={() => setIsLoading(false)}
        />
      ) : (
        // For .eth users and others, use the regular placeholder
        <AvatarImage 
          src="/placeholder.svg" 
          alt={name} 
          className="object-cover"
          onError={handlePlaceholderError}
          onLoad={() => setIsLoading(false)}
        />
      )}
      
      <AvatarFallback className="bg-primary/10 text-primary font-medium">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
