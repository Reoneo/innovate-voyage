
import React from 'react';
import { SocialIcon } from '@/components/ui/social-icon';

interface SocialLinkItemProps {
  platformType: string;
  url: string;
}

const SocialLinkItem: React.FC<SocialLinkItemProps> = ({ platformType, url }) => {
  // Format URL if needed (e.g., adding proper protocol)
  let formattedUrl = url;
  
  if (platformType === 'whatsapp' && !url.startsWith('https://')) {
    formattedUrl = `https://wa.me/${url.replace(/[^0-9]/g, '')}`;
  } else if ((platformType === 'website' || platformType === 'globe') && !url.startsWith('http')) {
    formattedUrl = `https://${url}`;
  } else if (platformType === 'email' || platformType === 'mail') {
    formattedUrl = url.startsWith('mailto:') ? url : `mailto:${url}`;
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
