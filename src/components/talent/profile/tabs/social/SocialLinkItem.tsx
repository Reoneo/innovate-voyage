
import React, { useState } from 'react';
import { SocialIcon } from '@/components/ui/social-icon';
import { CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface SocialLinkItemProps {
  platformType: string;
  url: string;
}

const SocialLinkItem: React.FC<SocialLinkItemProps> = ({ platformType, url }) => {
  const [copied, setCopied] = useState(false);
  
  // Format URL if needed (e.g., adding proper protocol)
  let formattedUrl = url;
  let displayHandle = url;
  let isExternalLink = true;
  
  // Special handling for discord - make it copyable instead of a hyperlink
  if (platformType === 'discord') {
    isExternalLink = false;
    displayHandle = url.replace('@', '');
    
    const handleCopyDiscord = () => {
      navigator.clipboard.writeText(displayHandle);
      setCopied(true);
      toast.success('Discord handle copied to clipboard!');
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    };
    
    return (
      <button 
        onClick={handleCopyDiscord}
        className="hover:opacity-70 transition-opacity bg-secondary/30 p-2 rounded-full flex items-center justify-center"
        title={`Copy Discord: ${displayHandle}`}
        data-social-link={platformType}
      >
        <div className="relative">
          <SocialIcon type="discord" size={20} />
          {copied ? (
            <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-500" />
          ) : (
            <Copy className="absolute -top-1 -right-1 h-3 w-3 opacity-70" />
          )}
        </div>
      </button>
    );
  }
  
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
    case 'bluesky':
      if (!url.startsWith('http')) {
        formattedUrl = `https://bsky.app/profile/${url.replace('@', '')}`;
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
      {isExternalLink && <span className="sr-only">Visit {platformType}</span>}
    </a>
  );
};

export default SocialLinkItem;
