
import React from 'react';
import ProfileAvatar from './ProfileAvatar';
import ProfileInfo from './ProfileInfo';
import ProfileContact from './ProfileContact';
import ProfileSocialLinks from './social/ProfileSocialLinks';
import AdditionalEnsDomains from './identity/AdditionalEnsDomains';
import FollowerStats from './identity/FollowerStats';

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
    <div className="w-full flex flex-col items-center">
      <ProfileAvatar 
        avatarUrl={avatarUrl} 
        name={name} 
      />
      <ProfileInfo 
        name={name}
        passportId={name}
        ownerAddress={ownerAddress}
        identity={displayIdentity}
        socials={socials}
      />
      
      {/* Add follower stats */}
      <FollowerStats walletAddress={ownerAddress} />
      
      <div className="mt-2 mb-3 px-5 py-3 w-full">
        {bio && (
          <p className="text-gray-800 text-center mb-4">{bio}</p>
        )}
        <ProfileContact 
          email={socials?.email}
          telephone={socials?.telephone}
          ownerAddress={ownerAddress}
          socials={socials}
        />
      </div>
      
      <div className="w-full flex justify-center">
        <ProfileSocialLinks 
          passportId={name}
          initialSocials={socials}
        />
      </div>
      
      {additionalEnsDomains && additionalEnsDomains.length > 0 && (
        <AdditionalEnsDomains domains={additionalEnsDomains} />
      )}
    </div>
  );
};

export default AvatarSection;
