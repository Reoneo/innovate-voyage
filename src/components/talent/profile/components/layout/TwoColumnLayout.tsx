
import React from 'react';
import ProfileAvatar from '../ProfileAvatar';
import ProfileContact from '../ProfileContact';
import NameSection from '../identity/NameSection';
import AdditionalEnsDomains from '../identity/AdditionalEnsDomains';
import BiographySection from '../biography/BiographySection';
import SocialLinksSection from '../social/SocialLinksSection';
import FollowButton from '../identity/FollowButton';
import PoapSection from '../poap/PoapSection';
import TalentScoreBanner from '../TalentScoreBanner';
import FarcasterCastsSection from '../farcaster/FarcasterCastsSection';
import { useIsMobile } from '@/hooks/use-mobile';

interface TwoColumnLayoutProps {
  passport: any;
  ensNameOrAddress?: string;
  githubUsername: string | null;
  showGitHubSection: boolean;
}

const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  passport,
  ensNameOrAddress,
  githubUsername,
  showGitHubSection
}) => {
  const isMobile = useIsMobile();
  const [isOwner, setIsOwner] = React.useState(false);
  
  React.useEffect(() => {
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    if (connectedWallet && passport?.owner_address && 
        connectedWallet.toLowerCase() === passport.owner_address.toLowerCase()) {
      setIsOwner(true);
    }
  }, [passport?.owner_address]);

  // Format socials object to ensure all keys are lowercase for consistency
  const normalizedSocials: Record<string, string> = {};
  Object.entries(passport?.socials || {}).forEach(([key, value]) => {
    if (value && typeof value === 'string' && value.trim() !== '') {
      normalizedSocials[key.toLowerCase()] = value;
    }
  });

  const telephone = normalizedSocials.telephone || normalizedSocials.whatsapp;

  // Dynamic grid classes based on screen size
  const gridClasses = isMobile 
    ? "grid grid-cols-[80%_20%] gap-2 w-full px-2" 
    : "hidden md:grid md:grid-cols-[30%_70%] gap-8 w-full px-6";

  return (
    <div className={gridClasses}>
      {/* Column 1: Avatar to POAP Section */}
      <div className="space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <ProfileAvatar 
            avatarUrl={passport.avatar_url} 
            name={passport.name} 
          />
        </div>
        
        {/* Name and Address */}
        <div className="text-center">
          <NameSection 
            name={passport.name} 
            ownerAddress={passport.owner_address}
            displayIdentity={ensNameOrAddress}
          />
        </div>
        
        {/* Additional ENS Domains */}
        {passport.additionalEnsDomains?.length > 0 && (
          <div className="text-center">
            <AdditionalEnsDomains domains={passport.additionalEnsDomains} />
          </div>
        )}
        
        {/* Contact Info */}
        <div className="text-center">
          <ProfileContact 
            email={normalizedSocials.email}
            telephone={telephone}
            isOwner={isOwner}
          />
        </div>
        
        {/* Follow Button */}
        {!isOwner && passport.owner_address && (
          <div className="text-center">
            <FollowButton targetAddress={passport.owner_address} />
          </div>
        )}
        
        {/* ENS Bio */}
        {passport.bio && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {passport.bio}
            </p>
          </div>
        )}
        
        {/* Social Links */}
        <div className="text-center">
          <SocialLinksSection socials={normalizedSocials} identity={ensNameOrAddress} />
        </div>
        
        {/* POAP Section */}
        <div className="text-center">
          <PoapSection walletAddress={passport.owner_address} />
        </div>
      </div>
      
      {/* Column 2: Blockchain Activity and Rest */}
      <div className={`space-y-6 ${isMobile ? 'overflow-y-auto max-h-screen' : ''}`}>
        {/* Talent Score Banner (includes Blockchain Activity, GitHub, NFTs) */}
        <TalentScoreBanner 
          walletAddress={passport.owner_address} 
          githubUsername={githubUsername}
          showGitHubSection={showGitHubSection}
        />
        
        {/* Farcaster Section */}
        <FarcasterCastsSection 
          ensName={ensNameOrAddress?.includes('.') ? ensNameOrAddress : undefined}
          address={passport.owner_address}
        />
      </div>
    </div>
  );
};

export default TwoColumnLayout;
