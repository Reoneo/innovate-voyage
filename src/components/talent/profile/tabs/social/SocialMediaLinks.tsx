
import React from 'react';
import SocialLinkItem from './SocialLinkItem';
import { Loader2 } from 'lucide-react';

interface SocialMediaLinksProps {
  socials: Record<string, string>;
  isLoading?: boolean;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ socials, isLoading = false }) => {
  // Create a filtered version of socials without LinkedIn for home page
  const updatedSocials = { ...socials };
  
  // Remove LinkedIn if we're on the home page
  if (window.location.pathname === '/' && updatedSocials.linkedin) {
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
  const hasSocialLinks = Object.entries(updatedSocials || {}).some(([key, val]) => val && val.trim() !== '');
  
  if (!hasSocialLinks) {
    return null; // Hide completely if no social links are available
  }

  // Sort social links alphabetically by key
  const sortedSocialEntries = Object.entries(updatedSocials)
    .filter(([_, value]) => value && value.trim() !== '')
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
  
  return (
    <>
      {sortedSocialEntries.map(([key, value]) => (
        <SocialLinkItem 
          key={key}
          platformType={key} 
          url={value} 
        />
      ))}
    </>
  );
};

export default SocialMediaLinks;
