
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
    // First check if we already have github username directly in socials
    if (passport?.socials?.github) {
      const directGithub = passport.socials.github;
      console.log('GitHub from passport.socials.github:', directGithub);
      
      if (typeof directGithub === 'string' && !directGithub.includes('/') && !directGithub.includes('.')) {
        if (directGithub.startsWith('@')) {
          return directGithub.substring(1);
        }
        return directGithub;
      }
    }
    
    if (!passport?.socials?.github) {
      console.log('No GitHub social link found in passport');
      return null;
    }
    
    const githubUrl = passport.socials.github;
    console.log('Extracting GitHub username from:', githubUrl);
    
    try {
      if (typeof githubUrl === 'string') {
        if (githubUrl.includes('github.com/')) {
          const parts = githubUrl.split('github.com/');
          const username = parts[1]?.split(/[/?#]/)[0];
          console.log('Extracted GitHub username from URL:', username);
          return username?.trim() || null;
        }
        
        if (githubUrl.startsWith('@')) {
          const username = githubUrl.substring(1).trim();
          console.log('Extracted GitHub username from @-prefix:', username);
          return username || null;
        }
        
        if (githubUrl.trim() !== '') {
          const username = githubUrl.trim();
          console.log('Using GitHub value directly as username:', username);
          return username;
        }
      }
    } catch (error) {
      console.error('Error extracting GitHub username:', error);
    }
    
    console.log('Could not extract GitHub username');
    return null;
  };

  // Get GitHub username from ENS records
  const githubUsername = extractGitHubUsername();
  
  // Debug GitHub data
  console.log('GitHub data from passport:', {
    username: githubUsername,
    originalValue: passport?.socials?.github,
    passport: passport ? 'exists' : 'null'
  });
  
  // Only show GitHub section if there's a GitHub username
  const showGitHubSection = !!githubUsername;

  return (
    <div ref={profileRef} id="resume-pdf" className="w-full pt-16">
      {loading && !loadingTimeout ? (
        <ProfileSkeleton />
      ) : passport ? (
        <HeaderContainer>
          <div className="w-full space-y-4 md:space-y-6 h-full">
            <div className="w-full flex flex-col gap-4 md:gap-6">
              {/* Mobile Layout - Existing stacked layout */}
              {isMobile ? (
                <>
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
                  
                  {/* Content sections - always stacked vertically */}
                  <div className="w-full space-y-4 md:space-y-6">
                    <TalentScoreBanner walletAddress={passport.owner_address} />
                    
                    {/* GitHub Section */}
                    {showGitHubSection && (
                      <div className="w-full">
                        <GitHubContributionGraph username={githubUsername!} />
                      </div>
                    )}
                    
                    {/* Farcaster Section */}
                    <div className="w-full">
                      <FarcasterCastsSection 
                        ensName={ensNameOrAddress?.includes('.') ? ensNameOrAddress : undefined}
                        address={passport.owner_address}
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Desktop Layout - New 2-column layout */
                <TwoColumnLayout 
                  passport={passport}
                  ensNameOrAddress={ensNameOrAddress}
                  githubUsername={githubUsername}
                  showGitHubSection={showGitHubSection}
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
