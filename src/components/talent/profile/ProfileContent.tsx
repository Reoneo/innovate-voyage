
import React, { useMemo } from 'react';
import HeaderContainer from './components/HeaderContainer';
import ProfileSkeleton from './ProfileSkeleton';
import ProfileNotFound from './ProfileNotFound';
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
  
  // Extract GitHub username with simplified logic - memoized to prevent recalculation
  const githubData = useMemo(() => {
    if (!passport?.socials?.github) {
      return { githubUsername: null, showGitHubSection: false };
    }

    const githubUrl = passport.socials.github;
    let githubUsername = null;
    
    if (typeof githubUrl === 'string') {
      if (githubUrl.includes('github.com/')) {
        const parts = githubUrl.split('github.com/');
        githubUsername = parts[1]?.split(/[/?#]/)[0]?.trim() || null;
      } else if (githubUrl.startsWith('@')) {
        githubUsername = githubUrl.substring(1).trim() || null;
      } else {
        githubUsername = githubUrl.trim() || null;
      }
    }

    return {
      githubUsername,
      showGitHubSection: !!githubUsername
    };
  }, [passport?.socials?.github]);

  // Memoize the layout component to prevent unnecessary re-renders
  const layoutComponent = useMemo(() => {
    if (!passport) return null;
    
    return (
      <TwoColumnLayout 
        passport={passport}
        ensNameOrAddress={ensNameOrAddress}
        githubUsername={githubData.githubUsername}
        showGitHubSection={githubData.showGitHubSection}
      />
    );
  }, [passport, ensNameOrAddress, githubData.githubUsername, githubData.showGitHubSection]);

  // Show loading state
  if (loading) {
    return (
      <div ref={profileRef} id="resume-pdf" className="w-full pt-14">
        <ProfileSkeleton />
      </div>
    );
  }

  // Show not found state
  if (!passport) {
    return (
      <div ref={profileRef} id="resume-pdf" className="w-full pt-14">
        <ProfileNotFound />
      </div>
    );
  }

  // For mobile, use full screen layout without HeaderContainer
  if (isMobile) {
    return (
      <div ref={profileRef} id="resume-pdf" className="w-full h-screen">
        {layoutComponent}
      </div>
    );
  }

  // Desktop layout with HeaderContainer
  return (
    <div ref={profileRef} id="resume-pdf" className="w-full pt-14">
      <HeaderContainer>
        <div className="w-full space-y-4 md:space-y-6 h-full">
          <div className="w-full flex flex-col gap-4 md:gap-6">
            {layoutComponent}
          </div>
        </div>
      </HeaderContainer>
    </div>
  );
};

export default ProfileContent;
