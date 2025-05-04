
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getEnsAvatarUrl } from '@/api/services/ens/ensApiClient';

interface ProfileAvatarProps {
  avatarUrl: string | undefined;
  name: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ avatarUrl, name }) => {
  const [avatar, setAvatar] = useState<string | undefined>(avatarUrl);
  const [isEmojiAvatar, setIsEmojiAvatar] = useState<boolean>(false);
  
  // Check if avatar is a mock/fallback
  const isMockAvatar = !avatarUrl || 
    avatarUrl.includes('placeholder') || 
    avatarUrl.includes('flaticon') ||
    avatarUrl.includes('cdn-icons');
  
  useEffect(() => {
    // Try to get real avatar if this is an ENS name
    if (name?.endsWith('.eth') && !avatarUrl) {
      getEnsAvatarUrl(name).then(ensAvatar => {
        if (ensAvatar) {
          setAvatar(ensAvatar);
        } else if (!avatar) {
          // If no avatar found, use emoji
          setIsEmojiAvatar(true);
        }
      }).catch(() => {
        setIsEmojiAvatar(true);
      });
    } else if (isMockAvatar) {
      setIsEmojiAvatar(true);
    }
  }, [name, avatarUrl]);

  // Get emoji for user (deterministic based on name)
  const getEmoji = () => {
    if (!name) return '👤';
    
    const emojis = ['👤', '👨‍💻', '👩‍💻', '🧙', '🦹', '🧑‍🚀', '👨‍🔬', '👩‍🔬', '🧙‍♀️', '🧙‍♂️'];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return emojis[hash % emojis.length];
  };

  return (
    <Avatar className={`h-48 w-48 border-2 border-white shadow-md mx-auto ${(isMockAvatar || isEmojiAvatar) ? 'bg-white' : ''}`}>
      {!isEmojiAvatar ? (
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
