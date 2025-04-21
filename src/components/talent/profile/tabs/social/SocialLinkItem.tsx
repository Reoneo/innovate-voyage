
import React from 'react';
import { SocialIcon } from '@/components/ui/social-icon';
import { ExternalLink } from 'lucide-react';

interface SocialLinkItemProps {
  platformType: string;
  url: string;
}

const SocialLinkItem: React.FC<SocialLinkItemProps> = ({ platformType, url }) => {
  // Format URL with proper protocol if missing
  const formattedUrl = url.startsWith('http') ? url : 
    platformType === 'email' ? `mailto:${url}` : 
    platformType === 'telephone' || platformType === 'whatsapp' ? `tel:${url}` : 
    `https://${url}`;
  
  // Format display text (truncate for display)
  let displayText = url;
  if (url.length > 25) {
    displayText = url.substring(0, 22) + '...';
  }
  
  return (
    <a
      href={platformType === 'whatsapp' ? `https://wa.me/${url}` : formattedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 p-2 rounded-md bg-secondary/50 hover:bg-secondary/80 transition-colors text-muted-foreground hover:text-foreground"
    >
      <div className="bg-background p-1.5 rounded-full">
        <SocialIcon type={platformType as any} size={18} />
      </div>
      <span className="text-xs truncate flex-1">{displayText}</span>
      <ExternalLink className="h-3 w-3 flex-shrink-0" />
    </a>
  );
};

export default SocialLinkItem;
