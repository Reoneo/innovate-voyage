
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

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

  // Get the appropriate icon URL based on platform
  const getIconUrl = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return 'https://cdn-icons-png.flaticon.com/512/145/145807.png';
      case 'whatsapp':
        return 'https://cdn-icons-png.flaticon.com/512/5968/5968841.png';
      case 'twitter':
        return 'https://cdn-icons-png.flaticon.com/512/5969/5969020.png';
      case 'facebook':
        return 'https://cdn-icons-png.flaticon.com/512/5968/5968764.png';
      case 'instagram':
        return 'https://cdn-icons-png.flaticon.com/512/15707/15707749.png';
      case 'github':
        return 'https://cdn-icons-png.flaticon.com/512/1051/1051326.png';
      case 'youtube':
        return 'https://cdn-icons-png.flaticon.com/512/3670/3670147.png';
      case 'telegram':
        return 'https://cdn-icons-png.flaticon.com/512/5968/5968804.png';
      case 'bluesky':
        return 'https://www.iconpacks.net/icons/free-icons-7/free-bluesky-blue-round-circle-logo-icon-24461.png';
      case 'location':
      case 'geolocation':
        return 'https://cdn-icons-png.flaticon.com/512/355/355980.png';
      case 'email':
      case 'mail':
        return 'https://cdn-icons-png.flaticon.com/512/482/482138.png';
      case 'discord':
        return 'https://cdn-icons-png.flaticon.com/512/5968/5968756.png';
      case 'website':
      case 'globe':
      case 'url':
        return 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png';
      default:
        return 'https://cdn-icons-png.flaticon.com/512/3059/3059997.png'; // Generic icon
    }
  };

  if (platformType === 'discord') {
    return (
      <button
        onClick={handleCopyDiscord}
        className="hover:opacity-70 transition-opacity flex items-center justify-center group relative"
        title={`Copy Discord: ${displayText}`}
        data-social-link={platformType}
      >
        <img 
          src={getIconUrl('discord')} 
          alt="Discord" 
          className="h-10 w-10 rounded-full" 
        />
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
      <img 
        src={getIconUrl(platformType)} 
        alt={platformType} 
        className="h-10 w-10 rounded-full" 
      />
    </a>
  );
};

export default SocialLinkItem;
