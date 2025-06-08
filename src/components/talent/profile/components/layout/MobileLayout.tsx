
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

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
      {/* Left Column - 70% - Main Profile */}
      <div className="w-[70%] bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Gradient background accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-30"></div>
        
        <div className="relative z-10 flex flex-col items-center space-y-4 max-w-full">
          {/* Avatar with enhanced styling */}
          <div className="relative">
            <div className="w-36 h-36 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                <ProfileAvatar 
                  avatarUrl={passport.avatar_url} 
                  name={passport.name}
                />
              </div>
            </div>
          </div>
          
          {/* Name/Identity with better typography */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {passport.name || ensNameOrAddress || 'web3.bio'}
            </h1>
            
            {/* Address with improved copy functionality */}
            <div className="flex items-center gap-2 justify-center bg-gray-50 rounded-full px-4 py-2">
              <span className="text-sm text-gray-600 font-mono">
                {passport.owner_address?.substring(0, 6)}...{passport.owner_address?.substring(passport.owner_address.length - 6)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyAddress}
                className="h-6 w-6 p-0 hover:bg-gray-200"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Enhanced Followers/Following */}
          <div className="flex items-center gap-6 text-sm text-gray-600 bg-white rounded-lg px-4 py-2 shadow-sm">
            <span><strong className="text-gray-900">3</strong> Followers</span>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <span>Following <strong className="text-gray-900">0</strong></span>
          </div>

          {/* Enhanced Follow Button */}
          {!isOwner && passport.owner_address && (
            <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200">
              👤 Follow
            </Button>
          )}

          {/* Contact Info with better visibility */}
          {(normalizedSocials.email || telephone) && (
            <div className="text-center bg-white rounded-lg p-3 shadow-sm">
              {normalizedSocials.email && (
                <div className="flex items-center gap-2 justify-center text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{normalizedSocials.email}</span>
                </div>
              )}
              {telephone && (
                <div className="flex items-center gap-2 justify-center text-sm text-gray-600 mt-1">
                  <span>📱 {telephone}</span>
                </div>
              )}
            </div>
          )}

          {/* POAPs Section - Enhanced */}
          <div className="w-full max-w-xs">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <PoapSection walletAddress={passport.owner_address} />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - 30% - Activity Cards with improved scroll */}
      <div className="w-[30%] bg-gray-50 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {/* Activity Cards with enhanced styling */}
        <TalentScoreBanner walletAddress={passport.owner_address} />

        {/* GitHub Section - Enhanced Card */}
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

        {/* Social Links - Enhanced Card */}
        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
            <span className="text-lg">🔗</span>
            Social Links
          </h3>
          <SocialLinksSection socials={normalizedSocials} identity={ensNameOrAddress} />
        </Card>

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

        {/* Additional ENS Domains if available */}
        {passport.additionalEnsDomains?.length > 0 && (
          <Card className="p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
              <span className="text-lg">🌐</span>
              Other Domains
            </h3>
            <AdditionalEnsDomains domains={passport.additionalEnsDomains} />
          </Card>
        )}
      </div>
    </div>
  );
};

export default MobileLayout;
