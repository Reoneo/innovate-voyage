
import React from 'react';
import ProfileAvatar from './ProfileAvatar';
import NameSection from './identity/NameSection';
import SocialLinksSection from './social/SocialLinksSection';
import BiographySection from './biography/BiographySection';
import AdditionalEnsDomains from './identity/AdditionalEnsDomains';

interface AvatarSectionProps {
  avatarUrl?: string;
  name: string;
  ownerAddress: string;
  socials: Record<string, string>;
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
  additionalEnsDomains = []
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col items-center">
        <ProfileAvatar avatarUrl={avatarUrl} name={name} size="xl" />
        
        <NameSection 
          name={name} 
          ownerAddress={ownerAddress} 
          displayIdentity={displayIdentity} 
        />
        
        <AdditionalEnsDomains domains={additionalEnsDomains} />
        
        <SocialLinksSection socials={socials} identity={displayIdentity} />
        
        <BiographySection bio={bio} />
      </div>
    </div>
  );
};

export default AvatarSection;
