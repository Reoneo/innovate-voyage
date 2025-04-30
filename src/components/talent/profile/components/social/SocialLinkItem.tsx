
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { fixTelegramUrl } from '@/utils/socialLinkUtils';

interface SocialLinkItemProps {
  platformType: string;
  url: string;
}

const SocialLinkItem: React.FC<SocialLinkItemProps> = ({ platformType, url }) => {
  // Fix for telegram URLs
  const fixedUrl = platformType.toLowerCase() === 'telegram' ? fixTelegramUrl(url) : url;
  
  // Clean up URL if needed
  const cleanUrl = fixedUrl.startsWith('http') ? fixedUrl : `https://${fixedUrl}`;
  
  // Determine icon based on platform type
  let platformIcon = '';
  let platformName = platformType;
  
  switch (platformType.toLowerCase()) {
    case 'twitter':
    case 'x':
      platformIcon = 'https://api.iconify.design/simple-icons:x.svg?color=%23000000';
      platformName = 'Twitter / X';
      break;
    case 'github':
      platformIcon = 'https://api.iconify.design/simple-icons:github.svg?color=%23000000';
      break;
    case 'linkedin':
      platformIcon = 'https://api.iconify.design/simple-icons:linkedin.svg?color=%230A66C2';
      break;
    case 'telegram':
      platformIcon = 'https://api.iconify.design/simple-icons:telegram.svg?color=%2326A5E4';
      break;
    case 'instagram':
      platformIcon = 'https://api.iconify.design/simple-icons:instagram.svg?color=%23E4405F';
      break;
    case 'discord':
      platformIcon = 'https://api.iconify.design/simple-icons:discord.svg?color=%235865F2';
      break;
    case 'youtube':
      platformIcon = 'https://api.iconify.design/simple-icons:youtube.svg?color=%23FF0000';
      break;
    case 'twitch':
      platformIcon = 'https://api.iconify.design/simple-icons:twitch.svg?color=%23772CE8';
      break;
    case 'reddit':
      platformIcon = 'https://api.iconify.design/simple-icons:reddit.svg?color=%23FF4500';
      break;
    case 'medium':
      platformIcon = 'https://api.iconify.design/simple-icons:medium.svg?color=%23000000';
      break;
    case 'lens':
    case 'lenster':
      platformIcon = 'https://api.iconify.design/simple-icons:lens.svg?color=%23002318';
      platformName = 'Lens';
      break;
    case 'farcaster':
      platformIcon = 'https://api.iconify.design/simple-icons:farcaster.svg?color=%23794BC4';
      break;
    case 'mirror':
      platformIcon = 'https://api.iconify.design/simple-icons:mirror.svg?color=%23000000';
      break;
    default:
      platformIcon = 'https://api.iconify.design/carbon:link.svg?color=%23000000';
      platformName = platformType.charAt(0).toUpperCase() + platformType.slice(1);
  }

  return (
    <a 
      href={cleanUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors p-2"
      title={platformName}
    >
      <div className="flex-shrink-0">
        <img 
          src={platformIcon} 
          alt={platformName}
          className="w-6 h-6" // Reduced size by 40% from previous 10/10
          width="24"
          height="24"
        />
      </div>
      <span className="sr-only">{platformName}</span>
    </a>
  );
};

export default SocialLinkItem;
