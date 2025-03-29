
import React from 'react';
import { SocialIcon } from '@/components/ui/social-icon';
import { extractHandle } from '@/utils/socialLinkUtils';

interface SocialLinkItemProps {
  platformType: string;
  url: string;
}

const SocialLinkItem: React.FC<SocialLinkItemProps> = ({ platformType, url }) => {
  return (
    <div className="flex items-center gap-2">
      <SocialIcon type={platformType as any} size={16} />
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
