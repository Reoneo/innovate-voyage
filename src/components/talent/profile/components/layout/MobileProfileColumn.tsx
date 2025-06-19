
import React from 'react';
import ProfileAvatar from '../ProfileAvatar';
import ProfileContact from '../ProfileContact';
import NameSection from '../identity/NameSection';
import AdditionalEnsDomains from '../identity/AdditionalEnsDomains';
import SocialLinksSection from '../social/SocialLinksSection';
import PoapSection from '../poap/PoapSection';
import { Card } from '@/components/ui/card';

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
    <div className="w-full">
      {/* CV Header - Professional Layout */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
        {/* Avatar - Professional Size */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 sm:w-28 sm:h-28">
            <ProfileAvatar avatarUrl={passport.avatar_url} name={displayName} />
          </div>
        </div>
        
        {/* Name and Core Info */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <NameSection name={passport.name} ownerAddress={passport.owner_address} displayIdentity={ensNameOrAddress} />
          
          {/* Additional ENS Domains */}
          {passport.additionalEnsDomains?.length > 0 && (
            <AdditionalEnsDomains domains={passport.additionalEnsDomains} />
          )}
          
          {/* Contact Info */}
          <ProfileContact email={normalizedSocials.email} telephone={telephone} isOwner={isOwner} />
        </div>
      </div>

      {/* Professional Bio Section */}
      {(passport.bio || passport.description || passport.ens_bio) && (
        <Card className="p-4 mb-6 bg-white border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
            Professional Summary
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {passport.bio || passport.description || passport.ens_bio}
          </p>
        </Card>
      )}

      {/* Social Links - Compact Professional Display */}
      <Card className="p-4 mb-6 bg-white border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
          Professional Links
        </h4>
        <SocialLinksSection socials={normalizedSocials} identity={ensNameOrAddress} />
      </Card>

      {/* POAP Section - Professional Display */}
      <Card className="p-4 bg-white border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
          Achievements & Certifications
        </h4>
        <PoapSection walletAddress={passport.owner_address} />
      </Card>
    </div>
  );
};

export default MobileProfileColumn;
