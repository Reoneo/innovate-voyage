
import React from 'react';
import ProfileAvatar from '../ProfileAvatar';
import ProfileContact from '../ProfileContact';
import NameSection from '../identity/NameSection';
import AdditionalEnsDomains from '../identity/AdditionalEnsDomains';
import SocialLinksSection from '../social/SocialLinksSection';
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
  // Log the entire passport object to inspect its fields
  console.log('MobileProfileColumn: passport data:', passport);

  // Extract and prioritize ENS bio or description fields
  const ensBio =
    passport.bio ||
    passport.description ||
    passport.ens_bio ||
    '';

  // Log the derived ensBio value
  console.log('MobileProfileColumn: derived ensBio:', ensBio);
  console.log('MobileProfileColumn: passport.bio:', passport.bio);
  console.log('MobileProfileColumn: passport.description:', passport.description);
  console.log('MobileProfileColumn: passport.ens_bio:', passport.ens_bio);


  return (
    <div className="bg-white flex flex-col items-center px-2 py-2 relative overflow-y-auto h-full w-full" style={{
      margin: '2px'
    }}>
      {/* Gradient background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-30 py-[3px] my-[5px] mx-[5px] px-[6px]"></div>
      
      <div className="relative z-10 space-y-3 text-center w-full max-w-md flex flex-col items-center mx-0">
        {/* Avatar - Larger size - Positioned at top */}
        <div className="flex justify-center mb-2 mt-2">
          <div className="w-40 h-40">
            <ProfileAvatar avatarUrl={passport.avatar_url} name={displayName} />
          </div>
        </div>
        
        {/* Name and Address */}
        <div className="mb-2 my-0">
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

        {/* ENS Bio - Inserted here after contact and before POAP */}
        {ensBio && (
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 max-w-full w-full">
            <h4 className="font-semibold text-gray-800 mb-3 text-base flex items-center gap-2">
              <span className="text-blue-600">📝</span>
              About
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed text-left whitespace-pre-wrap">{ensBio}</p>
          </div>
        )}
        
        {/* Social Links - Hidden in this column */}
        <div className="hidden">
          <SocialLinksSection socials={normalizedSocials} identity={ensNameOrAddress} />
        </div>
        
        {/* POAP Section - Placed below the ENS bio */}
        <div className="mt-4 mb-4 w-full">
          <PoapSection walletAddress={passport.owner_address} />
        </div>
      </div>
    </div>
  );
};

export default MobileProfileColumn;
