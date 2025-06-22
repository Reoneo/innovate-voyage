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
import GitHubContributionGraph from '../github/GitHubContributionGraph';
import FarcasterCastsSection from '../farcaster/FarcasterCastsSection';
import MobileLayout from './MobileLayout';
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

  // Mobile: Use single column layout with desktop styling
  if (isMobile) {
    return (
      <MobileLayout 
        passport={passport}
        ensNameOrAddress={ensNameOrAddress}
        githubUsername={githubUsername}
        showGitHubSection={showGitHubSection}
      />
    );
  }

  // Desktop: Two column layout (unchanged)
  return (
    <div className="grid md:grid-cols-[30%_70%] gap-8 w-full px-6">
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
      <div className="space-y-6">
        {/* Talent Score Banner */}
        <TalentScoreBanner walletAddress={passport.owner_address} />
        
        {/* GitHub Section */}
        {showGitHubSection && (
          <GitHubContributionGraph username={githubUsername!} />
        )}
        
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
