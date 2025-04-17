
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
  
  // Social media links to display
  const socialLinksToShow = [
    'linkedin', 'twitter', 'github', 'facebook', 'instagram', 
    'youtube', 'telegram', 'bluesky', 'discord', 'website', 
    'whatsapp', 'location'
  ];
  
  // Check if we have any social links to display
  const hasSocialLinks = socialLinksToShow.some(key => normalizedSocials[key]);
  
  // For testing: add some example links if none exist for this user
  if (!hasSocialLinks && displayIdentity === "30315.eth") {
    normalizedSocials.github = "example";
    normalizedSocials.twitter = "example";
    normalizedSocials.linkedin = "example";
  }
  
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
      
      {/* Social links section */}
      <div className="w-full mt-3 pt-3 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-500 mb-3">Social Links</h4>
        <div className="profile-social">
          {socialLinksToShow.map(key => 
            normalizedSocials[key] && (
              <a 
                key={key}
                href={formatSocialUrl(key, normalizedSocials[key])}
                target="_blank" 
                rel="noopener noreferrer"
                title={key.charAt(0).toUpperCase() + key.slice(1)}
                className="hover:opacity-80 transition-opacity"
              >
                <img 
                  src={getSocialIconUrl(key)} 
                  alt={key} 
                  width={24} 
                  height={24} 
                  className="rounded-full"
                />
              </a>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to format social URLs correctly
const formatSocialUrl = (type: string, url: string): string => {
  switch (type) {
    case 'whatsapp':
      return url.startsWith('https://') ? url : `https://wa.me/${url.replace(/[^0-9]/g, '')}`;
    case 'website':
    case 'globe':
      return url.startsWith('http') ? url : `https://${url}`;
    case 'email':
    case 'mail':
      return url.startsWith('mailto:') ? url : `mailto:${url}`;
    case 'twitter':
      return !url.startsWith('http') ? `https://twitter.com/${url.replace('@', '')}` : url;
    case 'github':
      return !url.startsWith('http') ? `https://github.com/${url.replace('@', '')}` : url;
    case 'linkedin':
      return !url.startsWith('http') ? `https://linkedin.com/in/${url.replace('@', '')}` : url;
    case 'location':
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(url)}`;
    default:
      return !url.startsWith('http') ? `https://${url}` : url;
  }
};

// Helper function to get social icon URLs
const getSocialIconUrl = (type: string): string => {
  const iconMap: Record<string, string> = {
    linkedin: "https://cdn-icons-png.flaticon.com/512/145/145807.png",
    whatsapp: "https://cdn-icons-png.flaticon.com/512/5968/5968841.png",
    twitter: "https://cdn-icons-png.flaticon.com/512/5969/5969020.png",
    facebook: "https://cdn-icons-png.flaticon.com/512/5968/5968764.png",
    instagram: "https://cdn-icons-png.flaticon.com/512/15707/15707749.png",
    github: "https://cdn-icons-png.flaticon.com/512/1051/1051326.png",
    youtube: "https://cdn-icons-png.flaticon.com/512/3670/3670147.png",
    telegram: "https://cdn-icons-png.flaticon.com/512/5968/5968804.png",
    bluesky: "https://www.iconpacks.net/icons/free-icons-7/free-bluesky-blue-round-circle-logo-icon-24461.png",
    location: "https://cdn-icons-png.flaticon.com/512/355/355980.png",
    website: "https://cdn-icons-png.flaticon.com/512/3059/3059997.png",
    discord: "https://cdn-icons-png.flaticon.com/512/5968/5968756.png"
  };
  
  return iconMap[type] || "https://cdn-icons-png.flaticon.com/512/3059/3059997.png";
};

export default AvatarSection;
