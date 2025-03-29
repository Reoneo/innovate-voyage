import React from 'react';
import { Globe } from 'lucide-react';
import { SocialIcon } from '@/components/ui/social-icon';
import { BlockchainProfile } from '@/api/types/etherscanTypes';

interface SocialLinksProps {
  ensName?: string;
  links: string[];
  socials: Record<string, string>;
}

// Helper function to extract username from social media URLs
const extractHandle = (url: string, platform: string): string => {
  try {
    const urlObj = new URL(url);
    switch (platform) {
      case 'github':
        return '@' + urlObj.pathname.split('/')[1];
      case 'twitter':
        return '@' + urlObj.pathname.split('/')[1];
      case 'linkedin':
        if (urlObj.pathname.includes('/in/')) {
          return '@' + urlObj.pathname.split('/in/')[1].split('/')[0];
        }
        return url;
      case 'facebook':
        return '@' + urlObj.pathname.split('/')[1];
      case 'instagram':
        return '@' + urlObj.pathname.split('/')[1];
      case 'youtube':
        if (urlObj.pathname.includes('/c/')) {
          return '@' + urlObj.pathname.split('/c/')[1];
        } else if (urlObj.pathname.includes('/channel/')) {
          return urlObj.pathname.split('/channel/')[1];
        }
        return 'YouTube Channel';
      case 'bluesky':
        return '@' + (urlObj.pathname.split('/').filter(p => p)[0] || '');
      case 'website':
        return urlObj.hostname;
      default:
        return url;
    }
  } catch (e) {
    // If URL parsing fails, just return the original URL
    return url;
  }
};

const SocialLinks: React.FC<SocialLinksProps> = ({ ensName, links, socials }) => {
  return (
    <div className="space-y-4">
      {/* ENS Domains */}
      {ensName && (
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <a 
            href={`https://app.ens.domains/name/${ensName}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {ensName}
          </a>
        </div>
      )}
      
      {/* Other links */}
      {links.map((link, index) => (
        <div key={index} className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {new URL(link).hostname}
          </a>
        </div>
      ))}
      
      {/* Social links */}
      {socials.github && (
        <div className="flex items-center gap-2">
          <SocialIcon type="github" size={16} />
          <a 
            href={socials.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {extractHandle(socials.github, 'github')}
          </a>
        </div>
      )}
      
      {socials.twitter && (
        <div className="flex items-center gap-2">
          <SocialIcon type="twitter" size={16} />
          <a 
            href={socials.twitter} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {extractHandle(socials.twitter, 'twitter')}
          </a>
        </div>
      )}
      
      {socials.linkedin && (
        <div className="flex items-center gap-2">
          <SocialIcon type="linkedin" size={16} />
          <a 
            href={socials.linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {extractHandle(socials.linkedin, 'linkedin')}
          </a>
        </div>
      )}
      
      {socials.facebook && (
        <div className="flex items-center gap-2">
          <SocialIcon type="facebook" size={16} />
          <a 
            href={socials.facebook} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {extractHandle(socials.facebook, 'facebook')}
          </a>
        </div>
      )}
      
      {socials.instagram && (
        <div className="flex items-center gap-2">
          <SocialIcon type="instagram" size={16} />
          <a 
            href={socials.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {extractHandle(socials.instagram, 'instagram')}
          </a>
        </div>
      )}
      
      {socials.youtube && (
        <div className="flex items-center gap-2">
          <SocialIcon type="youtube" size={16} />
          <a 
            href={socials.youtube} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {extractHandle(socials.youtube, 'youtube')}
          </a>
        </div>
      )}
      
      {socials.bluesky && (
        <div className="flex items-center gap-2">
          <SocialIcon type="bluesky" size={16} />
          <a 
            href={socials.bluesky} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {extractHandle(socials.bluesky, 'bluesky')}
          </a>
        </div>
      )}
      
      {socials.website && (
        <div className="flex items-center gap-2">
          <SocialIcon type="globe" size={16} />
          <a 
            href={socials.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {extractHandle(socials.website, 'website')}
          </a>
        </div>
      )}
      
      {/* Show a message if no links are available */}
      {!ensName && links.length === 0 && Object.keys(socials).length === 0 && (
        <div className="text-muted-foreground text-sm py-4">
          No web3 links available for this profile
        </div>
      )}
    </div>
  );
};

export default SocialLinks;
