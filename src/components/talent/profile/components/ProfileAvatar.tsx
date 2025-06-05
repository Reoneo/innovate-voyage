
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
  const [finalAvatarUrl, setFinalAvatarUrl] = useState<string | undefined>(avatarUrl);
  
  // Check if this is a .box user
  const isBoxUser = name.endsWith('.box');
  
  // Reset states when avatarUrl changes
  useEffect(() => {
    setImageError(false);
    setIsLoading(true);
    
    // For .box users, use community avatar as fallback if no avatar provided
    if (isBoxUser && (!avatarUrl || avatarUrl === '')) {
      setFinalAvatarUrl('/lovable-uploads/dc30762d-edb6-4e72-abf3-e78015f90b1d.png');
    } else {
      setFinalAvatarUrl(avatarUrl);
    }
  }, [avatarUrl, isBoxUser]);
  
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
    console.log('Avatar image loaded successfully:', finalAvatarUrl);
    setIsLoading(false);
  };
  
  // Handle image load error
  const handleImageError = () => {
    console.log('Avatar image failed to load:', finalAvatarUrl);
    
    // For .box users, try the community avatar as fallback
    if (isBoxUser && finalAvatarUrl !== '/lovable-uploads/dc30762d-edb6-4e72-abf3-e78015f90b1d.png') {
      setFinalAvatarUrl('/lovable-uploads/dc30762d-edb6-4e72-abf3-e78015f90b1d.png');
      return;
    }
    
    setImageError(true);
    setIsLoading(false);
  };
  
  // Handle placeholder load error
  const handlePlaceholderError = () => {
    console.log("Even placeholder failed to load");
    setIsLoading(false);
  };
  
  return (
    <Avatar className="h-56 w-56 border-2 border-white shadow-md mx-auto relative profile-avatar rounded-lg">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      )}
      
      {!imageError && finalAvatarUrl ? (
        <AvatarImage 
          src={finalAvatarUrl} 
          alt={name} 
          className="object-cover rounded-lg"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      ) : (
        <AvatarImage 
          src="/placeholder.svg" 
          alt={name} 
          className="object-cover rounded-lg"
          onError={handlePlaceholderError}
          onLoad={() => setIsLoading(false)}
        />
      )}
      
      <AvatarFallback className="bg-primary/10 text-primary font-medium rounded-lg">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
