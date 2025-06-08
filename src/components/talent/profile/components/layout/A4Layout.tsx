
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
      {/* Header Section */}
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
      
      {/* Social Links */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Social Links</h3>
        <SocialLinksSection socials={normalizedSocials} identity={ensNameOrAddress} />
      </div>
      
      {/* Talent Score and Activity */}
      <div className="mb-8">
        <TalentScoreBanner 
          walletAddress={passport.owner_address} 
          githubUsername={githubUsername}
          showGitHubSection={showGitHubSection}
        />
      </div>
      
      {/* Farcaster Activity */}
      <div className="mb-8">
        <FarcasterCastsSection 
          ensName={ensNameOrAddress?.includes('.') ? ensNameOrAddress : undefined}
          address={passport.owner_address}
        />
      </div>
      
      {/* POAPs */}
      <div>
        <PoapSection walletAddress={passport.owner_address} />
      </div>
    </div>
  );
};

export default A4Layout;
