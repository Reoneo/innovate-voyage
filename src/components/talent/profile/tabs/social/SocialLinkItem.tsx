
import React from 'react';
import { extractHandle } from '@/utils/socialLinkUtils';
import {
  Github,
  Mail,
  Disc
} from 'lucide-react';

interface SocialLinkItemProps {
  platformType: string;
  url: string;
}

const SocialLinkItem: React.FC<SocialLinkItemProps> = ({ platformType, url }) => {
  // Function to get the appropriate icon based on platform type
  const getIconForPlatform = () => {
    switch (platformType) {
      case 'github':
        return <Github size={16} className="text-[#333]" />;
      case 'twitter':
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=fJp7hepMryiw&format=png&color=000000" 
            alt="Twitter"
            className="w-4 h-4"
          />
        );
      case 'linkedin':
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=13930&format=png&color=000000" 
            alt="LinkedIn"
            className="w-4 h-4"
          />
        );
      case 'facebook':
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=13912&format=png&color=000000" 
            alt="Facebook"
            className="w-4 h-4"
          />
        );
      case 'instagram':
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=Xy10Jcu1L2Su&format=png&color=000000" 
            alt="Instagram"
            className="w-4 h-4"
          />
        );
      case 'youtube':
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=19318&format=png&color=000000" 
            alt="YouTube"
            className="w-4 h-4"
          />
        );
      case 'bluesky':
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=3ovMFy5JDSWq&format=png&color=000000" 
            alt="Bluesky"
            className="w-4 h-4"
          />
        );
      case 'globe':
      case 'website':
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=1349&format=png&color=000000" 
            alt="Website"
            className="w-4 h-4"
          />
        );
      case 'telegram':
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=63306&format=png&color=000000" 
            alt="Telegram"
            className="w-4 h-4"
          />
        );
      case 'discord':
        return <Disc size={16} className="text-[#5865F2]" />;
      case 'whatsapp':
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=16713&format=png&color=000000" 
            alt="WhatsApp"
            className="w-4 h-4"
          />
        );
      default:
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=1349&format=png&color=000000" 
            alt="Website"
            className="w-4 h-4"
          />
        );
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getIconForPlatform()}
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        {extractHandle(url, platformType)}
      </a>
    </div>
  );
};

export default SocialLinkItem;
