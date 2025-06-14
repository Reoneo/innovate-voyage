
import React, { useState, useEffect } from 'react';
import ProfileAvatar from './ProfileAvatar';
import ProfileContact from './ProfileContact';
import NameSection from './identity/NameSection';
import AdditionalEnsDomains from './identity/AdditionalEnsDomains';
// BiographySection is not used directly here anymore if bio is in NameSection
// import BiographySection from './biography/BiographySection'; 
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
  keywords?: string[]; // New prop
}

const AvatarSection: React.FC<AvatarSectionProps> = ({ 
  avatarUrl, 
  name, 
  ownerAddress,
  socials = {},
  additionalEnsDomains = [],
  bio,
  displayIdentity,
  keywords // Destructure new prop
}) => {
  const [isOwner, setIsOwner] = useState(false);
  const isMobile = useIsMobile(); // This component is generally for mobile, but check is fine.
  
  useEffect(() => {
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    if (connectedWallet && ownerAddress && 
        connectedWallet.toLowerCase() === ownerAddress.toLowerCase()) {
      setIsOwner(true);
    }
  }, [ownerAddress]);
  
  const normalizedSocials: Record<string, string> = {};
  Object.entries(socials || {}).forEach(([key, value]) => {
    if (value && typeof value === 'string' && value.trim() !== '') {
      normalizedSocials[key.toLowerCase()] = value;
    }
  });

  const telephone = normalizedSocials.telephone || normalizedSocials.whatsapp;
  
  return (
    <div className={`flex flex-col items-center gap-2 w-full text-center ${isMobile ? 'px-2' : ''}`}>
      {/* Avatar */}
      <div className={isMobile ? 'mb-2' : 'mb-3'}>
        <ProfileAvatar 
          avatarUrl={avatarUrl} 
          name={name} 
        />
      </div>
      
      {/* Name, FollowStats, Bio, Keywords Section */}
      <div className={`w-full ${isMobile ? 'mb-2' : 'mb-3'}`}>
        <NameSection 
          name={name} 
          ownerAddress={ownerAddress}
          displayIdentity={displayIdentity}
          bio={bio} // Pass bio
          keywords={keywords} // Pass keywords
        />
      </div>
      
      {/* Additional ENS Domains */}
      {additionalEnsDomains && additionalEnsDomains.length > 0 && (
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
      
      {/* ENS Bio - Removed as it's now in NameSection */}
      {/* {bio && !keywords?.length && ( // Conditionally show if not in NameSection (though it is now)
        <div className={`w-full ${isMobile ? 'mb-2' : 'mb-3'} ${isMobile ? 'px-2' : ''}`}>
          <p className={`text-sm text-muted-foreground ${isMobile ? 'text-xs leading-relaxed' : ''}`}>
            {bio}
          </p>
        </div>
      )} */}
      
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
