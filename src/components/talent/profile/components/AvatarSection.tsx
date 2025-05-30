
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
  
  // Determine spacing based on content availability
  const hasContentBetweenFollowAndPoap = bio || hasSocialLinks;
  
  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-full text-center px-2">
      {/* Avatar */}
      <div className="w-full flex justify-center">
        <ProfileAvatar 
          avatarUrl={avatarUrl} 
          name={name} 
        />
      </div>
      
      {/* Name and Address */}
      <div className="w-full max-w-full">
        <NameSection 
          name={name} 
          ownerAddress={ownerAddress}
          displayIdentity={displayIdentity}
        />
      </div>
      
      {/* Additional ENS Domains */}
      <div className="w-full max-w-full">
        <AdditionalEnsDomains domains={additionalEnsDomains} />
      </div>
      
      {/* Contact Info */}
      <div className="w-full max-w-full">
        <ProfileContact 
          email={normalizedSocials.email}
          telephone={telephone}
          isOwner={isOwner}
        />
      </div>
      
      {/* Follow Button - Moved above Bio section */}
      {!isOwner && ownerAddress && (
        <div className="mb-3 w-full flex justify-center">
          <FollowButton targetAddress={ownerAddress} />
        </div>
      )}
      
      {/* ENS Bio */}
      {bio && (
        <div className="mb-3 w-full max-w-full px-2">
          <p className="text-sm text-muted-foreground break-words">{bio}</p>
        </div>
      )}
      
      {/* Social Links */}
      <div className="w-full max-w-full">
        <SocialLinksSection socials={normalizedSocials} identity={displayIdentity} />
      </div>
      
      {/* POAP Section - Reduced spacing when no content above */}
      <div className={`w-full max-w-full ${hasContentBetweenFollowAndPoap ? 'mt-4' : 'mt-1'}`}>
        <PoapSection walletAddress={ownerAddress} />
      </div>
    </div>
  );
};

export default AvatarSection;
