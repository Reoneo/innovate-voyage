
import React from 'react';
import ProfileSkeleton from './ProfileSkeleton';
import ProfileNotFound from './ProfileNotFound';
import AvatarSection from './components/AvatarSection';
import TalentScoreBanner from './components/TalentScoreBanner';
import { extractGitHubUsername } from './components/GithubUsernameExtractor';
import ProfileTimeoutError from './components/error-states/ProfileTimeoutError';
import ProfileError from './components/error-states/ProfileError';
import GitHubSection from './components/github/GitHubSection';
import WorkSection from './components/work/WorkSection';
import ProfileLayout from './components/layout/ProfileLayout';

interface ProfileContentProps {
  loading: boolean;
  loadingTimeout: boolean;
  error?: string | null;
  passport: any;
  profileRef: React.RefObject<HTMLDivElement>;
  ensNameOrAddress?: string;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  loading,
  loadingTimeout,
  error,
  passport,
  profileRef,
  ensNameOrAddress
}) => {
  // Handle loading timeout error
  if (loadingTimeout && loading) {
    return <ProfileTimeoutError ensNameOrAddress={ensNameOrAddress} />;
  }
  
  // Handle profile loading error
  if (error) {
    return <ProfileError ensNameOrAddress={ensNameOrAddress} error={error} />;
  }
  
  // Get GitHub username from social links
  const githubUsername = passport?.socials ? extractGitHubUsername(passport.socials) : null;
  
  // Debug logging
  console.log('GitHub data from passport:', {
    username: githubUsername,
    originalValue: passport?.socials?.github,
    passport: passport ? 'exists' : 'null'
  });

  return (
    <div ref={profileRef} id="resume-pdf" className="w-full pt-16">
      {loading && !loadingTimeout ? (
        <ProfileSkeleton />
      ) : passport ? (
        <ProfileLayout 
          leftColumn={
            <AvatarSection
              avatarUrl={passport.avatar_url}
              name={passport.name}
              ownerAddress={passport.owner_address}
              socials={{
                ...passport.socials,
                linkedin: passport.socials.linkedin ? passport.socials.linkedin : undefined
              }}
              bio={passport.bio}
              displayIdentity={ensNameOrAddress}
              additionalEnsDomains={passport.additionalEnsDomains}
            />
          }
          rightColumn={
            <>
              <TalentScoreBanner walletAddress={passport.owner_address} />
              
              {/* GitHub contribution graph */}
              <GitHubSection githubUsername={githubUsername} />
              
              {/* Work experience sections */}
              <WorkSection 
                socials={passport.socials} 
                ownerAddress={passport.owner_address} 
              />
            </>
          }
        />
      ) : (
        <ProfileNotFound />
      )}
    </div>
  );
};

export default ProfileContent;
