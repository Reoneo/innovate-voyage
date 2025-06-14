
import React, { useState, useEffect } from 'react';
import ProfileAvatar from './ProfileAvatar';
import ProfileContact from './ProfileContact';
import NameSection from './identity/NameSection';
import AdditionalEnsDomains from './identity/AdditionalEnsDomains';
import BiographySection from './biography/BiographySection';
import SocialLinksSection from './social/SocialLinksSection';
import FollowButton from './identity/FollowButton';
import PoapSection from './poap/PoapSection';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
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

  const telephone = normalizedSocials.telephone || normalizedSocials.whatsapp;
  const hasSocialLinks = Object.entries(normalizedSocials || {}).some(([key, val]) => val && val.trim() !== '');
  
  return (
    <div className={`flex flex-col items-center gap-2 w-full text-center ${isMobile ? 'px-2' : ''}`}>
      {/* Avatar */}
      <div className={isMobile ? 'mb-1' : 'mb-1'}>
        <ProfileAvatar 
          avatarUrl={avatarUrl} 
          name={name} 
        />
      </div>
      
      {/* Name and Address */}
      <div className={`w-full ${isMobile ? 'mb-2' : 'mb-3'}`}>
        <NameSection 
          name={name} 
          ownerAddress={ownerAddress}
          displayIdentity={displayIdentity}
        />
      </div>
      
      {/* Additional ENS Domains */}
      {additionalEnsDomains.length > 0 && (
        <div className={`w-full ${isMobile ? 'mb-2' : 'mb-3'}`}>
          <AdditionalEnsDomains domains={additionalEnsDomains} />
        </div>
      )}
      
      {/* Contact Info */}
      <div className={`w-full ${isMobile ? 'mb-2' : 'mb-3'}`}>
        <ProfileContact 
          email={normalizedSocials.email}
          telephone={telephone}
          isOwner={isOwner}
        />
      </div>
      
      {/* Follow Button */}
      {!isOwner && ownerAddress && (
        <div className={`w-full ${isMobile ? 'mb-2' : 'mb-3'}`}>
          <FollowButton targetAddress={ownerAddress} />
        </div>
      )}
      
      {/* ENS Bio */}
      {bio && (
        <div className={`w-full ${isMobile ? 'mb-2' : 'mb-3'} ${isMobile ? 'px-2' : ''}`}>
          <p className={`text-sm text-muted-foreground ${isMobile ? 'text-xs leading-relaxed' : ''}`}>
            {bio}
          </p>
        </div>
      )}
      
      {/* Social Links */}
      <div className={`w-full ${isMobile ? 'mb-2' : 'mb-3'}`}>
        <SocialLinksSection socials={normalizedSocials} identity={displayIdentity} />
      </div>
      
      {/* POAP Section */}
      <div className="w-full">
        <PoapSection walletAddress={ownerAddress} />
      </div>
    </div>
  );
};

export default AvatarSection;

