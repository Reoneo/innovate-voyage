
import React from 'react';
import SocialLinkItem from './SocialLinkItem';
import { socialPlatforms } from '@/constants/socialPlatforms';

interface SocialMediaLinksProps {
  socials: Record<string, string>;
  isLoading?: boolean;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ socials, isLoading = false }) => {
  // Create a filtered version of socials without LinkedIn for home page
  const updatedSocials = { ...socials };
  
  // Log socials for debugging
  console.log("SocialMediaLinks - socials:", socials);
  
  // Don't show anything while loading
  if (isLoading) {
    return null;
  }
  
  // Check if we have any actual social links
  const hasSocialLinks = Object.entries(updatedSocials || {}).some(([key, val]) => val && val.trim() !== '');
  
  if (!hasSocialLinks) {
    return null; // Hide completely if no social links are available
  }
  
  return (
    <>
      {/* Display standard social platforms first */}
      {socialPlatforms.map(platform => 
        updatedSocials[platform.key] && (
          <SocialLinkItem 
            key={platform.key}
            platformType={platform.type} 
            url={updatedSocials[platform.key]} 
          />
        )
      )}
      
      {/* Handle any custom social links not in our predefined list */}
      {Object.entries(updatedSocials).map(([key, value]) => {
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
    </>
  );
};

export default SocialMediaLinks;
