import React, { useState, useEffect } from 'react';
import ProfileAvatar from './ProfileAvatar';
import ProfileContact from './ProfileContact';
import NameSection from './identity/NameSection';
import AdditionalEnsDomains from './identity/AdditionalEnsDomains';
import BiographySection from './biography/BiographySection';
import SocialLinksSection from './social/SocialLinksSection';
import FollowersSection from './followers';
import MetaTags from './MetaTags';

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
  
  useEffect(() => {
    console.log("AvatarSection - Social links:", socials);
  }, [socials]);
  
  return (
    <div className="flex flex-col items-center gap-2 w-full text-center">
      <MetaTags avatarUrl={avatarUrl} />
      
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
        email={socials.email}
        telephone={socials.telephone || socials.whatsapp}
        isOwner={isOwner}
      />
      
      {bio && (
        <div className="w-full px-4 py-2">
          <p className="text-sm text-muted-foreground">{bio}</p>
        </div>
      )}
      
      <div className="w-full flex justify-center mt-2">
        <SocialLinksSection socials={socials} displayIdentity={displayIdentity} />
      </div>
    </div>
  );
};

export default AvatarSection;
