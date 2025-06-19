
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

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Professional CV Layout - Single Column on Mobile */}
      <div className="pt-16 pb-8 px-4 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Header Section - Professional Layout */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200">
            <MobileProfileColumn 
              passport={passport} 
              ensNameOrAddress={ensNameOrAddress} 
              normalizedSocials={normalizedSocials} 
              telephone={telephone} 
              isOwner={isOwner} 
              displayName={displayName} 
            />
          </div>

          {/* Activity Section - Professional Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Professional Profile
            </h3>
            <MobileActivityColumn 
              passport={passport} 
              ensNameOrAddress={ensNameOrAddress} 
              githubUsername={githubUsername} 
              showGitHubSection={showGitHubSection} 
              normalizedSocials={normalizedSocials} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;
