
import React from 'react';
import SocialLinkItem from './SocialLinkItem';
import { socialPlatforms } from '@/constants/socialPlatforms';

interface SocialLinksSectionProps {
  socials: Record<string, string>;
  identity?: string;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ socials, identity }) => {
  // Filter out empty values and create a normalized social object
  const normalizedSocials: Record<string, string> = {};
  Object.entries(socials || {}).forEach(([key, value]) => {
    if (value && typeof value === 'string' && value.trim() !== '') {
      normalizedSocials[key.toLowerCase()] = value;
    }
  });
  
  // Check if we have any actual social links
  const hasSocialLinks = Object.keys(normalizedSocials).length > 0;
  
  // Don't render anything if no links are available
  if (!hasSocialLinks) {
    return null;
  }
  
  // For debugging
  console.log('Rendering social links:', normalizedSocials);
  
  return (
    <div className="w-full mt-2 border-t border-border pt-2">
      <div className="grid grid-cols-4 gap-2 justify-items-center">
        {/* Display available social platforms */}
        {socialPlatforms.map(platform => 
          normalizedSocials[platform.key] && (
            <SocialLinkItem 
              key={platform.key}
              platformType={platform.type} 
              url={normalizedSocials[platform.key]} 
            />
          )
        )}
        
        {/* Handle any custom social links not in our predefined list */}
        {Object.entries(normalizedSocials).map(([key, value]) => {
          // Skip if this platform is already handled above or if value is empty
          if (!value || socialPlatforms.some(p => p.key === key)) {
            return null;
          }
          
          return (
            <SocialLinkItem
              key={key}
              platformType={key}
              url={value}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SocialLinksSection;
