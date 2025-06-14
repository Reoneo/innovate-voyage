
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
  return (
    <div className="flex flex-col space-y-4 p-4 w-full h-full overflow-y-auto">
      {/* Profile Column */}
      <MobileProfileColumn 
        passport={passport}
        ensNameOrAddress={ensNameOrAddress}
      />
      
      {/* Education Section */}
      <EducationSection walletAddress={passport.owner_address} />
      
      {/* Activity Column */}
      <MobileActivityColumn 
        passport={passport}
        ensNameOrAddress={ensNameOrAddress}
        githubUsername={githubUsername}
        showGitHubSection={showGitHubSection}
      />
    </div>
  );
};

export default MobileLayout;
