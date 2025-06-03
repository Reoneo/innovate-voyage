
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
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(passport.owner_address);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Left Column - 70% */}
      <div className="w-[70%] bg-white flex flex-col items-center justify-center p-6 space-y-4">
        {/* Avatar with black circle background */}
        <div className="relative">
          <div className="w-32 h-32 bg-black rounded-full flex items-center justify-center">
            <ProfileAvatar 
              avatarUrl={passport.avatar_url} 
              name={passport.name}
            />
          </div>
        </div>
        
        {/* Name/Identity */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-1">
            {passport.name || ensNameOrAddress || 'web3.bio'}
          </h1>
          
          {/* Address with copy button */}
          <div className="flex items-center gap-2 justify-center">
            <span className="text-sm text-gray-600 font-mono">
              {passport.owner_address?.substring(0, 6)}...{passport.owner_address?.substring(passport.owner_address.length - 6)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyAddress}
              className="h-6 w-6 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Followers/Following */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span><strong>3</strong> Followers</span>
          <span>•</span>
          <span>Following <strong>0</strong></span>
        </div>

        {/* Follow Button */}
        {!isOwner && passport.owner_address && (
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-2 rounded-md">
            👤 Follow
          </Button>
        )}

        {/* Contact Info */}
        <div className="text-center">
          <ProfileContact 
            email={normalizedSocials.email}
            telephone={telephone}
            isOwner={isOwner}
          />
        </div>

        {/* POAP Section */}
        <div className="w-full max-w-xs">
          <PoapSection walletAddress={passport.owner_address} />
        </div>
      </div>

      {/* Right Column - 30% with scroll */}
      <div className="w-[30%] bg-gray-50 overflow-y-auto p-4 space-y-4">
        {/* Onchain Activity Card */}
        <div className="bg-blue-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">⛓️</span>
            </div>
            <h3 className="font-semibold text-gray-800">Onchain Activity</h3>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <div>First TX: 29/09/2024</div>
            <div>ETH: 0.0259</div>
            <div>TXs: 15</div>
          </div>
        </div>

        {/* NFT Collection Card */}
        <div className="bg-white rounded-2xl p-4 border">
          <h3 className="font-semibold text-gray-800 mb-3">NFT Collection</h3>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">⛵</span>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional sections for scroll */}
        {showGitHubSection && (
          <div className="bg-white rounded-2xl p-4 border">
            <h3 className="font-semibold text-gray-800 mb-2">GitHub Activity</h3>
            <GitHubContributionGraph username={githubUsername!} />
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 border">
          <h3 className="font-semibold text-gray-800 mb-2">Social Links</h3>
          <SocialLinksSection socials={normalizedSocials} identity={ensNameOrAddress} />
        </div>

        <div className="bg-white rounded-2xl p-4 border">
          <h3 className="font-semibold text-gray-800 mb-2">Talent Score</h3>
          <TalentScoreBanner walletAddress={passport.owner_address} />
        </div>

        <div className="bg-white rounded-2xl p-4 border">
          <h3 className="font-semibold text-gray-800 mb-2">Farcaster</h3>
          <FarcasterCastsSection 
            ensName={ensNameOrAddress?.includes('.') ? ensNameOrAddress : undefined}
            address={passport.owner_address}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;
