
import React, { useState, useEffect } from 'react';
import ProfileAvatar from './ProfileAvatar';
import ProfileContact from './ProfileContact';
import NameSection from './identity/NameSection';
import AdditionalEnsDomains from './identity/AdditionalEnsDomains';
import BiographySection from './biography/BiographySection';
import { SocialIcon } from '@/components/ui/social-icon';
import { socialPlatforms } from '@/constants/socialPlatforms';

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
  
  // Check if we have any social links
  const hasSocialLinks = Object.keys(normalizedSocials).length > 0;
  
  return (
    <div className="flex flex-col items-center md:items-start gap-2">
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
      
      {/* Additional ENS Domains */}
      <AdditionalEnsDomains domains={additionalEnsDomains} />
      
      {/* Contact Info */}
      <ProfileContact 
        email={normalizedSocials.email}
        telephone={telephone}
        location={normalizedSocials.location}
        isOwner={isOwner}
      />
      
      {/* ENS Bio */}
      <BiographySection bio={bio} identity={displayIdentity} />
      
      {/* Social Links */}
      {hasSocialLinks && (
        <div className="w-full mt-4 grid grid-cols-4 sm:grid-cols-6 gap-2">
          {socialPlatforms.map((platform) => 
            normalizedSocials[platform.key] && (
              <a 
                key={platform.key}
                href={platform.key === 'whatsapp' ? `https://wa.me/${normalizedSocials[platform.key]}` : normalizedSocials[platform.key]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity bg-secondary/30 p-2 rounded-full flex items-center justify-center"
                aria-label={`Visit ${platform.key}`}
                title={platform.type.charAt(0).toUpperCase() + platform.type.slice(1)}
              >
                <SocialIcon 
                  type={platform.type as any} 
                  size={20}
                />
              </a>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AvatarSection;
