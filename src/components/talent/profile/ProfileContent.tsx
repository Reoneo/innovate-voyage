
import React from 'react';
import HeaderContainer from './components/HeaderContainer';
import ProfileSkeleton from './ProfileSkeleton';
import ProfileNotFound from './ProfileNotFound';
import AvatarSection from './components/AvatarSection';
import TalentScoreBanner from './components/TalentScoreBanner';
import GitHubContributionGraph from './components/github/GitHubContributionGraph';
import FarcasterCastsSection from './components/farcaster/FarcasterCastsSection';
import TwoColumnLayout from './components/layout/TwoColumnLayout';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfileContentProps {
  loading: boolean;
  loadingTimeout: boolean;
  passport: any;
  profileRef: React.RefObject<HTMLDivElement>;
  ensNameOrAddress?: string;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  loading,
  passport,
  profileRef,
  ensNameOrAddress
}) => {
  const isMobile = useIsMobile();
  
  // Extract GitHub username with simplified logic
  const extractGitHubUsername = () => {
    if (passport?.socials?.github) {
      const githubUrl = passport.socials.github;
      
      if (typeof githubUrl === 'string') {
        if (githubUrl.includes('github.com/')) {
          const parts = githubUrl.split('github.com/');
          return parts[1]?.split(/[/?#]/)[0]?.trim() || null;
        }
        
        if (githubUrl.startsWith('@')) {
          return githubUrl.substring(1).trim() || null;
        }
        
        return githubUrl.trim() || null;
      }
    }
    
    return null;
  };

  const githubUsername = extractGitHubUsername();
  const showGitHubSection = !!githubUsername;

  return (
    <div ref={profileRef} id="resume-pdf" className="w-full pt-14">
      {loading ? (
        <ProfileSkeleton />
      ) : passport ? (
        <HeaderContainer>
          <div className="w-full space-y-4 md:space-y-6 h-full">
            <div className="w-full flex flex-col gap-4 md:gap-6">
              <TwoColumnLayout 
                passport={passport}
                ensNameOrAddress={ensNameOrAddress}
                githubUsername={githubUsername}
                showGitHubSection={showGitHubSection}
              />
            </div>
          </div>
        </HeaderContainer>
      ) : (
        <ProfileNotFound />
      )}
    </div>
  );
};

export default ProfileContent;
