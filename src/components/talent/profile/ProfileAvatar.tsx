
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getEnsAvatarUrl } from '@/api/services/ens/operations/recordOperations';

interface ProfileAvatarProps {
  avatarUrl: string | undefined;
  name: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ avatarUrl, name }) => {
  const [avatar, setAvatar] = useState<string | undefined>(avatarUrl);
  const [isEmojiAvatar, setIsEmojiAvatar] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Check if avatar is a mock/fallback
  const isMockAvatar = !avatarUrl || 
    avatarUrl.includes('placeholder') || 
    avatarUrl.includes('flaticon') ||
    avatarUrl.includes('cdn-icons');
  
  useEffect(() => {
    // Try to get real avatar if this is an ENS name
    if (name?.endsWith('.eth') && !avatarUrl) {
      console.log('Fetching ENS avatar for', name);
      setIsLoading(true);
      
      getEnsAvatarUrl(name)
        .then(ensAvatar => {
          console.log('ENS Avatar result:', ensAvatar);
          if (ensAvatar) {
            setAvatar(ensAvatar);
            setIsEmojiAvatar(false);
          } else if (!avatar) {
            // If no avatar found, use emoji
            setIsEmojiAvatar(true);
          }
        })
        .catch(error => {
          console.error('Error fetching ENS avatar:', error);
          setIsEmojiAvatar(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (isMockAvatar) {
      setIsEmojiAvatar(true);
    }
  }, [name, avatarUrl, isMockAvatar, avatar]);

  // Get emoji for user (deterministic based on name)
  const getEmoji = () => {
    if (!name) return '👤';
    
    const emojis = ['👤', '👨‍💻', '👩‍💻', '🧙', '🦹', '🧑‍🚀', '👨‍🔬', '👩‍🔬', '🧙‍♀️', '🧙‍♂️'];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return emojis[hash % emojis.length];
  };

  return (
    <Avatar className={`h-48 w-48 border-2 border-white shadow-md mx-auto ${(isMockAvatar || isEmojiAvatar) ? 'bg-white' : ''}`}>
      {isLoading ? (
        <AvatarFallback className="bg-white animate-pulse">
          <span className="text-2xl">...</span>
        </AvatarFallback>
      ) : !isEmojiAvatar ? (
        <AvatarImage src={avatar || '/placeholder.svg'} alt={name} className="object-cover" />
      ) : (
        <AvatarFallback className="bg-white text-gray-800 text-4xl flex items-center justify-center">
          {getEmoji()}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default ProfileAvatar;
