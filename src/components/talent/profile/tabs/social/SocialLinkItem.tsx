
import React from 'react';
import { extractHandle } from '@/utils/socialLinkUtils';
import {
  Github,
  Twitter,
  Linkedin,
  Globe,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  MessageSquare,
  MessageCircle,
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
        return <Twitter size={16} className="text-[#1DA1F2]" />;
      case 'linkedin':
        return <Linkedin size={16} className="text-[#0077B5]" />;
      case 'facebook':
        return <Facebook size={16} className="text-[#1877F2]" />;
      case 'instagram':
        return <Instagram size={16} className="text-[#E4405F]" />;
      case 'youtube':
        return <Youtube size={16} className="text-[#FF0000]" />;
      case 'bluesky':
        return (
          <span className="text-[#0085FF] flex items-center justify-center" style={{ fontSize: '14px' }}>
            🦋
          </span>
        );
      case 'globe':
      case 'website':
        return <Globe size={16} className="text-[#4CAF50]" />;
      case 'telegram':
        return <MessageCircle size={16} className="text-[#0088cc]" />;
      case 'discord':
        return <Disc size={16} className="text-[#5865F2]" />;
      case 'whatsapp':
        return <MessageSquare size={16} className="text-[#25D366]" />;
      default:
        return <Globe size={16} />;
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
