
import React from 'react';
import ProfileAvatar from './ProfileAvatar';
import NameSection from './identity/NameSection';
import AddressDisplay from './identity/AddressDisplay';
import AdditionalEnsDomains from './identity/AdditionalEnsDomains';
import SocialLinksSection from './social/SocialLinksSection';
import PoapSection from './poap/PoapSection';

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
  additionalEnsDomains
}) => {
  return (
    <div className="flex flex-col items-center text-center space-y-4 w-full">
      <ProfileAvatar 
        avatarUrl={avatarUrl} 
        name={name} 
        size="large"
      />
      
      <div className="space-y-2 w-full">
        <NameSection name={name} bio={bio} />
        <AddressDisplay address={ownerAddress} />
        <AdditionalEnsDomains domains={additionalEnsDomains} />
      </div>

      <SocialLinksSection 
        socials={socials} 
        identity={displayIdentity}
      />

      {/* POAP Section */}
      <PoapSection 
        walletAddress={ownerAddress} 
        className="w-full pt-4 border-t"
      />
    </div>
  );
};

export default AvatarSection;
