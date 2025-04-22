
import React, { useState } from 'react';
import { SocialIcon } from '@/components/ui/social-icon';
import { Check, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatSocialUrl } from '@/utils/socialLinkFormatters';

interface SocialLinkItemProps {
  platformType: string;
  url: string;
}

const SocialLinkItem: React.FC<SocialLinkItemProps> = ({ platformType, url }) => {
  const [copied, setCopied] = useState(false);
  
  // Format the URL using our utility function
  const formattedUrl = formatSocialUrl(platformType, url);
  
  const handleCopyDiscord = () => {
    const displayText = url.startsWith('@') ? url : `@${url}`;
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
        className="hover:opacity-70 transition-opacity bg-secondary/30 p-2 rounded-full flex items-center justify-center group relative"
        title={`Copy Discord: ${url}`}
        data-social-link={platformType}
      >
        <SocialIcon type={platformType} size={20} />
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
      className="hover:opacity-70 transition-opacity bg-secondary/30 p-2 rounded-full flex items-center justify-center"
      title={platformType.charAt(0).toUpperCase() + platformType.slice(1)}
      data-social-link={platformType}
    >
      <SocialIcon type={platformType as any} size={20} />
    </a>
  );
};

export default SocialLinkItem;
