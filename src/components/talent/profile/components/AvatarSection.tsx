
import React, { useState, useEffect } from 'react';
import ProfileAvatar from './ProfileAvatar';
import ProfileContact from './ProfileContact';
import NameSection from './identity/NameSection';
import AdditionalEnsDomains from './identity/AdditionalEnsDomains';
import BiographySection from './biography/BiographySection';
import SocialLinksSection from './social/SocialLinksSection';
import FollowButton from './identity/FollowButton';
import PoapSection from './poap/PoapSection';

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
  
  // Check if there are any social links
  const hasSocialLinks = Object.entries(normalizedSocials || {}).some(([key, val]) => val && val.trim() !== '');
  
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
      
      {/* Additional ENS Domains */}
      <AdditionalEnsDomains domains={additionalEnsDomains} />
      
      {/* Contact Info */}
      <ProfileContact 
        email={normalizedSocials.email}
        telephone={telephone}
        isOwner={isOwner}
      />
      
      {/* Follow Button - Moved above Bio section */}
      {!isOwner && ownerAddress && (
        <div className="mb-3">
          <FollowButton targetAddress={ownerAddress} />
        </div>
      )}
      
      {/* ENS Bio */}
      {bio && (
        <div className="mb-3">
          <p className="text-sm text-muted-foreground">{bio}</p>
        </div>
      )}
      
      {/* Social Links */}
      <SocialLinksSection socials={normalizedSocials} identity={displayIdentity} />
      
      {/* POAP Section - Reduced spacing */}
      <div className="w-full mt-2">
        <PoapSection walletAddress={ownerAddress} />
      </div>
    </div>
  );
};

export default AvatarSection;
