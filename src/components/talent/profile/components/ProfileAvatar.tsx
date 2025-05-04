
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfileAvatarProps {
  avatarUrl: string | undefined;
  name: string;
  isMockAvatar?: boolean;
}

// Function to get a random emoji for avatar fallback
const getRandomEmoji = () => {
  const emojis = ['👤', '👩', '👨', '🧑', '👱', '👧', '👦', '🧔', '👩‍💻', '👨‍💻', '🧑‍💻', '👩‍🔬', '👨‍🔬', '👩‍🚀', '👨‍🚀'];
  return emojis[Math.floor(Math.random() * emojis.length)];
};

// Function to generate an emoji based on name
const getEmojiFromName = (name: string) => {
  if (!name) return getRandomEmoji();
  
  // Simple hashing function to get consistent emoji for the same name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  const emojis = ['👤', '👩', '👨', '🧑', '👱', '👧', '👦', '🧔', '👩‍💻', '👨‍💻', '🧑‍💻', '👩‍🔬', '👨‍🔬', '👩‍🚀', '👨‍🚀'];
  const index = Math.abs(hash) % emojis.length;
  return emojis[index];
};

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ avatarUrl, name, isMockAvatar = false }) => {
  // Get emoji for this name
  const emoji = getEmojiFromName(name);
  
  return (
    <Avatar className="h-48 w-48 border-2 border-white shadow-md mx-auto"> {/* Increased size and centered */}
      {!isMockAvatar && avatarUrl ? (
        <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
      ) : (
        <AvatarFallback className="bg-primary/10 text-primary font-medium text-5xl">
          {emoji}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default ProfileAvatar;
