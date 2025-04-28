
import React, { useState } from 'react';
import { SocialIcon } from '@/components/ui/social-icon';
import { Check, Copy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface SocialLinkItemProps {
  platformType: string;
  url: string;
}

const SocialLinkItem: React.FC<SocialLinkItemProps> = ({ platformType, url }) => {
  const [copied, setCopied] = useState(false);
  
  // Format URL if needed (e.g., adding proper protocol)
  let formattedUrl = url;
  let displayText = url;
  
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
    case 'twitter':
      if (!url.startsWith('http')) {
        formattedUrl = `https://twitter.com/${url.replace('@', '')}`;
        displayText = `@${url.replace('@', '')}`;
      }
      break;
    case 'github':
      if (!url.startsWith('http')) {
        formattedUrl = `https://github.com/${url.replace('@', '')}`;
        displayText = `@${url.replace('@', '')}`;
      }
      break;
    case 'linkedin':
      if (!url.startsWith('http')) {
        formattedUrl = `https://linkedin.com/in/${url.replace('@', '')}`;
        displayText = `${url.replace('@', '')}`;
      }
      break;
    case 'discord':
      displayText = url.startsWith('@') ? url : `@${url}`;
      break;
    default:
      if (!url.startsWith('http')) {
        formattedUrl = `https://${url}`;
      }
  }

  if (platformType === 'discord') {
    return (
      <button
        onClick={() => {
          navigator.clipboard.writeText(displayText);
          setCopied(true);
          toast({ title: "Discord handle copied!" });
          setTimeout(() => setCopied(false), 2000);
        }}
        className="hover:opacity-70 transition-opacity"
        title={`Copy Discord: ${displayText}`}
      >
        <SocialIcon type={platformType} size={24} />
      </button>
    );
  }

  return (
    <a 
      href={formattedUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="hover:opacity-70 transition-opacity"
      title={platformType.charAt(0).toUpperCase() + platformType.slice(1)}
    >
      <SocialIcon type={platformType as any} size={24} />
    </a>
  );
};

export default SocialLinkItem;
