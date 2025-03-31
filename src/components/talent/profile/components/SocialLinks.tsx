
import React from 'react';
import { Github, Twitter, Linkedin, Globe, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { socialPlatforms } from '@/constants/socialPlatforms';
import { SocialIcon } from '@/components/ui/social-icon';

interface SocialLinksProps {
  ensName?: string;
  links: string[];
  socials: Record<string, string>;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ ensName, links, socials }) => {
  const socialIcons = [
    { platform: 'github', icon: <Github size={20} /> },
    { platform: 'twitter', icon: <Twitter size={20} /> },
    { platform: 'linkedin', icon: <Linkedin size={20} /> },
    { platform: 'facebook', icon: <div className="text-blue-600 font-bold">f</div> },
    { platform: 'instagram', icon: <Instagram size={20} /> },
    { platform: 'discord', icon: <div className="text-indigo-500 font-bold">D</div> }
  ];
  
  const availablePlatforms = Object.keys(socials);
  
  return (
    <div className="grid grid-cols-5 gap-2">
      {socialIcons.map((item) => {
        const hasLink = availablePlatforms.includes(item.platform);
        const link = hasLink ? socials[item.platform] : undefined;
        
        return (
          <Button
            key={item.platform}
            variant={hasLink ? "default" : "outline"}
            size="icon"
            className={`aspect-square ${!hasLink ? 'opacity-50' : ''}`}
            asChild={hasLink}
            disabled={!hasLink}
          >
            {hasLink ? (
              <a href={link} target="_blank" rel="noopener noreferrer">
                {item.icon}
              </a>
            ) : (
              <>{item.icon}</>
            )}
          </Button>
        );
      })}
      
      {/* Additional icons for the bottom row */}
      <Button variant="outline" size="icon" className="aspect-square opacity-50" disabled>
        <Instagram size={20} />
      </Button>
      <Button variant="outline" size="icon" className="aspect-square opacity-50" disabled>
        <Youtube size={20} />
      </Button>
      <Button variant="outline" size="icon" className="aspect-square opacity-50" disabled>
        <span role="img" aria-label="butterfly" style={{ fontSize: '16px' }}>
          🦋
        </span>
      </Button>
      <Button variant="outline" size="icon" className="aspect-square opacity-50" disabled>
        <Globe size={20} />
      </Button>
      <Button variant="outline" size="icon" className="aspect-square opacity-50" disabled>
        <MessageCircle size={20} />
      </Button>
    </div>
  );
};

export default SocialLinks;
