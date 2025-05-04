
import React, { useEffect, useState } from 'react';
import SocialLinkItem from './SocialLinkItem';
import { socialPlatforms } from '@/constants/socialPlatforms';
import { Loader2 } from 'lucide-react';

interface SocialMediaLinksProps {
  socials: Record<string, string>;
  isLoading?: boolean;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ socials, isLoading = false }) => {
  const [processedSocials, setProcessedSocials] = useState<Record<string, string>>(socials || {});

  // Effect to handle socials when they change
  useEffect(() => {
    console.log("Social links received:", socials);
    setProcessedSocials(socials || {});
  }, [socials]);
  
  // Create a filtered version of socials without LinkedIn for home page
  const updatedSocials = { ...processedSocials };
  
  // Remove LinkedIn if we're on the home page
  if (typeof window !== 'undefined' && window.location.pathname === '/' && updatedSocials.linkedin) {
    delete updatedSocials.linkedin;
  }
  
  if (isLoading) {
    return (
      <div className="col-span-full flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading social links...</span>
      </div>
    );
  }
  
  // Check if we have any actual social links
  const hasSocialLinks = Object.entries(updatedSocials || {}).some(([_key, val]) => val && val.trim() !== '');
  
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
