
import React from 'react';
import ProfileAvatar from '../ProfileAvatar';
import ProfileContact from '../ProfileContact';
import NameSection from '../identity/NameSection';
import AdditionalEnsDomains from '../identity/AdditionalEnsDomains';
import SocialLinksSection from '../social/SocialLinksSection';
import FollowButton from '../identity/FollowButton';
import PoapSection from '../poap/PoapSection';
import TalentScoreBanner from '../TalentScoreBanner';
import FarcasterCastsSection from '../farcaster/FarcasterCastsSection';

interface MobileProfileLayoutProps {
  passport: any;
  ensNameOrAddress?: string;
  githubUsername: string | null;
  showGitHubSection: boolean;
}

const MobileProfileLayout: React.FC<MobileProfileLayoutProps> = ({
  passport,
  ensNameOrAddress,
  githubUsername,
  showGitHubSection
}) => {
  const [isOwner, setIsOwner] = React.useState(false);
  
  React.useEffect(() => {
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    if (connectedWallet && passport?.owner_address && 
        connectedWallet.toLowerCase() === passport.owner_address.toLowerCase()) {
      setIsOwner(true);
    }
  }, [passport?.owner_address]);

  // Format socials object
  const normalizedSocials: Record<string, string> = {};
  Object.entries(passport?.socials || {}).forEach(([key, value]) => {
    if (value && typeof value === 'string' && value.trim() !== '') {
      normalizedSocials[key.toLowerCase()] = value;
    }
  });

  const telephone = normalizedSocials.telephone || normalizedSocials.whatsapp;

  return (
    <div className="w-full px-4 space-y-6">
      {/* Profile Header Section */}
      <div className="flex flex-col items-center space-y-4 bg-white rounded-xl p-6 shadow-sm border">
        <ProfileAvatar 
          avatarUrl={passport.avatar_url} 
          name={passport.name} 
        />
        
        <div className="text-center w-full">
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

      {/* Social Links */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <SocialLinksSection socials={normalizedSocials} identity={ensNameOrAddress} />
      </div>
      
      {/* Scores and Activities */}
      <TalentScoreBanner 
        walletAddress={passport.owner_address} 
        githubUsername={githubUsername}
        showGitHubSection={showGitHubSection}
      />
      
      {/* POAP Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <PoapSection walletAddress={passport.owner_address} />
      </div>
      
      {/* Farcaster Section */}
      <div className="bg-white rounded-xl shadow-sm border">
        <FarcasterCastsSection 
          ensName={ensNameOrAddress?.includes('.') ? ensNameOrAddress : undefined}
          address={passport.owner_address}
        />
      </div>
    </div>
  );
};

export default MobileProfileLayout;
