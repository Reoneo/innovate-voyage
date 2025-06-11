
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
    <div className="bg-white flex flex-col justify-center items-center px-2 py-2 relative overflow-hidden h-full w-full" style={{ margin: '4px' }}>
      {/* Gradient background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-30"></div>
      
      <div className="relative z-10 space-y-3 text-center w-full max-w-md flex flex-col justify-center items-center">
        {/* Avatar - Larger size */}
        <div className="flex justify-center mb-2">
          <div className="w-40 h-40">
            <ProfileAvatar avatarUrl={passport.avatar_url} name={displayName} />
          </div>
        </div>
        
        {/* Name and Address */}
        <div className="mb-2">
          <NameSection name={passport.name} ownerAddress={passport.owner_address} displayIdentity={ensNameOrAddress} />
        </div>
        
        {/* Additional ENS Domains */}
        {passport.additionalEnsDomains?.length > 0 && (
          <div className="mb-2">
            <AdditionalEnsDomains domains={passport.additionalEnsDomains} />
          </div>
        )}
        
        {/* Contact Info */}
        <div className="mb-2">
          <ProfileContact email={normalizedSocials.email} telephone={telephone} isOwner={isOwner} />
        </div>
        
        {/* Follow Button - Reduced spacing */}
        {!isOwner && passport.owner_address && (
          <div className="mb-1">
            <FollowButton targetAddress={passport.owner_address} />
          </div>
        )}
        
        {/* ENS Bio - Display between follow button and POAP section */}
        {passport.bio && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg max-w-full">
            <h4 className="font-medium text-gray-800 mb-2 text-sm">About</h4>
            <p className="text-xs text-gray-600 leading-relaxed text-left">
              {passport.bio}
            </p>
          </div>
        )}
        
        {/* Social Links - Hide from main column since we'll show in popup */}
        <div className="hidden">
          <SocialLinksSection socials={normalizedSocials} identity={ensNameOrAddress} />
        </div>
        
        {/* POAP Section */}
        <div className="mt-2">
          <PoapSection walletAddress={passport.owner_address} />
        </div>
      </div>
    </div>
  );
};

export default MobileProfileColumn;
