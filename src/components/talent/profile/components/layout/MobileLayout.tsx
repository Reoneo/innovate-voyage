
import React from 'react';
import ProfileAvatar from '../ProfileAvatar';
import ProfileContact from '../ProfileContact';
import NameSection from '../identity/NameSection';
import AdditionalEnsDomains from '../identity/AdditionalEnsDomains';
import SocialLinksSection from '../social/SocialLinksSection';
import FollowButton from '../identity/FollowButton';
import PoapSection from '../poap/PoapSection';
import TalentScoreBanner from '../TalentScoreBanner';
import GitHubContributionGraph from '../github/GitHubContributionGraph';
import FarcasterCastsSection from '../farcaster/FarcasterCastsSection';
import { Copy, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface MobileLayoutProps {
  passport: any;
  ensNameOrAddress?: string;
  githubUsername: string | null;
  showGitHubSection: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
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

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(passport.owner_address);
    } catch (error) {
      console.log('Copy failed, using fallback');
    }
  };

  // Display the ENS name if available, otherwise show the formatted address
  const displayName = ensNameOrAddress || passport.name || 'Unknown';
  const isEnsName = ensNameOrAddress?.includes('.');

  return (
    <div className="grid md:grid-cols-[70%_30%] gap-0 w-full h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      {/* Left Column - 70% - Main Profile (matching desktop structure) */}
      <div className="bg-white flex flex-col justify-center items-center p-6 relative overflow-hidden">
        {/* Gradient background accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-30"></div>
        
        <div className="relative z-10 space-y-6 text-center w-full max-w-md">
          {/* Avatar - Square without border */}
          <div className="flex justify-center">
            <div className="w-48 h-48">
              <ProfileAvatar 
                avatarUrl={passport.avatar_url} 
                name={displayName}
              />
            </div>
          </div>
          
          {/* Name and Address */}
          <div>
            <NameSection 
              name={passport.name} 
              ownerAddress={passport.owner_address}
              displayIdentity={ensNameOrAddress}
            />
          </div>
          
          {/* Additional ENS Domains */}
          {passport.additionalEnsDomains?.length > 0 && (
            <div>
              <AdditionalEnsDomains domains={passport.additionalEnsDomains} />
            </div>
          )}
          
          {/* Contact Info */}
          <div>
            <ProfileContact 
              email={normalizedSocials.email}
              telephone={telephone}
              isOwner={isOwner}
            />
          </div>
          
          {/* Follow Button - matching desktop */}
          {!isOwner && passport.owner_address && (
            <div>
              <FollowButton targetAddress={passport.owner_address} />
            </div>
          )}
          
          {/* ENS Bio */}
          {passport.bio && (
            <div>
              <p className="text-sm text-muted-foreground">
                {passport.bio}
              </p>
            </div>
          )}
          
          {/* Social Links */}
          <div>
            <SocialLinksSection socials={normalizedSocials} identity={ensNameOrAddress} />
          </div>
          
          {/* POAP Section */}
          <div>
            <PoapSection walletAddress={passport.owner_address} />
          </div>
        </div>
      </div>

      {/* Right Column - 30% - Activity Cards */}
      <div className="bg-gray-50 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {/* Talent Score Banner with updated styling */}
        <div className="space-y-3">
          <TalentScoreBanner walletAddress={passport.owner_address} />
        </div>

        {/* GitHub Section */}
        {showGitHubSection && (
          <Card className="p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">GitHub Activity</h3>
            </div>
            <GitHubContributionGraph username={githubUsername!} />
          </Card>
        )}

        {/* Farcaster - Enhanced Card */}
        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
            <span className="text-lg">💬</span>
            Farcaster
          </h3>
          <FarcasterCastsSection 
            ensName={ensNameOrAddress?.includes('.') ? ensNameOrAddress : undefined}
            address={passport.owner_address}
          />
        </Card>
      </div>
    </div>
  );
};

export default MobileLayout;
