
import React from 'react';
import HeaderContainer from './components/HeaderContainer';
import ProfileSkeleton from './ProfileSkeleton';
import ProfileNotFound from './ProfileNotFound';
import AvatarSection from './components/AvatarSection';
import TalentScoreBanner from './components/TalentScoreBanner';
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
    // First check if we already have github username directly in socials
    if (passport?.socials?.github) {
      const directGithub = passport.socials.github;
      console.log('GitHub from passport.socials.github:', directGithub);
      
      // If it's already a clean username (no URL), return it
      if (typeof directGithub === 'string' && !directGithub.includes('/') && !directGithub.includes('.')) {
        if (directGithub.startsWith('@')) {
          return directGithub.substring(1); // Remove @ prefix
        }
        return directGithub;
      }
    }
    
    // If nothing found or we need to extract from URL
    if (!passport?.socials?.github) {
      console.log('No GitHub social link found in passport');
      return null;
    }
    
    const githubUrl = passport.socials.github;
    console.log('Extracting GitHub username from:', githubUrl);
    
    try {
      // Handle different GitHub URL formats
      if (typeof githubUrl === 'string') {
        // Handle github.com URL format
        if (githubUrl.includes('github.com/')) {
          const parts = githubUrl.split('github.com/');
          // Get everything after github.com/ and before any query params or hashes
          const username = parts[1]?.split(/[/?#]/)[0];
          console.log('Extracted GitHub username from URL:', username);
          return username?.trim() || null;
        }
        
        // Handle direct username format with @ prefix
        if (githubUrl.startsWith('@')) {
          const username = githubUrl.substring(1).trim(); // Remove @ prefix
          console.log('Extracted GitHub username from @-prefix:', username);
          return username || null;
        }
        
        // Handle pure username format (no URL, no @)
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
          <div className="w-full space-y-6 h-full">
            {/* Avatar and basic info section */}
            <div className={`w-full ${isMobile ? 'flex flex-col space-y-4' : 'grid grid-cols-1 md:grid-cols-10 gap-6'}`}>
              <div className={`${isMobile ? 'w-full' : 'md:col-span-3'} flex flex-col space-y-4`}>
                <AvatarSection
                  avatarUrl={passport.avatar_url}
                  name={passport.name}
                  ownerAddress={passport.owner_address}
                  socials={{
                    ...passport.socials,
                    // Remove LinkedIn from socials to hide it completely
                    linkedin: undefined
                  }}
                  bio={passport.bio}
                  displayIdentity={ensNameOrAddress}
                  additionalEnsDomains={passport.additionalEnsDomains}
                />
              </div>
              
              {/* Content sections */}
              <div className={`${isMobile ? 'w-full' : 'md:col-span-7'} space-y-6`}>
                <TalentScoreBanner walletAddress={passport.owner_address} />
                
                {/* GitHub contribution graph */}
                {showGitHubSection && (
                  <div>
                    <GitHubContributionGraph username={githubUsername!} />
                  </div>
                )}
                
                {/* LinkedIn section is now completely hidden - removed from this component */}
              </div>
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
