
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfileAvatarProps {
  avatarUrl: string | undefined;
  name: string;
  onError?: () => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ avatarUrl, name, onError }) => {
  // Get initials for fallback
  const getInitials = (name: string): string => {
    if (!name) return 'BP';
    
    // For ENS names, use the first part before the period
    if (name.includes('.')) {
      const firstPart = name.split('.')[0];
      return firstPart.substring(0, 2).toUpperCase();
    }
    
    // For addresses, use first and last characters
    if (name.startsWith('0x') && name.length > 6) {
      return `${name[2].toUpperCase()}${name[name.length-1].toUpperCase()}`;
    }
    
    // Default case - first two characters
    return name.substring(0, 2).toUpperCase();
  };
  
  // Generate a specific background color based on the name
  const getColorClass = (name: string): string => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      'bg-purple-100 text-purple-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
    ];
    return colors[hash % colors.length];
  };

  return (
    <Avatar className="h-48 w-48 border-2 border-white shadow-md mx-auto"> 
      {avatarUrl ? (
        <AvatarImage 
          src={avatarUrl} 
          alt={name} 
          className="object-cover" 
          onError={onError}
        />
      ) : null}
      <AvatarFallback className={`text-2xl font-bold ${getColorClass(name)}`}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
