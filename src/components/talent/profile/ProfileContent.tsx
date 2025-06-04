
import React from 'react';
import HeaderContainer from './components/HeaderContainer';
import ProfileSkeleton from './ProfileSkeleton';
import ProfileNotFound from './ProfileNotFound';
import TwoColumnLayout from './components/layout/TwoColumnLayout';
import MobileProfileLayout from './components/layout/MobileProfileLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDataPreloader } from '@/hooks/useDataPreloader';

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
  
  // Preload data
  useDataPreloader(passport?.owner_address, ensNameOrAddress);
  
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
          <div className="w-full h-full">
            {isMobile ? (
              <MobileProfileLayout 
                passport={passport}
                ensNameOrAddress={ensNameOrAddress}
                githubUsername={githubUsername}
                showGitHubSection={showGitHubSection}
              />
            ) : (
              <TwoColumnLayout 
                passport={passport}
                ensNameOrAddress={ensNameOrAddress}
                githubUsername={githubUsername}
                showGitHubSection={showGitHubSection}
              />
            )}
          </div>
        </HeaderContainer>
      ) : (
        <ProfileNotFound />
      )}
    </div>
  );
};

export default ProfileContent;
