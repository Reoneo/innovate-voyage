
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
  const [showFallback, setShowFallback] = useState(false);
  
  // Reset states when avatarUrl changes
  useEffect(() => {
    setImageError(false);
    setIsLoading(true);
    setShowFallback(false);
    
    // If no avatar URL, show fallback immediately
    if (!avatarUrl) {
      setShowFallback(true);
      setIsLoading(false);
    }
    
    // Start a timeout to show fallback anyway if loading takes too long
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log('Avatar load timeout - showing fallback');
        setShowFallback(true);
        setIsLoading(false);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [avatarUrl]);
  
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
    setShowFallback(true);
  };
  
  return (
    <Avatar className="h-48 w-48 border-2 border-white shadow-md mx-auto relative profile-avatar">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="h-full w-full rounded-full" />
        </div>
      )}
      
      {/* Only try to load avatar if URL exists and has not errored */}
      {!imageError && avatarUrl && (
        <AvatarImage 
          src={avatarUrl} 
          alt={name} 
          className="object-cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}
      
      {/* Show fallback immediately if no URL or error */}
      {showFallback && (
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          {getInitials(name)}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default ProfileAvatar;
