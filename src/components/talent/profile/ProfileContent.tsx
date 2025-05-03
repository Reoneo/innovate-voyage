
import React from 'react';
import HeaderContainer from './components/HeaderContainer';
import ProfileSkeleton from './ProfileSkeleton';
import ProfileNotFound from './ProfileNotFound';
import AvatarSection from './components/AvatarSection';
import TalentScoreBanner from './components/TalentScoreBanner';
import GitHubContributions from './components/github/GitHubContributions';
import GitHubContributionGraph from './components/github/GitHubContributionGraph';
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
  loadingTimeout,
  passport,
  profileRef,
  ensNameOrAddress
}) => {
  const isMobile = useIsMobile();
  
  if (loadingTimeout && loading) {
    return <ProfileTimeoutError ensNameOrAddress={ensNameOrAddress} />;
  }
  
  // Extract GitHub username from social links with improved handling
  const extractGitHubUsername = () => {
    console.log('Extracting GitHub username from:', passport?.socials?.github);
    
    if (!passport?.socials?.github) return null;
    
    const githubUrl = passport.socials.github;
    
    // Handle different GitHub URL formats
    if (githubUrl.includes('github.com/')) {
      const parts = githubUrl.split('github.com/');
      // Get everything after github.com/ and before any query params or hashes
      const username = parts[1].split(/[/?#]/)[0];
      console.log('Extracted GitHub username from URL:', username);
      return username;
    }
    
    // Handle direct username format
    if (githubUrl.startsWith('@')) {
      const username = githubUrl.substring(1); // Remove @ prefix
      console.log('Extracted GitHub username from @-prefix:', username);
      return username;
    }
    
    console.log('Using GitHub value directly as username:', githubUrl);
    return githubUrl; // Assume it's already a username
  };

  // Determine if GitHub is verified with better logging
  const isGitHubVerified = !!passport?.socials?.github;
  const githubUsername = extractGitHubUsername();
  
  console.log('GitHub data:', {
    isVerified: isGitHubVerified,
    username: githubUsername,
    originalValue: passport?.socials?.github
  });
  
  // Only show GitHub section if there's an actual GitHub account linked
  const showGitHubSection = isGitHubVerified && githubUsername;
  
  return (
    <div ref={profileRef} id="resume-pdf" className="w-full pt-16">
      {loading && !loadingTimeout ? (
        <ProfileSkeleton />
      ) : passport ? (
        <HeaderContainer>
          <div className="w-full grid grid-cols-1 md:grid-cols-10 gap-6 h-full">
            <div className={`${isMobile ? 'w-full' : 'md:col-span-3'} flex flex-col space-y-4`}>
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
            </div>
            <div className={`${isMobile ? 'w-full' : 'md:col-span-7'} space-y-6`}>
              <TalentScoreBanner walletAddress={passport.owner_address} />
              
              {/* GitHub Contributions - Only show if GitHub is linked */}
              {showGitHubSection && (
                <div className="mt-6">
                  <h3 className="text-xl font-medium mb-3">GitHub Activity</h3>
                  
                  {/* Attempt 1: Using our existing component */}
                  <GitHubContributions 
                    username={githubUsername} 
                    isVerified={true} 
                  />
                  
                  {/* Attempt 2: Using the alternative component */}
                  <div className="mt-4">
                    <GitHubContributionGraph username={githubUsername} />
                  </div>
                </div>
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

const ProfileTimeoutError: React.FC<{ ensNameOrAddress?: string }> = ({ ensNameOrAddress }) => (
  <div className="min-h-screen bg-gray-50 py-4 md:py-8">
    <div className="container mx-auto px-4" style={{ maxWidth: '21cm' }}>
      <HeaderContainer>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't load the profile for {ensNameOrAddress}. The request timed out.
          </p>
        </div>
      </HeaderContainer>
    </div>
  </div>
);
