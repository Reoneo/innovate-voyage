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
  return <div className="bg-white flex flex-col justify-center items-center p-6 relative overflow-hidden h-full">
      {/* Gradient background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-30"></div>
      
      <div className="relative z-10 space-y-4 text-center w-full max-w-md flex flex-col justify-center h-full">
        {/* Avatar - Square without border */}
        <div className="flex justify-center py-0 mx-0 my-0 px-[3px] bg-transparent">
          <div className="w-32 h-32">
            <ProfileAvatar avatarUrl={passport.avatar_url} name={displayName} />
          </div>
        </div>
        
        {/* Name and Address */}
        <div className="py-0 my-2">
          <NameSection name={passport.name} ownerAddress={passport.owner_address} displayIdentity={ensNameOrAddress} />
        </div>
        
        {/* Additional ENS Domains */}
        {passport.additionalEnsDomains?.length > 0 && <div>
            <AdditionalEnsDomains domains={passport.additionalEnsDomains} />
          </div>}
        
        {/* Contact Info */}
        <div>
          <ProfileContact email={normalizedSocials.email} telephone={telephone} isOwner={isOwner} />
        </div>
        
        {/* Follow Button - matching desktop */}
        {!isOwner && passport.owner_address && <div>
            <FollowButton targetAddress={passport.owner_address} />
          </div>}
        
        {/* ENS Bio - Display the bio prominently */}
        {passport.bio && <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">About</h4>
            <p className="text-sm text-gray-600 leading-relaxed text-left">
              {passport.bio}
            </p>
          </div>}
        
        {/* Social Links - Hide from main column since we'll show in popup */}
        <div className="hidden">
          <SocialLinksSection socials={normalizedSocials} identity={ensNameOrAddress} />
        </div>
        
        {/* POAP Section */}
        <div className="my-0">
          <PoapSection walletAddress={passport.owner_address} />
        </div>
      </div>
    </div>;
};
export default MobileProfileColumn;