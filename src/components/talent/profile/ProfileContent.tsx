
import React from 'react';
import HeaderContainer from './components/HeaderContainer';
import ProfileSkeleton from './ProfileSkeleton';
import ProfileNotFound from './ProfileNotFound';
import AvatarSection from './components/AvatarSection';
import ProfileTimeoutError from './components/ProfileTimeoutError';
import MobileLayout from './components/layout/MobileLayout';
import DesktopLayout from './components/layout/DesktopLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { extractGitHubUsername } from '@/utils/githubUsernameExtractor';

interface ProfileContentProps {
  loading: boolean;
  loadingTimeout: boolean;
  passport: any;
  profileRef: React.RefObject<HTMLDivElement>;
  ensNameOrAddress?: string;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  loading,
  loadingTimeout,
  passport,
  profileRef,
  ensNameOrAddress
}) => {
  const isMobile = useIsMobile();
  
  if (loadingTimeout && loading) {
    return <ProfileTimeoutError ensNameOrAddress={ensNameOrAddress} />;
  }
  
  // Get GitHub username from ENS records
  const githubUsername = extractGitHubUsername(passport);
  
  // Debug GitHub data
  console.log('GitHub data from passport:', {
    username: githubUsername,
    originalValue: passport?.socials?.github,
    passport: passport ? 'exists' : 'null'
  });
  
  // Only show GitHub section if there's a GitHub username
  const showGitHubSection = !!githubUsername;

  console.log('Blockchain Activity Debug:', {
    walletAddress: passport?.owner_address,
    hasPassport: !!passport,
    isMobile
  });

  return (
    <div ref={profileRef} id="resume-pdf" className="w-full pt-16">
      {loading && !loadingTimeout ? (
        <ProfileSkeleton />
      ) : passport ? (
        <HeaderContainer>
          <div className="w-full space-y-4 md:space-y-6 h-full">
            <div className="w-full flex flex-col gap-4 md:gap-6">
              {/* Avatar section - always full width */}
              <div className="w-full flex flex-col space-y-3 md:space-y-4">
                <AvatarSection
                  avatarUrl={passport.avatar_url}
                  name={passport.name}
                  ownerAddress={passport.owner_address}
                  socials={{
                    ...passport.socials,
                    linkedin: undefined
                  }}
                  bio={passport.bio}
                  displayIdentity={ensNameOrAddress}
                  additionalEnsDomains={passport.additionalEnsDomains}
                />
              </div>
              
              {/* Content sections */}
              {isMobile ? (
                <MobileLayout
                  passport={passport}
                  ensNameOrAddress={ensNameOrAddress}
                  showGitHubSection={showGitHubSection}
                  githubUsername={githubUsername}
                />
              ) : (
                <DesktopLayout
                  passport={passport}
                  ensNameOrAddress={ensNameOrAddress}
                  showGitHubSection={showGitHubSection}
                  githubUsername={githubUsername}
                />
              )}
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
