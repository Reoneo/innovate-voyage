
import React from 'react';
import MobileProfileColumn from './MobileProfileColumn';
import MobileActivityColumn from './MobileActivityColumn';
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
    if (connectedWallet && passport?.owner_address && connectedWallet.toLowerCase() === passport.owner_address.toLowerCase()) {
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

  // Display the ENS name if available, otherwise show the formatted address
  const displayName = ensNameOrAddress || passport.name || 'Unknown';
  return <div className="w-full h-screen bg-transparent" style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }}>
      {/* Container that takes full height minus navbar with matching side margins */}
      <div className="pt-12 md:pt-20 h-full" style={{
      padding: '48px 2px 2px 2px'
    }}>
        <div className="grid grid-cols-[70%_30%] w-full h-full">
          {/* Left Column - 70% - Main Profile - Positioned at top */}
          <div className="h-full flex items-start my-[2px]">
            <MobileProfileColumn passport={passport} ensNameOrAddress={ensNameOrAddress} normalizedSocials={normalizedSocials} telephone={telephone} isOwner={isOwner} displayName={displayName} />
          </div>

          {/* Right Column - 30% - Activity Cards - Scrollable only */}
          <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <MobileActivityColumn passport={passport} ensNameOrAddress={ensNameOrAddress} githubUsername={githubUsername} showGitHubSection={showGitHubSection} normalizedSocials={normalizedSocials} />
          </div>
        </div>
      </div>
    </div>;
};
export default MobileLayout;
