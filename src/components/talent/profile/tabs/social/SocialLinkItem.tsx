import React from 'react';
import { SocialIcon } from '@/components/ui/social-icon';

interface SocialLinkItemProps {
  platformType: string;
  url: string;
}

const SocialLinkItem: React.FC<SocialLinkItemProps> = ({ platformType, url }) => {
  // Format URL if needed (e.g., adding proper protocol)
  let formattedUrl = url;
  
  switch (platformType) {
    case 'whatsapp':
      formattedUrl = url.startsWith('https://') ? url : `https://wa.me/${url.replace(/[^0-9]/g, '')}`;
      break;
    case 'website':
    case 'globe':
      formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      break;
    case 'email':
    case 'mail':
      formattedUrl = url.startsWith('mailto:') ? url : `mailto:${url}`;
      break;
    case 'phone':
    case 'telephone':
      formattedUrl = url.startsWith('tel:') ? url : `tel:${url.replace(/[^0-9+]/g, '')}`;
      break;
    case 'twitter':
      // Handle both twitter.com and x.com URLs
      if (!url.startsWith('http')) {
        formattedUrl = `https://twitter.com/${url.replace('@', '')}`;
      }
      break;
    case 'github':
      if (!url.startsWith('http')) {
        formattedUrl = `https://github.com/${url.replace('@', '')}`;
      }
      break;
    case 'linkedin':
      if (!url.startsWith('http')) {
        formattedUrl = `https://linkedin.com/in/${url.replace('@', '')}`;
      }
      break;
    default:
      // Keep as is if it already has a protocol
      if (!url.startsWith('http') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
        formattedUrl = `https://${url}`;
      }
  }

  return (
    <a 
      href={formattedUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="hover:opacity-70 transition-opacity bg-secondary/30 p-2 rounded-full flex items-center justify-center"
      title={platformType.charAt(0).toUpperCase() + platformType.slice(1)}
      data-social-link={platformType}
    >
      <SocialIcon type={platformType as any} size={20} />
    </a>
  );
};

export default SocialLinkItem;
