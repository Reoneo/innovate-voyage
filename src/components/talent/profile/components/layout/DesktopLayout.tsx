
import React from 'react';
import AvatarSection from '../AvatarSection';
import TalentScoreBanner from '../TalentScoreBanner';
import GitHubContributionGraph from '../github/GitHubContributionGraph';
import FarcasterCastsSection from '../farcaster/FarcasterCastsSection';
import PoapSection from '../poap/PoapSection';
import VerifiedWorkExperience from '../VerifiedWorkExperience';
import SkillsCard from '../SkillsCard';
import ProfessionalSummary from '../ProfessionalSummary';

interface DesktopLayoutProps {
  passport: any;
  ensNameOrAddress?: string;
  githubUsername: string | null;
  showGitHubSection: boolean;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  passport,
  ensNameOrAddress,
  githubUsername,
  showGitHubSection
}) => {
  return (
    <div className="hidden md:grid md:grid-cols-2 gap-8 w-full p-4 bg-black/10 backdrop-blur-sm rounded-lg">
      {/* Left Column: Avatar, Summary, Skills, POAPs */}
      <div className="space-y-6">
        <div className="scale-[0.8] origin-top">
          <AvatarSection
            avatarUrl={passport.avatar_url}
            name={passport.name}
            ownerAddress={passport.owner_address}
            socials={passport.socials}
            bio={passport.bio}
            displayIdentity={ensNameOrAddress}
            additionalEnsDomains={passport.additionalEnsDomains}
          />
        </div>

        <ProfessionalSummary passportData={passport} />

        <SkillsCard walletAddress={passport.owner_address} skills={passport.skills} />
        
        <PoapSection walletAddress={passport.owner_address} />
      </div>
      
      {/* Right Column: Experience, GitHub, Scores */}
      <div className="space-y-6">
        <VerifiedWorkExperience walletAddress={passport.owner_address} />
        
        {showGitHubSection && (
          <GitHubContributionGraph username={githubUsername!} />
        )}
        
        <TalentScoreBanner walletAddress={passport.owner_address} />
        
        <FarcasterCastsSection 
          ensName={ensNameOrAddress?.includes('.') ? ensNameOrAddress : undefined}
          address={passport.owner_address}
        />
      </div>
    </div>
  );
};

export default DesktopLayout;
