
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
  
  // For debugging
  console.log('Rendering social links:', normalizedSocials);
  
  if (!hasSocialLinks) {
    return null;
  }
  
  return (
    <div className="w-full mt-4 pt-3 border-t border-gray-100">
      <h4 className="text-sm font-medium text-gray-500 mb-3 px-1">Social Links</h4>
      <div className="grid grid-cols-4 gap-3 justify-items-center">
        {/* Display available social platforms in preferred order */}
        {[
          'github', 'twitter', 'linkedin', 'facebook', 'instagram', 
          'youtube', 'telegram', 'bluesky', 'discord', 'website', 
          'whatsapp', 'email', 'telephone', 'location'
        ].map(platformKey => 
          normalizedSocials[platformKey] && (
            <SocialLinkItem 
              key={platformKey}
              platformType={platformKey} 
              url={normalizedSocials[platformKey]} 
            />
          )
        )}
        
        {/* Handle any custom social links not in our predefined list */}
        {Object.entries(normalizedSocials).map(([key, value]) => {
          // Skip if this platform is already handled above or if value is empty
          if (!value || ['github', 'twitter', 'linkedin', 'facebook', 'instagram', 
                        'youtube', 'telegram', 'bluesky', 'discord', 'website', 
                        'whatsapp', 'email', 'telephone', 'location'].includes(key)) {
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
