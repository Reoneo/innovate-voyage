
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
    <div className="w-full max-w-full space-y-4 px-2 py-2">
      {/* Profile Header Section - Compact */}
      <div className="flex flex-col items-center space-y-3 bg-white rounded-lg p-4 shadow-sm border w-full">
        <ProfileAvatar 
          avatarUrl={passport.avatar_url} 
          name={passport.name} 
        />
        
        <div className="text-center w-full space-y-2">
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
            <p className="text-sm text-muted-foreground break-words px-2">
              {passport.bio}
            </p>
          )}
        </div>
      </div>

      {/* Social Links - Compact */}
      <div className="bg-white rounded-lg p-4 shadow-sm border w-full">
        <SocialLinksSection socials={normalizedSocials} identity={ensNameOrAddress} />
      </div>
      
      {/* Scores and Activities - Compact */}
      <div className="w-full">
        <TalentScoreBanner 
          walletAddress={passport.owner_address} 
          githubUsername={githubUsername}
          showGitHubSection={showGitHubSection}
        />
      </div>
      
      {/* POAP Section - Compact */}
      <div className="bg-white rounded-lg p-4 shadow-sm border w-full">
        <PoapSection walletAddress={passport.owner_address} />
      </div>
      
      {/* Farcaster Section - Compact */}
      <div className="bg-white rounded-lg shadow-sm border w-full">
        <FarcasterCastsSection 
          ensName={ensNameOrAddress?.includes('.') ? ensNameOrAddress : undefined}
          address={passport.owner_address}
        />
      </div>
    </div>
  );
};

export default MobileProfileLayout;
