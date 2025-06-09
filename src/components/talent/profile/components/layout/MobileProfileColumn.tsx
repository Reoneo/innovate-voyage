
import React from 'react';
import ProfileAvatar from '../ProfileAvatar';
import ProfileContact from '../ProfileContact';
import NameSection from '../identity/NameSection';
import AdditionalEnsDomains from '../identity/AdditionalEnsDomains';
import SocialLinksSection from '../social/SocialLinksSection';
import FollowButton from '../identity/FollowButton';
import PoapSection from '../poap/PoapSection';

interface MobileProfileColumnProps {
  passport: any;
  ensNameOrAddress?: string;
  normalizedSocials: Record<string, string>;
  telephone: string;
  isOwner: boolean;
  displayName: string;
}

const MobileProfileColumn: React.FC<MobileProfileColumnProps> = ({
  passport,
  ensNameOrAddress,
  normalizedSocials,
  telephone,
  isOwner,
  displayName
}) => {
  return (
    <div className="bg-white flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Gradient background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-30"></div>
      
      <div className="relative z-10 space-y-6 text-center w-full max-w-md">
        {/* Avatar - Square without border */}
        <div className="flex justify-center">
          <div className="w-48 h-48">
            <ProfileAvatar 
              avatarUrl={passport.avatar_url} 
              name={displayName}
            />
          </div>
        </div>
        
        {/* Name and Address */}
        <div>
          <NameSection 
            name={passport.name} 
            ownerAddress={passport.owner_address}
            displayIdentity={ensNameOrAddress}
          />
        </div>
        
        {/* Additional ENS Domains */}
        {passport.additionalEnsDomains?.length > 0 && (
          <div>
            <AdditionalEnsDomains domains={passport.additionalEnsDomains} />
          </div>
        )}
        
        {/* Contact Info */}
        <div>
          <ProfileContact 
            email={normalizedSocials.email}
            telephone={telephone}
            isOwner={isOwner}
          />
        </div>
        
        {/* Follow Button - matching desktop */}
        {!isOwner && passport.owner_address && (
          <div>
            <FollowButton targetAddress={passport.owner_address} />
          </div>
        )}
        
        {/* ENS Bio */}
        {passport.bio && (
          <div>
            <p className="text-sm text-muted-foreground">
              {passport.bio}
            </p>
          </div>
        )}
        
        {/* Social Links */}
        <div>
          <SocialLinksSection socials={normalizedSocials} identity={ensNameOrAddress} />
        </div>
        
        {/* POAP Section */}
        <div>
          <PoapSection walletAddress={passport.owner_address} />
        </div>
      </div>
    </div>
  );
};

export default MobileProfileColumn;
