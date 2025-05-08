
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
  
  // Reset states when avatarUrl changes
  useEffect(() => {
    setImageError(false);
    setIsLoading(true);
    setFinalAvatarUrl(avatarUrl);
    
    // If no avatar and name ends with .eth, use ENS metadata preview
    if ((!avatarUrl || avatarUrl === '') && name && name.endsWith('.eth')) {
      setFinalAvatarUrl(`https://metadata.ens.domains/preview/${name}`);
    }
    
    // If name ends with .box, use the box logo as fallback
    if ((!avatarUrl || avatarUrl === '' || imageError) && name && name.endsWith('.box')) {
      setFinalAvatarUrl('/lovable-uploads/59ba9d7c-9742-4036-9b8d-1aedefc54748.png');
    }
  }, [avatarUrl, name]);
  
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
    
    // Special handling for .box domains to use box logo
    if (name && name.endsWith('.box')) {
      setFinalAvatarUrl('/lovable-uploads/59ba9d7c-9742-4036-9b8d-1aedefc54748.png');
    } 
    // Special handling for .eth domains to use ENS metadata preview
    else if (name && name.endsWith('.eth')) {
      setFinalAvatarUrl(`https://metadata.ens.domains/preview/${name}`);
    } else {
      setImageError(true);
    }
    setIsLoading(false);
  };
  
  // Handle placeholder load error
  const handlePlaceholderError = () => {
    console.log("Even placeholder failed to load");
    setImageError(true);
    setIsLoading(false);
  };
  
  return (
    <Avatar className="h-48 w-48 border-2 border-white/20 shadow-md mx-auto relative profile-avatar">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="h-full w-full rounded-full" />
        </div>
      )}
      
      {!imageError && finalAvatarUrl ? (
        <AvatarImage 
          src={finalAvatarUrl} 
          alt={name} 
          className="object-cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      ) : (
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
