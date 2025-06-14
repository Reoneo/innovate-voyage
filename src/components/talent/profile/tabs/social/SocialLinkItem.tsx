import React, { useState } from 'react';
import { SocialIcon } from '@/components/ui/social-icon';
import { Check, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SocialLinkItemProps {
  platformType: string;
  url: string;
}

const SocialLinkItem: React.FC<SocialLinkItemProps> = ({ platformType, url }) => {
  const [copied, setCopied] = useState(false);
  
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
    case 'phone':
    case 'telephone':
      formattedUrl = url.startsWith('tel:') ? url : `tel:${url.replace(/[^0-9+]/g, '')}`;
      break;
    case 'location':
      formattedUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(url)}`;
      break;
    case 'twitter':
      if (!url.startsWith('http')) {
        formattedUrl = `https://twitter.com/${url.replace('@', '')}`;
        displayText = `@${url.replace('@', '')}`;
      }
      break;
    case 'bluesky':
      if (!url.startsWith('http')) {
        formattedUrl = `https://bsky.app/profile/${url.replace('@', '')}`;
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
    case 'telegram':
      if (!url.startsWith('http')) {
        // Always make sure to add https://t.me/ and remove @ if present
        formattedUrl = `https://t.me/${url.replace('@', '')}`;
      }
      break;
    default:
      if (!url.startsWith('http') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
        formattedUrl = `https://${url}`;
      }
  }

  const handleCopyDiscord = () => {
    navigator.clipboard.writeText(displayText);
    setCopied(true);
    toast({
      title: "Discord handle copied!",
      description: `${displayText} has been copied to clipboard`,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (platformType === 'discord') {
    return (
      <button
        onClick={handleCopyDiscord}
        className="hover:opacity-70 transition-opacity flex items-center justify-center group relative"
        title={`Copy Discord: ${displayText}`}
        data-social-link={platformType}
      >
        <SocialIcon type={platformType} size={40} />
        <span className="absolute top-full mt-1 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {copied ? <Check size={12} className="inline mr-1" /> : <Copy size={12} className="inline mr-1" />} 
          {copied ? "Copied!" : "Copy Discord"}
        </span>
      </button>
    );
  }

  return (
    <a 
      href={formattedUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="hover:opacity-70 transition-opacity flex items-center justify-center"
      title={platformType.charAt(0).toUpperCase() + platformType.slice(1)}
      data-social-link={platformType}
    >
      <SocialIcon type={platformType as any} size={40} />
    </a>
  );
};

export default SocialLinkItem;
