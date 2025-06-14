
import React from 'react';
import MobileProfileColumn from './MobileProfileColumn';
import MobileActivityColumn from './MobileActivityColumn';
import EducationSection from '../education/EducationSection';

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
  // Format socials object to ensure all keys are lowercase for consistency
  const normalizedSocials: Record<string, string> = {};
  Object.entries(passport?.socials || {}).forEach(([key, value]) => {
    if (value && typeof value === 'string' && value.trim() !== '') {
      normalizedSocials[key.toLowerCase()] = value;
    }
  });

  const telephone = normalizedSocials.telephone || normalizedSocials.whatsapp;
  const displayName = passport.name || ensNameOrAddress || 'Anonymous';

  // Check if current user is the owner
  const [isOwner, setIsOwner] = React.useState(false);
  React.useEffect(() => {
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    if (connectedWallet && passport?.owner_address && 
        connectedWallet.toLowerCase() === passport.owner_address.toLowerCase()) {
      setIsOwner(true);
    }
  }, [passport?.owner_address]);

  return (
    <div className="flex flex-col space-y-4 p-4 w-full h-full overflow-y-auto">
      {/* Profile Column */}
      <MobileProfileColumn 
        passport={passport}
        ensNameOrAddress={ensNameOrAddress}
        normalizedSocials={normalizedSocials}
        telephone={telephone}
        isOwner={isOwner}
        displayName={displayName}
      />
      
      {/* Education Section */}
      <EducationSection walletAddress={passport.owner_address} />
      
      {/* Activity Column */}
      <MobileActivityColumn 
        passport={passport}
        ensNameOrAddress={ensNameOrAddress}
        githubUsername={githubUsername}
        showGitHubSection={showGitHubSection}
        normalizedSocials={normalizedSocials}
      />
    </div>
  );
};

export default MobileLayout;
