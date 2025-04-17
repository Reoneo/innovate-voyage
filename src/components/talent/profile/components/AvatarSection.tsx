
import React, { useState, useEffect } from 'react';
import ProfileAvatar from './ProfileAvatar';
import ProfileContact from './ProfileContact';
import NameSection from './identity/NameSection';
import AdditionalEnsDomains from './identity/AdditionalEnsDomains';
import BiographySection from './biography/BiographySection';
import SocialLinksSection from './social/SocialLinksSection';
import FollowersSection from './followers';

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
  
  useEffect(() => {
    const existingThumbnailTags = document.querySelectorAll('meta[property="og:image"], meta[name="thumbnail"]');
    existingThumbnailTags.forEach(tag => tag.remove());
    
    if (avatarUrl) {
      const ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      ogImage.setAttribute('content', avatarUrl);
      document.head.appendChild(ogImage);
      
      const thumbnail = document.createElement('meta');
      thumbnail.setAttribute('name', 'thumbnail');
      thumbnail.setAttribute('content', avatarUrl);
      document.head.appendChild(thumbnail);
      
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
  
  // Log social links to help with debugging
  useEffect(() => {
    console.log("AvatarSection - Social links:", socials);
  }, [socials]);
  
  const normalizedSocials: Record<string, string> = {};
  Object.entries(socials || {}).forEach(([key, value]) => {
    if (value && typeof value === 'string' && value.trim() !== '') {
      normalizedSocials[key.toLowerCase()] = value;
    }
  });

  const telephone = normalizedSocials.telephone || normalizedSocials.whatsapp;
  
  return (
    <div className="flex flex-col items-center gap-2 w-full text-center">
      <ProfileAvatar 
        avatarUrl={avatarUrl} 
        name={name} 
      />
      
      <NameSection 
        name={name} 
        ownerAddress={ownerAddress}
        displayIdentity={displayIdentity}
      />
      
      {additionalEnsDomains && additionalEnsDomains.length > 0 && (
        <AdditionalEnsDomains domains={additionalEnsDomains.slice(0, 50)} />
      )}
      
      <FollowersSection 
        walletAddress={ownerAddress}
        ensName={displayIdentity?.includes('.eth') ? displayIdentity : undefined}
      />
      
      <ProfileContact 
        email={normalizedSocials.email}
        telephone={telephone}
        isOwner={isOwner}
      />
      
      {bio && (
        <div className="w-full px-4 py-2">
          <p className="text-sm text-muted-foreground">{bio}</p>
        </div>
      )}
      
      {/* Social links section - now more prominent */}
      <SocialLinksSection socials={normalizedSocials} identity={displayIdentity} />
    </div>
  );
};

export default AvatarSection;
