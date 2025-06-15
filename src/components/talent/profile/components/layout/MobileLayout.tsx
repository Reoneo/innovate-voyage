
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
    <div className="w-full bg-transparent pt-16 sm:pt-20 pb-8 px-2">
      <div className="flex flex-col gap-4">
        <MobileProfileColumn 
          passport={passport} 
          ensNameOrAddress={ensNameOrAddress} 
          normalizedSocials={normalizedSocials} 
          telephone={telephone} 
          isOwner={isOwner} 
          displayName={displayName} 
        />
        <MobileActivityColumn 
          passport={passport} 
          ensNameOrAddress={ensNameOrAddress} 
          githubUsername={githubUsername} 
          showGitHubSection={showGitHubSection} 
          normalizedSocials={normalizedSocials} 
        />
      </div>
    </div>
  );
};
export default MobileLayout;
