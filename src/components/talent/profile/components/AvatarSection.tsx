
import React, { useState, useEffect } from 'react';
import ProfileAvatar from './ProfileAvatar';
import ProfileContact from './ProfileContact';
import NameSection from './identity/NameSection';
import AdditionalEnsDomains from './identity/AdditionalEnsDomains';
import BiographySection from './biography/BiographySection';
import SocialLinksSection from './social/SocialLinksSection';
import FollowersSection from './FollowersSection';

interface AvatarSectionProps {
  avatarUrl: string;
  name: string;
  ownerAddress: string;
  socials?: Record<string, string>;
  additionalEnsDomains?: string[];
  bio?: string;
  displayIdentity?: string;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({ 
  avatarUrl, 
  name, 
  ownerAddress,
  socials = {},
  additionalEnsDomains = [],
  bio,
  displayIdentity
}) => {
  const [isOwner, setIsOwner] = useState(false);
  
  // Add a meta tag for thumbnail when saving to favorites
  useEffect(() => {
    // Remove any existing thumbnail meta tags
    const existingThumbnailTags = document.querySelectorAll('meta[property="og:image"], meta[name="thumbnail"]');
    existingThumbnailTags.forEach(tag => tag.remove());
    
    // Add new thumbnail meta tags if avatar URL exists
    if (avatarUrl) {
      // Open Graph image tag (used by many platforms)
      const ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      ogImage.setAttribute('content', avatarUrl);
      document.head.appendChild(ogImage);
      
      // Standard thumbnail tag
      const thumbnail = document.createElement('meta');
      thumbnail.setAttribute('name', 'thumbnail');
      thumbnail.setAttribute('content', avatarUrl);
      document.head.appendChild(thumbnail);
      
      // Apple touch icon (for iOS devices)
      const appleIcon = document.createElement('link');
      appleIcon.setAttribute('rel', 'apple-touch-icon');
      appleIcon.setAttribute('href', avatarUrl);
      document.head.appendChild(appleIcon);
    }
  }, [avatarUrl]);
  
  useEffect(() => {
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    if (connectedWallet && ownerAddress && 
        connectedWallet.toLowerCase() === ownerAddress.toLowerCase()) {
      setIsOwner(true);
    }
  }, [ownerAddress]);
  
  // Format socials object to ensure all keys are lowercase for consistency
  const normalizedSocials: Record<string, string> = {};
  Object.entries(socials || {}).forEach(([key, value]) => {
    if (value && typeof value === 'string' && value.trim() !== '') {
      normalizedSocials[key.toLowerCase()] = value;
    }
  });

  // Use WhatsApp as telephone if available and no direct telephone
  const telephone = normalizedSocials.telephone || normalizedSocials.whatsapp;
  
  return (
    <div className="flex flex-col items-center gap-2 w-full text-center">
      {/* Avatar */}
      <ProfileAvatar 
        avatarUrl={avatarUrl} 
        name={name} 
      />
      
      {/* Name and Address */}
      <NameSection 
        name={name} 
        ownerAddress={ownerAddress}
        displayIdentity={displayIdentity}
      />
      
      {/* Additional ENS Domains - Limit to improve performance */}
      {additionalEnsDomains && additionalEnsDomains.length > 0 && (
        <AdditionalEnsDomains domains={additionalEnsDomains.slice(0, 50)} />
      )}
      
      {/* Followers and Following */}
      <FollowersSection 
        walletAddress={ownerAddress}
        ensName={displayIdentity?.includes('.eth') ? displayIdentity : undefined}
      />
      
      {/* Contact Info */}
      <ProfileContact 
        email={normalizedSocials.email}
        telephone={telephone}
        isOwner={isOwner}
      />
      
      {/* ENS Bio - Only show if bio exists */}
      {bio && (
        <div className="w-full px-4 py-2">
          <p className="text-sm text-muted-foreground">{bio}</p>
        </div>
      )}
      
      {/* Social Links */}
      <SocialLinksSection socials={normalizedSocials} identity={displayIdentity} />
    </div>
  );
};

export default AvatarSection;
