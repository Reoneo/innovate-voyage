
import React, { useState, useEffect } from 'react';
import ProfileAvatar from './ProfileAvatar';
import ProfileContact from './ProfileContact';
import AdditionalEnsDomains from './identity/AdditionalEnsDomains';
import BiographySection from './biography/BiographySection';
import SocialLinksSection from './social/SocialLinksSection';
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

  // Create display name with proper formatting
  const displayName = displayIdentity || (name && !name.includes('.') && name.match(/^[a-zA-Z0-9]+$/)
    ? `${name}.eth`
    : name);
  
  return (
    <div className="flex flex-col items-center gap-2 w-full text-center">
      {/* Avatar */}
      <ProfileAvatar 
        avatarUrl={avatarUrl} 
        name={name} 
      />
      
      {/* Name and Address */}
      <div className="mt-2 text-center">
        <h3 className="text-2xl font-semibold">{displayName}</h3>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-sm text-muted-foreground">{ownerAddress}</span>
        </div>
      </div>
      
      {/* Additional ENS Domains */}
      <AdditionalEnsDomains domains={additionalEnsDomains} />
      
      {/* Contact Info */}
      <ProfileContact 
        email={normalizedSocials.email}
        telephone={telephone}
        isOwner={isOwner}
      />
      
      {/* ENS Bio */}
      {bio && (
        <div className="mb-3">
          <p className="text-sm text-muted-foreground">{bio}</p>
        </div>
      )}
      
      {/* Social Links */}
      <SocialLinksSection socials={normalizedSocials} identity={displayIdentity} />
      
      {/* POAP Section - Added after social links */}
      <div className="mt-4 w-full">
        <PoapSection walletAddress={ownerAddress} />
      </div>
    </div>
  );
};

export default AvatarSection;
