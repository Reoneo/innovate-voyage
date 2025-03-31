
import React from 'react';
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
        return <Github size={24} className="text-[#333]" />;
      case 'twitter':
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=fJp7hepMryiw&format=png&color=000000" 
            alt="Twitter"
            className="w-6 h-6"
          />
        );
      case 'linkedin':
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=13930&format=png&color=000000" 
            alt="LinkedIn"
            className="w-6 h-6"
          />
        );
      case 'facebook':
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=13912&format=png&color=000000" 
            alt="Facebook"
            className="w-6 h-6"
          />
        );
      case 'instagram':
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=Xy10Jcu1L2Su&format=png&color=000000" 
            alt="Instagram"
            className="w-6 h-6"
          />
        );
      case 'youtube':
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=19318&format=png&color=000000" 
            alt="YouTube"
            className="w-6 h-6"
          />
        );
      case 'bluesky':
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=3ovMFy5JDSWq&format=png&color=000000" 
            alt="Bluesky"
            className="w-6 h-6"
          />
        );
      case 'globe':
      case 'website':
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=1349&format=png&color=000000" 
            alt="Website"
            className="w-6 h-6"
          />
        );
      case 'telegram':
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=63306&format=png&color=000000" 
            alt="Telegram"
            className="w-6 h-6"
          />
        );
      case 'discord':
        return <Disc size={24} className="text-[#5865F2]" />;
      case 'whatsapp':
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=16713&format=png&color=000000" 
            alt="WhatsApp"
            className="w-6 h-6"
          />
        );
      case 'email':
      case 'mail':
        return <Mail size={24} className="text-[#9C27B0]" />;
      default:
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=1349&format=png&color=000000" 
            alt="Website"
            className="w-6 h-6"
          />
        );
    }
  };

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="hover:opacity-70 transition-opacity bg-secondary/30 p-1.5 rounded-full"
      title={platformType.charAt(0).toUpperCase() + platformType.slice(1)}
    >
      {getIconForPlatform()}
    </a>
  );
};

export default SocialLinkItem;
