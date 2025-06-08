
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfileAvatar from '../ProfileAvatar';
import ProfileContact from '../ProfileContact';
import NameSection from '../identity/NameSection';
import AdditionalEnsDomains from '../identity/AdditionalEnsDomains';
import SocialLinksSection from '../social/SocialLinksSection';
import FollowButton from '../identity/FollowButton';
import PoapSection from '../poap/PoapSection';
import TalentScoreBanner from '../TalentScoreBanner';
import FarcasterCastsSection from '../farcaster/FarcasterCastsSection';

interface A4LayoutProps {
  passport: any;
  ensNameOrAddress?: string;
  githubUsername: string | null;
  showGitHubSection: boolean;
}

const A4Layout: React.FC<A4LayoutProps> = ({
  passport,
  ensNameOrAddress,
  githubUsername,
  showGitHubSection
}) => {
  const [isOwner, setIsOwner] = React.useState(false);
  const isMobile = useIsMobile();
  
  React.useEffect(() => {
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    if (connectedWallet && passport?.owner_address && 
        connectedWallet.toLowerCase() === passport.owner_address.toLowerCase()) {
      setIsOwner(true);
    }
  }, [passport?.owner_address]);

  const normalizedSocials: Record<string, string> = {};
  Object.entries(passport?.socials || {}).forEach(([key, value]) => {
    if (value && typeof value === 'string' && value.trim() !== '') {
      normalizedSocials[key.toLowerCase()] = value;
    }
  });

  const telephone = normalizedSocials.telephone || normalizedSocials.whatsapp;

  if (isMobile) {
    // Mobile layout - single column
    return (
      <div className="w-full max-w-sm mx-auto bg-white rounded-lg shadow-lg p-4 space-y-4">
        {/* Mobile Header */}
        <div className="flex flex-col items-center space-y-3">
          <ProfileAvatar 
            avatarUrl={passport.avatar_url} 
            name={passport.name} 
          />
          
          <div className="text-center space-y-2">
            <NameSection 
              name={passport.name} 
              ownerAddress={passport.owner_address}
              displayIdentity={ensNameOrAddress}
            />
            
            {passport.additionalEnsDomains?.length > 0 && (
              <AdditionalEnsDomains domains={passport.additionalEnsDomains} />
            )}
            
            <ProfileContact 
              email={normalizedSocials.email}
              telephone={telephone}
              isOwner={isOwner}
            />
            
            {!isOwner && passport.owner_address && (
              <FollowButton targetAddress={passport.owner_address} />
            )}
            
            {passport.bio && (
              <p className="text-xs text-muted-foreground px-2">
                {passport.bio}
              </p>
            )}
          </div>
        </div>
        
        {/* Mobile Content */}
        <div className="space-y-4">
          <SocialLinksSection socials={normalizedSocials} identity={ensNameOrAddress} />
          
          <TalentScoreBanner 
            walletAddress={passport.owner_address} 
            githubUsername={githubUsername}
            showGitHubSection={showGitHubSection}
          />
          
          <FarcasterCastsSection 
            ensName={ensNameOrAddress?.includes('.') ? ensNameOrAddress : undefined}
            address={passport.owner_address}
          />
          
          <PoapSection walletAddress={passport.owner_address} />
        </div>
      </div>
    );
  }

  // Desktop layout - two column
  return (
    <div 
      className="bg-white mx-auto shadow-lg"
      style={{
        width: '210mm',
        minHeight: '297mm',
        maxWidth: '210mm',
        padding: '15mm',
        boxSizing: 'border-box'
      }}
    >
      {/* Desktop Header Section */}
      <div className="flex items-start gap-6 mb-8">
        <div className="flex-shrink-0">
          <ProfileAvatar 
            avatarUrl={passport.avatar_url} 
            name={passport.name} 
          />
        </div>
        
        <div className="flex-1">
          <NameSection 
            name={passport.name} 
            ownerAddress={passport.owner_address}
            displayIdentity={ensNameOrAddress}
          />
          
          {passport.additionalEnsDomains?.length > 0 && (
            <div className="mt-2">
              <AdditionalEnsDomains domains={passport.additionalEnsDomains} />
            </div>
          )}
          
          <div className="mt-3">
            <ProfileContact 
              email={normalizedSocials.email}
              telephone={telephone}
              isOwner={isOwner}
            />
          </div>
          
          {!isOwner && passport.owner_address && (
            <div className="mt-3">
              <FollowButton targetAddress={passport.owner_address} />
            </div>
          )}
          
          {passport.bio && (
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">
                {passport.bio}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Desktop Two Column Layout */}
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Social Links</h3>
            <SocialLinksSection socials={normalizedSocials} identity={ensNameOrAddress} />
          </div>
          
          <div>
            <PoapSection walletAddress={passport.owner_address} />
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <TalentScoreBanner 
              walletAddress={passport.owner_address} 
              githubUsername={githubUsername}
              showGitHubSection={showGitHubSection}
            />
          </div>
          
          <div>
            <FarcasterCastsSection 
              ensName={ensNameOrAddress?.includes('.') ? ensNameOrAddress : undefined}
              address={passport.owner_address}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default A4Layout;
