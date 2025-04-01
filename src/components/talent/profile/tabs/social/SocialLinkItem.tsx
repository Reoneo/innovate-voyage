
import React from 'react';
import {
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  Mail,
  MessageCircle,
  Twitter,
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
        return <Github size={20} className="text-[#333]" />;
      case 'twitter':
        return <Twitter size={20} className="text-[#1DA1F2]" />;
      case 'linkedin':
        return <Linkedin size={20} className="text-[#0A66C2]" />;
      case 'facebook':
        return <Facebook size={20} className="text-[#1877F2]" />;
      case 'instagram':
        return <Instagram size={20} className="text-[#E4405F]" />;
      case 'youtube':
        return <Youtube size={20} className="text-[#FF0000]" />;
      case 'bluesky':
        return (
          <span className="inline-flex items-center justify-center text-[#0285FF]">
            <span role="img" aria-label="butterfly" style={{ fontSize: '16px' }}>
              🦋
            </span>
          </span>
        );
      case 'globe':
      case 'website':
        return <Globe size={20} className="text-[#2E7D32]" />;
      case 'telegram':
        return <MessageCircle size={20} className="text-[#0088cc]" />;
      case 'discord':
        return <Disc size={20} className="text-[#5865F2]" />;
      case 'whatsapp':
        return <MessageCircle size={20} className="text-[#25D366]" />;
      case 'email':
      case 'mail':
        return <Mail size={20} className="text-[#EA4335]" />;
      default:
        return <Globe size={20} className="text-[#2E7D32]" />;
    }
  };

  // Format URL if needed
  const formattedUrl = platformType === 'whatsapp' && !url.startsWith('https://') 
    ? `https://wa.me/${url.replace(/[^0-9]/g, '')}` 
    : url;

  return (
    <a 
      href={formattedUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="hover:opacity-70 transition-opacity bg-secondary/30 p-2 rounded-full flex items-center justify-center"
      title={platformType.charAt(0).toUpperCase() + platformType.slice(1)}
      data-social-link={platformType}
    >
      {getIconForPlatform()}
    </a>
  );
};

export default SocialLinkItem;
