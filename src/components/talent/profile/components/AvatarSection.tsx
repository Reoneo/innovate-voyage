
import React from 'react';
import ProfileAvatar from './ProfileAvatar';
import NameSection from './identity/NameSection';
import AdditionalEnsDomains from './identity/AdditionalEnsDomains';
import AddressDisplay from './identity/AddressDisplay';
import SocialLinksSection from './social/SocialLinksSection';

interface AvatarSectionProps {
  avatarUrl?: string;
  name?: string;
  ownerAddress: string;
  socials?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    [key: string]: string | undefined;
  };
  bio?: string;
  displayIdentity?: string;
  additionalEnsDomains?: string[];
}

const AvatarSection: React.FC<AvatarSectionProps> = ({
  avatarUrl,
  name,
  ownerAddress,
  socials,
  bio,
  displayIdentity,
  additionalEnsDomains
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <ProfileAvatar 
        src={avatarUrl} 
        alt={name || 'Profile'} 
        fallback={name?.charAt(0) || '?'} 
      />
      
      <NameSection 
        name={name}
        displayIdentity={displayIdentity}
        ownerAddress={ownerAddress}
      />
      
      {additionalEnsDomains && additionalEnsDomains.length > 0 && (
        <AdditionalEnsDomains domains={additionalEnsDomains} />
      )}
      
      <AddressDisplay address={ownerAddress} />
      
      {bio && (
        <div className="text-sm text-muted-foreground">
          {bio}
        </div>
      )}
      
      <SocialLinksSection socials={socials} />
    </div>
  );
};

export default AvatarSection;
